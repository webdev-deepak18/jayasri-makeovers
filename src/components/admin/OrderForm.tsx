"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder, updateOrder, deleteOrder } from "@/actions/orders";

export default function OrderForm({ initialData, orderId }: { initialData?: any; orderId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isEditing = !!orderId;

  // Real-time calculation state
  const [totalPrice, setTotalPrice] = useState<number>(initialData?.total_price || 0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(initialData?.advance_amount || 0);

  const pendingAmount = Math.max(0, totalPrice - advanceAmount);

  // Makeup type state
  const predefinedTypes = ["Bridal", "Pre-Wedding", "Engagement", "Party", "Saree Draping"];
  const initialIsOther = initialData?.makeup_type ? !predefinedTypes.includes(initialData.makeup_type) : false;
  
  const [makeupType, setMakeupType] = useState<string>(initialIsOther ? "Other" : (initialData?.makeup_type || "Bridal"));
  const [customMakeup, setCustomMakeup] = useState<string>(initialIsOther ? initialData.makeup_type : "");
  
  const finalMakeupType = makeupType === "Other" ? customMakeup : makeupType;

  // Dates state
  const [dates, setDates] = useState<string[]>(
    initialData?.date ? initialData.date.split(',').map((d: string) => d.trim()) : [""]
  );

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const addDate = () => setDates([...dates, ""]);
  
  const removeDate = (index: number) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, i) => i !== index));
    }
  };

  const finalDatesString = dates.filter(d => Boolean(d)).sort().join(', ');

  async function handleSubmit(formData: FormData) {
    if (makeupType === "Other" && !customMakeup.trim()) {
      setError("Please specify the custom makeup type.");
      return;
    }
    if (!finalDatesString) {
      setError("Please select at least one date.");
      return;
    }

    setError("");
    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updateOrder(orderId, formData);
      } else {
        result = await createOrder(formData);
      }

      if (result.success) {
        router.push("/admin/orders");
      } else {
        setError(result.error || "Failed to save order");
      }
    });
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    
    startTransition(async () => {
      const result = await deleteOrder(orderId!);
      if (result.success) {
        router.push("/admin/orders");
      } else {
        setError(result.error || "Failed to delete order");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5 bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col">
      {/* Hidden inputs to capture computed values */}
      <input type="hidden" name="makeup_type" value={finalMakeupType} />
      <input type="hidden" name="date" value={finalDatesString} />

      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* Client Info Section */}
      <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2">Client Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Name</label>
          <input type="text" name="client_name" required defaultValue={initialData?.client_name} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Phone Number</label>
          <input type="tel" name="phone_number" required defaultValue={initialData?.phone_number} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins" />
        </div>
      </div>

      {/* Booking Details Section */}
      <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">Booking Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Makeup Type</label>
          <select 
            value={makeupType}
            onChange={(e) => setMakeupType(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins bg-white"
          >
            {predefinedTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
            <option value="Other">Other (Specify)</option>
          </select>

          {makeupType === "Other" && (
            <div className="mt-2 animate-in fade-in zoom-in-95 duration-200">
              <input 
                type="text" 
                placeholder="e.g. Baby Shower, Haldi"
                value={customMakeup}
                onChange={(e) => setCustomMakeup(e.target.value)}
                className="w-full px-3 py-2 border border-brand-secondary text-brand-primary rounded-lg focus:ring-1 focus:ring-brand-primary outline-none font-poppins" 
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Date(s)</label>
          <div className="space-y-2">
            {dates.map((d, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input 
                  type="date" 
                  value={d}
                  onChange={(e) => handleDateChange(i, e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins" 
                />
                {dates.length > 1 && (
                  <button type="button" onClick={() => removeDate(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={addDate}
              className="text-xs font-bold text-brand-secondary hover:text-brand-primary flex items-center gap-1 transition-colors uppercase tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Date
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Location / Venue</label>
          <input type="text" name="location" required defaultValue={initialData?.location} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins" />
        </div>
      </div>

      {/* Payment Section */}
      <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">Payment (₹)</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Total Price</label>
          <input 
            type="number" 
            name="total_price" 
            required 
            min="0"
            value={totalPrice || ""}
            onChange={(e) => setTotalPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins bg-neutral-50 font-bold text-neutral-800"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Advance Rcvd</label>
          <input 
            type="number" 
            name="advance_amount" 
            required 
            min="0"
            value={advanceAmount || ""}
            onChange={(e) => setAdvanceAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-1 focus:ring-green-500 outline-none font-poppins bg-green-50 text-green-700 font-bold" 
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 border border-red-100">
        <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Pending Balance</span>
        <span className="text-xl font-poppins font-bold text-red-600">₹{pendingAmount}</span>
      </div>

      {/* Extras */}
      <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">Notes & Status</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Status</label>
          <select name="status" required defaultValue={initialData?.status || "upcoming"} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins font-semibold bg-white">
            <option value="upcoming">🟡 Upcoming</option>
            <option value="completed">🟢 Completed</option>
            <option value="cancelled">🔴 Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Custom Message / Notes (Optional)</label>
          <textarea name="custom_message" rows={3} defaultValue={initialData?.custom_message} className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins text-sm resize-none"></textarea>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand-primary text-white font-poppins font-bold py-3 px-4 rounded-xl hover:bg-brand-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 shadow-md"
        >
          {isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Order"}
        </button>
        
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full bg-red-50 text-red-600 font-poppins font-bold py-3 px-4 rounded-xl hover:bg-red-100 transition-all border border-red-200"
          >
            Cancel Order / Delete
          </button>
        )}
      </div>
    </form>
  );
}
