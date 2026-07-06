"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath, updateTag, unstable_cache } from "next/cache";

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

// Cached fetcher for all orders to make page transitions and queries instantaneous
export const getAllOrdersCached = unstable_cache(
  async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw new Error(error.message);
    return data || [];
  },
  ["all-orders"],
  { tags: ["orders"] }
);

export async function getDashboardStats(): Promise<DashboardStats> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const allOrders = await getAllOrdersCached();

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
      // Pending = NET service price still to collect (total minus expenses minus advance)
      const netServicePrice = total - travel - other;
      totalEarned += advance;
      pendingToCollect += Math.max(0, netServicePrice - advance);

      openOrdersCount++;
      upcomingList.push(o);

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
  const allOrders = await getAllOrdersCached();
  
  let filtered = allOrders;
  if (statusFilter && statusFilter !== "all") {
    filtered = allOrders.filter(o => o.status === statusFilter);
  }

  // Sort in JS because of comma separated string format
  const sorted = [...filtered].sort((a, b) => {
    const aFirst = a.date?.split(',')[0].trim() || "0000";
    const bFirst = b.date?.split(',')[0].trim() || "0000";
    return bFirst.localeCompare(aFirst); // descending
  });
  
  return sorted;
}

export async function getClients() {
  const allOrders = await getAllOrdersCached();

  // Sort in descending order of created_at
  const sorted = [...allOrders].sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  
  // Deduplicate by phone_number
  const uniquePhones = Array.from(new Set(sorted.map(c => c.phone_number)));
  const uniqueClients = uniquePhones.map(phone => {
    return sorted.find(c => c.phone_number === phone)!;
  });

  return uniqueClients;
}

export async function getOrderById(id: string) {
  const allOrders = await getAllOrdersCached();
  const order = allOrders.find(o => String(o.id) === String(id));
  if (!order) throw new Error("Order not found");
  return order;
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
    expense_notes: (formData.get("expense_notes") as string) || "",
    custom_message: formData.get("custom_message") as string,
    status: (formData.get("status") as string) || "upcoming",
  };

  const { error } = await supabase.from("orders").insert([orderData]);
  if (error) return { success: false, error: error.message };

  updateTag("orders");
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
    expense_notes: (formData.get("expense_notes") as string) || "",
    custom_message: formData.get("custom_message") as string,
    status: (formData.get("status") as string) || "upcoming",
  };

  const { error } = await supabase.from("orders").update(orderData).eq("id", id);
  if (error) return { success: false, error: error.message };

  updateTag("orders");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  updateTag("orders");
  revalidatePath("/", "layout");
  return { success: true };
}

/** Mark an order complete + optionally add balance received on event day */
export async function quickCompleteOrder(id: string, balanceReceived: number) {
  const allOrders = await getAllOrdersCached();
  const order = allOrders.find(o => String(o.id) === String(id));

  if (!order) return { success: false, error: "Order not found" };

  const newAdvance = Number(order.advance_amount) + balanceReceived;

  const { error } = await supabase
    .from("orders")
    .update({ advance_amount: newAdvance, status: "completed" })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  updateTag("orders");
  revalidatePath("/", "layout");
  return { success: true };
}

export interface MonthEarnings {
  /** e.g. "2026-04" */
  month: string;
  /** Human-readable label e.g. "April 2026" */
  label: string;
  earnings: number;
  /** Balance still to collect on upcoming orders this month */
  pendingAmount: number;
  /** Travel + other expenses for this month */
  totalExpenses: number;
  completedCount: number;
  upcomingCount: number;
  orders: any[];
}

/**
 * Returns one entry per calendar month from the earliest order date
 * to the latest order date (or current month, whichever is later).
 * Months with zero earnings are still included.
 */
export async function getMonthlyEarnings(): Promise<MonthEarnings[]> {
  const allOrders = await getAllOrdersCached();
  if (!allOrders || allOrders.length === 0) return [];

  // Build a map: "YYYY-MM" -> accumulated data
  const map = new Map<string, { earnings: number; pendingAmount: number; totalExpenses: number; completedCount: number; upcomingCount: number; orders: any[] }>();

  // Determine range boundaries
  let minMonth = "9999-99";
  let maxMonth = "0000-00";
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  allOrders.forEach((o) => {
    const dates = o.date ? o.date.split(",").map((d: string) => d.trim()).sort() : [];
    const firstDate = dates[0] || "";
    if (!firstDate) return;

    const month = firstDate.slice(0, 7); // "YYYY-MM"
    if (month < minMonth) minMonth = month;
    if (month > maxMonth) maxMonth = month;

    if (!map.has(month)) {
      map.set(month, { earnings: 0, pendingAmount: 0, totalExpenses: 0, completedCount: 0, upcomingCount: 0, orders: [] });
    }
    const entry = map.get(month)!;
    entry.orders.push(o);

    const advance = Number(o.advance_amount || 0);
    const total = Number(o.total_price || 0);
    const travel = Number(o.travel_expense || 0);
    const other = Number(o.other_expenses || 0);

    // Accumulate expenses for this month (all statuses except cancelled)
    if (o.status !== "cancelled") {
      entry.totalExpenses += travel + other;
    }

    if (o.status === "completed") {
      entry.earnings += total - travel - other;
      entry.completedCount++;
    } else if (o.status === "upcoming") {
      // Net pending = net service price (total minus expenses) minus already-paid advance
      const netServicePrice = total - travel - other;
      entry.earnings += advance;
      entry.pendingAmount += Math.max(0, netServicePrice - advance);
      entry.upcomingCount++;
    }
    // cancelled → no earnings
  });

  // Make sure current month is always in range (even if no orders yet)
  if (currentMonth > maxMonth) maxMonth = currentMonth;
  if (minMonth === "9999-99") minMonth = currentMonth;

  // Fill all months from minMonth to maxMonth
  const result: MonthEarnings[] = [];
  const [minY, minM] = minMonth.split("-").map(Number);
  const [maxY, maxM] = maxMonth.split("-").map(Number);

  let y = minY, m = minM;
  while (y < maxY || (y === maxY && m <= maxM)) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    const entry = map.get(key) ?? { earnings: 0, pendingAmount: 0, totalExpenses: 0, completedCount: 0, upcomingCount: 0, orders: [] };

    const date = new Date(y, m - 1, 1);
    const label = date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    result.push({ month: key, label, ...entry });

    m++;
    if (m > 12) { m = 1; y++; }
  }

  // Most recent month first
  return result.reverse();
}

export async function getPublicBookedDates() {
  const allOrders = await getAllOrdersCached();
  const activeOrders = allOrders.filter(o => o.status !== "cancelled");
  
  const allDates = activeOrders.flatMap(o => {
    if (!o.date) return [];
    return o.date.split(',').map((d: string) => d.trim());
  });
  
  return Array.from(new Set(allDates));
}
