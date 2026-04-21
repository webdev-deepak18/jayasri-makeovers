import { getMonthlyEarnings, type MonthEarnings } from "@/actions/orders";
import Link from "next/link";
import { format } from "date-fns";
import { getMakeupIcon } from "@/lib/makeup-utils";

export const dynamic = "force-dynamic";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const months = await getMonthlyEarnings();
  const params = await searchParams;

  // Default to current month or first entry
  const currentMonth = new Date().toISOString().slice(0, 7);
  const selectedMonth = params.month || currentMonth;

  // Ensure the selected month exists in our list (could be a future/past month not in DB yet)
  const selected: MonthEarnings = months.find((m) => m.month === selectedMonth) ?? {
    month: selectedMonth,
    label: new Date(selectedMonth + "-01").toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    }),
    earnings: 0,
    pendingAmount: 0,
    totalExpenses: 0,
    completedCount: 0,
    upcomingCount: 0,
    orders: [],
  };

  // Prev / Next month navigation
  const [sy, sm] = selectedMonth.split("-").map(Number);
  const prevDate = new Date(sy, sm - 2, 1); // sm-2 because months are 0-indexed
  const nextDate = new Date(sy, sm, 1);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;

  // Don't allow navigating to a future month beyond 12 months ahead
  const maxAllowed = new Date();
  maxAllowed.setMonth(maxAllowed.getMonth() + 12);
  const maxMonth = `${maxAllowed.getFullYear()}-${String(maxAllowed.getMonth() + 1).padStart(2, "0")}`;
  const canGoNext = nextMonth <= maxMonth;

  // Bar chart: show last 6 months ending at selectedMonth (fill if less)
  const barMonths: { month: string; label: string; earnings: number }[] = [];
  let bY = sy, bM = sm;
  for (let i = 0; i < 6; i++) {
    const key = `${bY}-${String(bM).padStart(2, "0")}`;
    const found = months.find((m) => m.month === key);
    const date = new Date(bY, bM - 1, 1);
    barMonths.unshift({
      month: key,
      label: date.toLocaleDateString("en-IN", { month: "short" }),
      earnings: found?.earnings ?? 0,
    });
    bM--;
    if (bM < 1) { bM = 12; bY--; }
  }

  const maxEarnings = Math.max(...barMonths.map((b) => b.earnings), 1);

  // All-time totals
  const totalAllTime = months.reduce((sum, m) => sum + m.earnings, 0);
  const bestMonth = months.reduce(
    (best, m) => (m.earnings > best.earnings ? m : best),
    { month: "", label: "—", earnings: 0, pendingAmount: 0, totalExpenses: 0, completedCount: 0, upcomingCount: 0, orders: [] } as MonthEarnings
  );

  // Sort selected orders by date
  const selectedOrders = [...selected.orders].sort((a, b) => {
    const aD = a.date?.split(",")[0]?.trim() ?? "";
    const bD = b.date?.split(",")[0]?.trim() ?? "";
    return aD.localeCompare(bD);
  });

  const isCurrentMonth = selectedMonth === currentMonth;

  return (
    <div className="p-4 space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">Earnings</h1>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <span className="text-brand-primary font-playfair font-bold">₹</span>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-neutral-100 px-4 py-3">
        <Link
          href={`/admin/earnings?month=${prevMonth}`}
          className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="text-center">
          <p className="font-playfair font-bold text-neutral-900 text-lg leading-none">{selected.label}</p>
          {isCurrentMonth && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
              Current Month
            </span>
          )}
        </div>

        <Link
          href={canGoNext ? `/admin/earnings?month=${nextMonth}` : "#"}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95 ${
            canGoNext ? "bg-brand-light text-brand-primary" : "bg-neutral-100 text-neutral-300 pointer-events-none"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Hero Earnings Card */}
      <div className="bg-brand-primary p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-2 w-20 h-20 bg-white/5 rounded-full" />
        <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1">
          {selected.label}
        </p>
        <p className="text-5xl font-poppins font-bold leading-none">
          ₹{selected.earnings.toLocaleString("en-IN")}
        </p>
        {selected.pendingAmount > 0 && (
          <p className="text-xs text-white/40 mt-1">
            ₹{(selected.earnings + selected.pendingAmount).toLocaleString("en-IN")} when fully paid
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-3">
          {selected.completedCount > 0 && (
            <p className="text-[11px] text-white/60">
              ✅ {selected.completedCount} completed
            </p>
          )}
          {selected.upcomingCount > 0 && (
            <p className="text-[11px] text-white/60">
              🗓 {selected.upcomingCount} upcoming (advance counted)
            </p>
          )}
          {selected.completedCount === 0 && selected.upcomingCount === 0 && (
            <p className="text-[11px] text-white/50">No bookings this month</p>
          )}
        </div>
        {/* Pending pill */}
        {selected.pendingAmount > 0 && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full px-3.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            <p className="text-xs font-bold text-amber-200">
              ₹{selected.pendingAmount.toLocaleString("en-IN")} still to collect
            </p>
          </div>
        )}
      </div>

      {/* Month Expenses */}
      {selected.totalExpenses > 0 && (
        <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Expenses This Month</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Travel + other costs — not in earnings</p>
          </div>
          <p className="text-lg font-poppins font-bold text-neutral-600">₹{selected.totalExpenses.toLocaleString("en-IN")}</p>
        </div>
      )}

      {/* All-Time Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Earned</p>
          <p className="text-xl font-poppins font-bold text-neutral-900 leading-tight">
            ₹{totalAllTime.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-neutral-400 mt-1">All time</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Best Month</p>
          {bestMonth.earnings > 0 ? (
            <>
              <p className="text-xl font-poppins font-bold text-green-600 leading-tight">
                ₹{bestMonth.earnings.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-neutral-400 mt-1 truncate">{bestMonth.label}</p>
            </>
          ) : (
            <p className="text-sm text-neutral-300 mt-1">No data yet</p>
          )}
        </div>
      </div>

      {/* 6-Month Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
          6-Month Overview
        </p>
        <div className="flex items-end gap-2 h-24">
          {barMonths.map((bar) => {
            const heightPct = maxEarnings > 0 ? (bar.earnings / maxEarnings) * 100 : 0;
            const isSelected = bar.month === selectedMonth;
            return (
              <Link
                key={bar.month}
                href={`/admin/earnings?month=${bar.month}`}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div className="w-full flex items-end justify-center" style={{ height: "76px" }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isSelected
                        ? "bg-brand-primary"
                        : bar.earnings > 0
                        ? "bg-brand-primary/25 group-hover:bg-brand-primary/40"
                        : "bg-neutral-100"
                    }`}
                    style={{ height: `${Math.max(heightPct, bar.earnings > 0 ? 8 : 4)}%` }}
                  />
                </div>
                <p className={`text-[9px] font-bold ${isSelected ? "text-brand-primary" : "text-neutral-400"}`}>
                  {bar.label}
                </p>
              </Link>
            );
          })}
        </div>
        {/* Y-axis hint */}
        <div className="flex justify-between mt-2 pt-2 border-t border-neutral-100">
          <p className="text-[9px] text-neutral-300">₹0</p>
          <p className="text-[9px] text-neutral-300">₹{maxEarnings.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* All Months List */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
          All Months
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          {months.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="font-semibold text-neutral-600">No earnings data yet</p>
              <p className="text-xs mt-1">Create orders to see monthly earnings</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {months.map((m) => {
                const isSelected = m.month === selectedMonth;
                const isCurrent = m.month === currentMonth;
                const barWidth = maxEarnings > 0 ? (m.earnings / Math.max(...months.map((x) => x.earnings), 1)) * 100 : 0;
                return (
                  <Link
                    key={m.month}
                    href={`/admin/earnings?month=${m.month}`}
                    className={`flex items-center px-4 py-3 transition-colors relative ${
                      isSelected ? "bg-brand-primary/5" : "hover:bg-neutral-50 active:bg-neutral-100"
                    }`}
                  >
                    {/* Earnings bar (background) */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                        isSelected ? "bg-brand-primary/8" : "bg-brand-secondary/5"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />

                    <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${isSelected ? "text-brand-primary" : "text-neutral-800"}`}>
                          {m.label}
                        </p>
                        {isCurrent && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded-full">
                            Now
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {m.completedCount + m.upcomingCount === 0
                          ? "No bookings"
                          : `${m.completedCount} done · ${m.upcomingCount} upcoming`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                      <p className={`text-sm font-poppins font-bold ${
                        m.earnings > 0 ? (isSelected ? "text-brand-primary" : "text-green-600") : "text-neutral-300"
                      }`}>
                        {m.earnings > 0 ? `₹${m.earnings.toLocaleString("en-IN")}` : "—"}
                      </p>
                      <svg className="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Month Orders */}
      {selectedOrders.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Orders in {selected.label}
          </p>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {selectedOrders.map((order) => {
                const allDates = order.date
                  ? order.date.split(",").map((d: string) => d.trim()).sort()
                  : [];
                const firstDate = allDates[0] ? new Date(allDates[0]) : new Date();
                const isCompleted = order.status === "completed";
                const netServicePrice = Number(order.total_price);
                const advance = Number(order.advance_amount || 0);
                const netPending = Math.max(0, netServicePrice - advance);
                const isFullyPaid = netPending <= 0;

                return (
                  <Link
                    href={`/admin/orders/${order.id}/edit`}
                    key={order.id}
                    className="flex items-center p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                  >
                    {/* Date badge */}
                    <div className={`flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-xl mr-3 ${
                      isCompleted ? "bg-neutral-100 text-neutral-500" : "bg-brand-light text-brand-primary border border-brand-secondary/20"
                    }`}>
                      <span className="text-[9px] font-bold uppercase">{format(firstDate, "MMM")}</span>
                      <span className="text-base font-poppins font-bold leading-none">{format(firstDate, "dd")}</span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm text-neutral-900 truncate">{order.client_name}</h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {getMakeupIcon(order.makeup_type)} {order.makeup_type} · {order.location}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right ml-2">
                      {isCompleted || isFullyPaid ? (
                        <>
                          <p className="text-sm font-bold text-green-600">₹{netServicePrice.toLocaleString("en-IN")}</p>
                          <p className="text-[9px] font-semibold text-green-400">fully paid</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[9px] font-semibold text-amber-400 mb-0.5">pending</p>
                          <p className="text-sm font-bold text-amber-500 leading-none">₹{netPending.toLocaleString("en-IN")}</p>
                          <p className="text-[9px] text-neutral-400 mt-1">₹{advance.toLocaleString("en-IN")} adv</p>
                        </>
                      )}
                    </div>

                    <svg className="w-4 h-4 text-neutral-300 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
