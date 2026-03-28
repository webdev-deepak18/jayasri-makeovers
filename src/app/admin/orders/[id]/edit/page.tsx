import OrderForm from "@/components/admin/OrderForm";
import { getOrderById } from "@/actions/orders";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return <div className="p-4">Order not found.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/admin/orders" className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors text-brand-primary">
          <ChevronLeftIcon className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-playfair font-bold text-brand-primary">Edit Order</h1>
          <p className="text-sm text-neutral-500 font-poppins truncate line-clamp-1">{order.client_name}</p>
        </div>
      </div>

      <OrderForm initialData={order} orderId={id} />
    </div>
  );
}
