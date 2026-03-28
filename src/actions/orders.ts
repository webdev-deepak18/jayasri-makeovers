"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Type definitions based on our schema
export type OrderStatus = "upcoming" | "completed" | "cancelled";
export type MakeupType = "Bridal" | "Pre-Wedding" | "Engagement" | "Party" | "Saree Draping" | "Other";

export interface DashboardStats {
  totalEarnings: number;
  earningsThisMonth: number;
  activeOrdersCount: number;
  upcomingOrders: any[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  
  // 1. Total Earnings (all completed or upcoming advance)
  // Actually, let's just sum `advance_amount` for all time as cash-in-hand
  const { data: allOrders } = await supabase.from("orders").select("advance_amount, total_price, status, date");
  
  let totalEarnings = 0;
  let earningsThisMonth = 0;
  let activeOrdersCount = 0;

  if (allOrders) {
    allOrders.forEach(o => {
      // Sum advance amounts (money received)
      totalEarnings += Number(o.advance_amount || 0);
      
      // Calculate this month
      if (new Date(o.date) >= new Date(firstDayOfMonth)) {
        earningsThisMonth += Number(o.advance_amount || 0);
      }

      // Count active (upcoming)
      if (o.status === 'upcoming') {
        activeOrdersCount++;
      }
    });
  }

  // 2. Next 5 upcoming orders
  const { data: upcomingOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "upcoming")
    .gte("date", today.toISOString().split('T')[0])
    .order("date", { ascending: true })
    .limit(5);

  return {
    totalEarnings,
    earningsThisMonth,
    activeOrdersCount,
    upcomingOrders: upcomingOrders || [],
  };
}

export async function getOrders(statusFilter?: string) {
  let query = supabase.from("orders").select("*").order("date", { ascending: false });
  
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getClients() {
  // Get unique clients by name + phone
  const { data, error } = await supabase
    .from("orders")
    .select("client_name, phone_number, location")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];
  
  // Deduplicate
  const uniquePhones = Array.from(new Set(data.map(c => c.phone_number)));
  const uniqueClients = uniquePhones.map(phone => {
    return data.find(c => c.phone_number === phone)!;
  });

  return uniqueClients;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createOrder(formData: FormData) {
  const orderData = {
    client_name: formData.get("client_name") as string,
    phone_number: formData.get("phone_number") as string,
    makeup_type: formData.get("makeup_type") as string,
    date: formData.get("date") as string,
    location: formData.get("location") as string,
    total_price: parseFloat(formData.get("total_price") as string) || 0,
    advance_amount: parseFloat(formData.get("advance_amount") as string) || 0,
    custom_message: formData.get("custom_message") as string,
    status: (formData.get("status") as string) || "upcoming",
  };

  const { error } = await supabase.from("orders").insert([orderData]);
  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout"); // Bust all cache to update calendar & dashboard
  return { success: true };
}

export async function updateOrder(id: string, formData: FormData) {
  const orderData = {
    client_name: formData.get("client_name") as string,
    phone_number: formData.get("phone_number") as string,
    makeup_type: formData.get("makeup_type") as string,
    date: formData.get("date") as string,
    location: formData.get("location") as string,
    total_price: parseFloat(formData.get("total_price") as string) || 0,
    advance_amount: parseFloat(formData.get("advance_amount") as string) || 0,
    custom_message: formData.get("custom_message") as string,
    status: (formData.get("status") as string) || "upcoming",
  };

  const { error } = await supabase.from("orders").update(orderData).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getPublicBookedDates() {
  const { data } = await supabase
    .from("orders")
    .select("date")
    .neq("status", "cancelled");
  return data?.map(o => o.date) || [];
}
