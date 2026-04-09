import Calendar from "@/components/Calendar";
import { getPublicBookedDates, getOrders } from "@/actions/orders";

export default async function AdminCalendarPage() {
  const bookedDates = await getPublicBookedDates();
  
  // Future enhancement: pass all orders to Calendar so clicking a date shows the order info.
  // For now, render the same calendar as the frontend.

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="bg-white px-6 py-6 border-b border-brand-secondary/20 sticky top-0 z-10 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-playfair font-bold text-2xl text-brand-primary">Availability Calendar</h1>
          <p className="text-sm font-medium text-neutral-500 mt-1">Check your booked dates</p>
        </div>
      </div>

      <div className="p-4 bg-white min-h-[80vh]">
        <Calendar bookedDates={bookedDates} />
      </div>
    </div>
  );
}
