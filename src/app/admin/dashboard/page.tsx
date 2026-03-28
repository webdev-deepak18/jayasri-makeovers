import { getDashboardStats } from "@/actions/orders";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">Dashboard</h1>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <span className="text-brand-primary font-playfair font-bold">J</span>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-500 font-semibold mb-1 uppercase tracking-wider">Active Orders</p>
          <p className="text-3xl font-poppins font-bold text-brand-primary">{stats.activeOrdersCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
          <p className="text-xs text-neutral-500 font-semibold mb-1 uppercase tracking-wider">This Month</p>
          <p className="text-3xl font-poppins font-bold text-green-600">₹{stats.earningsThisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-brand-primary p-4 rounded-xl shadow-md text-white col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            {/* Background design */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.17-1.92H8.01c.08 1.6 1.15 2.76 2.88 3.14V19h2.86v-1.66c1.64-.31 2.91-1.43 2.91-2.98 0-2.07-1.67-2.8-3.35-3.22z"/></svg>
          </div>
          <p className="text-sm font-semibold mb-1 text-brand-secondary">Total Cash Received</p>
          <p className="text-4xl font-poppins font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Upcoming Orders block */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-playfair font-bold text-neutral-800">Upcoming Schedule</h2>
          <Link href="/admin/orders" className="text-sm text-brand-primary font-semibold hover:underline">View All</Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
          {stats.upcomingOrders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <p>No upcoming orders.</p>
              <Link href="/admin/orders/new" className="text-brand-primary font-semibold mt-2 inline-block">Create one now</Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {stats.upcomingOrders.map((order) => {
                const allDates = order.date ? order.date.split(',').map((d: string) => d.trim()).sort() : [];
                const firstDate = allDates[0] ? new Date(allDates[0]) : new Date();
                const extraDates = allDates.length - 1;
                const pendingAmount = Number(order.total_price) - Number(order.advance_amount);
                const hasPending = pendingAmount > 0;
                
                return (
                  <Link href={`/admin/orders/${order.id}/edit`} key={order.id} className="flex p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center bg-brand-light rounded-lg text-brand-primary border border-brand-secondary/20 mr-4 relative">
                      <span className="text-xs font-bold uppercase">{format(firstDate, 'MMM')}</span>
                      <span className="text-lg font-bold font-poppins">{format(firstDate, 'dd')}</span>
                      {extraDates > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-brand-secondary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">+{extraDates}</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-neutral-900 truncate">{order.client_name}</h4>
                      <p className="text-xs text-neutral-500 truncate">{order.makeup_type} • {order.location}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {hasPending ? (
                        <p className="text-sm font-bold text-red-500">₹{pendingAmount} Due</p>
                      ) : (
                        <p className="text-sm font-bold text-green-600">Paid in Full</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
