"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Type definitions based on our schema
export type OrderStatus = "upcoming" | "completed" | "cancelled";
export type MakeupType = "Bridal" | "Pre-Wedding" | "Engagement" | "Party" | "Saree Draping" | "Other";

export interface DashboardStats {
  /** Completed orders: full total_price. Upcoming orders: advance only. Real money = yours. */
  totalEarned: number;
  /** Balance still to collect across all upcoming orders */
  pendingToCollect: number;
  /** All advance amounts received so far (cash in hand) */
  cashCollected: number;
  totalTravelExpense: number;
  totalOtherExpense: number;
  /** totalEarned logic applied to this month's events only */
  earningsThisMonth: number;
  openOrdersCount: number;
  completedOrdersCount: number;
  upcomingOrders: any[];   // open, sorted by date asc
  completedOrders: any[];  // closed, sorted by date desc
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const todayStr = today.toISOString().split('T')[0];

  const { data: allOrders } = await supabase.from("orders").select("*");

  let totalEarned = 0;
  let pendingToCollect = 0;
  let cashCollected = 0;
  let totalTravelExpense = 0;
  let totalOtherExpense = 0;
  let earningsThisMonth = 0;
  let openOrdersCount = 0;
  let completedOrdersCount = 0;
  let upcomingList: any[] = [];
  let completedList: any[] = [];

  if (allOrders) {
    allOrders.forEach(o => {
      const advance = Number(o.advance_amount || 0);
      const total = Number(o.total_price || 0);
      const travel = Number(o.travel_expense || 0);
      const other = Number(o.other_expenses || 0);
      
      cashCollected += advance;
      totalTravelExpense += travel;
      totalOtherExpense += other;

      const dates = o.date ? o.date.split(',').map((d: string) => d.trim()).sort() : [];
      const firstDate = dates[0] || '';
      const lastDate = dates[dates.length - 1] || '';

      if (o.status === 'completed') {
        // Completed: service price minus pass-throughs
        const serviceEarned = total - travel - other;
        totalEarned += serviceEarned;
        completedOrdersCount++;
        completedList.push(o);

        // This month (completed events this month)
        if (firstDate >= firstDayOfMonth.toISOString().split('T')[0] &&
            firstDate < firstDayOfNextMonth.toISOString().split('T')[0]) {
          earningsThisMonth += serviceEarned;
        }
      } else if (o.status === 'upcoming') {
        // Upcoming: only the advance is earned so far
        // Pending = full amount left to collect from client (including any expenses passed to them)
        totalEarned += advance;
        pendingToCollect += Math.max(0, total - advance);

        if (lastDate >= todayStr) {
          openOrdersCount++;
          upcomingList.push(o);
        }

        // This month (upcoming events this month — count advance)
        if (firstDate >= firstDayOfMonth.toISOString().split('T')[0] &&
            firstDate < firstDayOfNextMonth.toISOString().split('T')[0]) {
          earningsThisMonth += advance;
        }
      }
    });

    upcomingList.sort((a, b) =>
      (a.date.split(',')[0].trim()).localeCompare(b.date.split(',')[0].trim())
    );
    completedList.sort((a, b) =>
      (b.date.split(',')[0].trim()).localeCompare(a.date.split(',')[0].trim())
    );
  }

  return {
    totalEarned,
    pendingToCollect,
    cashCollected,
    totalTravelExpense,
    totalOtherExpense,
    earningsThisMonth,
    openOrdersCount,
    completedOrdersCount,
    upcomingOrders: upcomingList,
    completedOrders: completedList.slice(0, 10),
  };
}

export async function getOrders(statusFilter?: string) {
  let query = supabase.from("orders").select("*");
  
  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  // Sort in JS because of comma separated string format
  const sorted = (data || []).sort((a, b) => {
    const aFirst = a.date?.split(',')[0].trim() || "0000";
    const bFirst = b.date?.split(',')[0].trim() || "0000";
    return bFirst.localeCompare(aFirst); // descending
  });
  
  return sorted;
}

export async function getClients() {
  // Get unique clients by name + phone
  const { data, error } = await supabase
    .from("orders")
    .select("client_name, phone_number, location, created_at")
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
    travel_expense: parseFloat(formData.get("travel_expense") as string) || 0,
    other_expenses: parseFloat(formData.get("other_expenses") as string) || 0,
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
    travel_expense: parseFloat(formData.get("travel_expense") as string) || 0,
    other_expenses: parseFloat(formData.get("other_expenses") as string) || 0,
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

/** Mark an order complete + optionally add balance received on event day */
export async function quickCompleteOrder(id: string, balanceReceived: number) {
  // Fetch current advance to add the balance on top
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("advance_amount, total_price")
    .eq("id", id)
    .single();

  if (fetchErr || !order) return { success: false, error: "Order not found" };

  const newAdvance = Number(order.advance_amount) + balanceReceived;

  const { error } = await supabase
    .from("orders")
    .update({ advance_amount: newAdvance, status: "completed" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}


export async function getPublicBookedDates() {
  const { data } = await supabase
    .from("orders")
    .select("date")
    .neq("status", "cancelled");
    
  if (!data) return [];
  
  const allDates = data.flatMap(o => {
    if (!o.date) return [];
    return o.date.split(',').map((d: string) => d.trim());
  });
  
  return Array.from(new Set(allDates));
}
