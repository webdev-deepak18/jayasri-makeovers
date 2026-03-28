import OrderForm from "@/components/admin/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-playfair font-bold text-brand-primary">New Order</h1>
        <p className="text-sm text-neutral-500 font-poppins">Fill out details to book a client</p>
      </div>

      <OrderForm />
    </div>
  );
}
