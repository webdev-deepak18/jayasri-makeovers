import { getDashboardStats, getPublicBookedDates } from "@/actions/orders";
import Calendar from "@/components/Calendar";
import Link from "next/link";
import { format } from "date-fns";
import { getMakeupIcon } from "@/lib/makeup-utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const stats = await getDashboardStats();
  const bookedDates = await getPublicBookedDates();
  const params = await searchParams;

  // Smart default: open if there are open orders, else closed
  const defaultTab = stats.openOrdersCount > 0 ? "open" : "closed";
  const activeTab = params.tab === "open" || params.tab === "closed" ? params.tab : defaultTab;

  const orders = activeTab === "open" ? stats.upcomingOrders : stats.completedOrders;

  return (
    <div className="p-4 space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">Dashboard</h1>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <span className="text-brand-primary font-playfair font-bold">J</span>
        </div>
      </div>

      {/* ── Earnings Cards ── */}
      <div className="space-y-3">

        {/* Total Earned — hero card */}
        <div className="bg-brand-primary p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -right-2 w-20 h-20 bg-white/5 rounded-full" />
          <p className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-1">Total Earnings</p>
          <p className="text-5xl font-poppins font-bold leading-none">₹{stats.totalEarned.toLocaleString()}</p>
          {stats.pendingToCollect > 0 && (
            <p className="text-xs text-white/40 mt-1">
              ₹{(stats.totalEarned + stats.pendingToCollect).toLocaleString()} when all pending paid
            </p>
          )}
          <p className="text-[11px] text-white/50 mt-2">
            Completed in full + advances on upcoming orders
          </p>
          {stats.pendingToCollect > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full px-3.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              <p className="text-xs font-bold text-amber-200">
                ₹{stats.pendingToCollect.toLocaleString()} still to collect
              </p>
            </div>
          )}
        </div>

        {/* 3-column stat row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100 text-center">
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">This Month</p>
            <p className="text-lg font-poppins font-bold text-green-600">₹{stats.earningsThisMonth.toLocaleString()}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100 text-center">
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">Open Jobs</p>
            <p className="text-lg font-poppins font-bold text-brand-primary">{stats.openOrdersCount}</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100 text-center">
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-1">Done</p>
            <p className="text-lg font-poppins font-bold text-neutral-700">{stats.completedOrdersCount}</p>
          </div>
        </div>

        {/* Travel expenses — only show if any */}
        {stats.totalTravelExpense > 0 && (
          <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Expenses (Travel, Etc)</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Not included in earnings</p>
            </div>
            <p className="text-lg font-poppins font-bold text-neutral-600">₹{stats.totalTravelExpense.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* ── Orders Section with Tabs ── */}
      <div>
        {/* Tab header */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href="/admin/dashboard?tab=open"
            className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeTab === "open"
                ? "bg-brand-primary text-white shadow-md"
                : "bg-white text-neutral-500 border border-neutral-200"
            }`}
          >
            Open
            {stats.openOrdersCount > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "open" ? "bg-white/20" : "bg-brand-primary/10 text-brand-primary"
              }`}>
                {stats.openOrdersCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/dashboard?tab=closed"
            className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all ${
              activeTab === "closed"
                ? "bg-neutral-700 text-white shadow-md"
                : "bg-white text-neutral-500 border border-neutral-200"
            }`}
          >
            Closed
            {stats.completedOrdersCount > 0 && (
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === "closed" ? "bg-white/20" : "bg-neutral-100 text-neutral-600"
              }`}>
                {stats.completedOrdersCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/orders/new"
            className="w-9 h-9 flex-shrink-0 bg-brand-secondary text-white rounded-xl flex items-center justify-center shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        {/* Order list */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-neutral-400">
              {activeTab === "open" ? (
                <>
                  <p className="text-3xl mb-2">🎉</p>
                  <p className="font-semibold text-neutral-600 mb-1">No open orders!</p>
                  <p className="text-xs mb-3">All caught up. Ready to take new bookings?</p>
                  <Link href="/admin/orders/new" className="text-brand-primary font-bold text-sm">
                    + Create Order
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-3xl mb-2">📋</p>
                  <p className="font-semibold text-neutral-600">No completed orders yet</p>
                  <p className="text-xs mt-1">Completed events will appear here</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const allDates = order.date
                  ? order.date.split(',').map((d: string) => d.trim()).sort()
                  : [];
                const firstDate = allDates[0] ? new Date(allDates[0]) : new Date();
                const extraDates = allDates.length - 1;
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
                    <div className={`flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded-xl mr-3 relative ${
                      activeTab === "closed"
                        ? "bg-neutral-100 text-neutral-500"
                        : "bg-brand-light text-brand-primary border border-brand-secondary/20"
                    }`}>
                      <span className="text-[9px] font-bold uppercase">{format(firstDate, 'MMM')}</span>
                      <span className="text-base font-poppins font-bold leading-none">{format(firstDate, 'dd')}</span>
                      {extraDates > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          +{extraDates}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm text-neutral-900 truncate">{order.client_name}</h4>
                      <p className="text-[11px] text-neutral-400 truncate">{getMakeupIcon(order.makeup_type)} {order.makeup_type} · {order.location}</p>
                    </div>

                    {/* Amount — earnings page style */}
                    <div className="flex-shrink-0 text-right ml-2">
                      {activeTab === "closed" || isFullyPaid ? (
                        <>
                          <p className="text-sm font-bold text-green-600">₹{netServicePrice.toLocaleString()}</p>
                          <p className="text-[9px] font-semibold text-green-400">fully paid</p>
                        </>
                      ) : (
                        <>
                          <p className="text-[9px] font-bold text-amber-500 mb-0.5 uppercase tracking-wide">pending</p>
                          <p className="text-base font-black text-amber-600 leading-none">₹{netPending.toLocaleString()}</p>
                          <p className="text-[9px] font-medium text-neutral-400 mt-1">₹{advance.toLocaleString()} adv</p>
                        </>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg className="w-4 h-4 text-neutral-300 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* View all link */}
        <Link
          href={`/admin/orders?status=${activeTab === "open" ? "upcoming" : "completed"}`}
          className="block text-center text-xs font-semibold text-brand-primary mt-3 py-2"
        >
          View all in Orders →
        </Link>
      </div>

      {/* ── Calendar Section ── */}
      <div className="pt-2">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-2">
          <Calendar bookedDates={bookedDates} />
        </div>
      </div>

      {/* Front-end live site link */}
      <div className="pt-4 text-center pb-6">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold text-neutral-400 hover:text-brand-primary transition-colors"
        >
          jayasrimakeovers.in
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
