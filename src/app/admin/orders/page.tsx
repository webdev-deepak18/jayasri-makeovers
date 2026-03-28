import { getOrders } from "@/actions/orders";
import Link from "next/link";
import { format } from "date-fns";
import { FunnelIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export const revalidate = 0; // force dynamic rendering

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const currentFilter = params.status || "all";
  const orders = await getOrders(currentFilter);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">Orders</h1>
        <Link href="/admin/orders/new" className="bg-brand-primary text-white p-2 rounded-full shadow-md">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
        </Link>
      </div>

      {/* Filters Overlay/Inline */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        <FunnelIcon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        {["all", "upcoming", "completed", "cancelled"].map((f) => (
          <Link
            key={f}
            href={`/admin/orders?status=${f}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
              currentFilter === f 
                ? "bg-brand-secondary text-white" 
                : "bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order) => {
          const allDates = order.date ? order.date.split(',').map((d: string) => d.trim()).sort() : [];
          const firstDate = allDates[0] ? new Date(allDates[0]) : new Date();
          const extraDates = allDates.length - 1;
          const pendingAmount = Number(order.total_price) - Number(order.advance_amount);
          const isPending = pendingAmount > 0;

          return (
            <Link href={`/admin/orders/${order.id}/edit`} key={order.id} className="block">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-brand-light rounded-lg border border-brand-secondary/20 flex flex-col items-center justify-center relative">
                  <span className="text-[10px] font-bold uppercase text-brand-primary tracking-widest">{format(firstDate, 'MMM')}</span>
                  <span className="text-xl font-poppins font-bold text-brand-primary leading-none">{format(firstDate, 'dd')}</span>
                  <span className="text-[10px] text-neutral-500 mt-1">{format(firstDate, 'yyyy')}</span>
                  {extraDates > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-secondary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">+{extraDates}</span>
                  )}
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <h3 className="font-playfair font-bold text-lg text-neutral-900 truncate leading-tight mb-1">{order.client_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded-md">{order.makeup_type}</span>
                    <span className="truncate">{order.location}</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className={`px-2 py-0.5 rounded-full ${order.status === 'upcoming' ? 'bg-amber-100 text-amber-800' : order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-neutral-400 font-semibold mb-0.5 uppercase tracking-wide">Advance: ₹{order.advance_amount}</p>
                      {isPending ? (
                        <p className="text-sm font-bold text-red-500 line-clamp-1">₹{pendingAmount} Due</p>
                      ) : (
                        <p className="text-sm font-bold text-green-600">Paid in Full</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}

        {orders.length === 0 && (
          <div className="p-12 text-center text-neutral-400 bg-white rounded-xl border border-dashed border-neutral-200">
            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="font-poppins">No {currentFilter !== 'all' ? currentFilter : ''} orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
