"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder, updateOrder, deleteOrder, quickCompleteOrder } from "@/actions/orders";
import { MAKEUP_ICONS, getMakeupIcon } from "@/lib/makeup-utils";

export default function OrderForm({ initialData, orderId }: { initialData?: any; orderId?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isEditing = !!orderId;
  const isUpcoming = initialData?.status === "upcoming";

  type CostBlock = { id: string; invAmount: number; invDesc: string; clientAmount: number; clientDesc: string; };

  const buildInitialBlocks = (): CostBlock[] => {
    try {
      if (initialData?.expense_notes?.startsWith("[{")) {
        const parsed = JSON.parse(initialData.expense_notes);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].hasOwnProperty('invAmount')) {
          return parsed;
        }
      }
    } catch {}

    const blocks: CostBlock[] = [];
    const travel = Number(initialData?.travel_expense || 0);
    const other = Number(initialData?.other_expenses || 0);
    const notes = initialData?.expense_notes || "";

    if (travel > 0) blocks.push({ id: Math.random().toString(), invAmount: travel, invDesc: "Travel", clientAmount: 0, clientDesc: "" });
    if (other > 0) blocks.push({ id: Math.random().toString(), invAmount: other, invDesc: notes || "Other Expenses", clientAmount: 0, clientDesc: "" });
    return blocks;
  };

  const [costBlocks, setCostBlocks] = useState<CostBlock[]>(buildInitialBlocks);

  const totalInv = costBlocks.reduce((sum, b) => sum + (Number(b.invAmount) || 0), 0);
  const totalClient = costBlocks.reduce((sum, b) => sum + (Number(b.clientAmount) || 0), 0);

  const calculateInitialBasePrice = () => {
    const totalDDB = Number(initialData?.total_price || 0);
    const initialClientParts = buildInitialBlocks().reduce((sum, b) => sum + (Number(b.clientAmount) || 0), 0);
    return Math.max(0, totalDDB - initialClientParts);
  };

  const [basePrice, setBasePrice] = useState<number>(calculateInitialBasePrice);
  const [advanceAmount, setAdvanceAmount] = useState<number>(initialData?.advance_amount || 0);

  const computedTotalPrice = basePrice + totalClient;
  const pendingAmount = Math.max(0, computedTotalPrice - advanceAmount);

  const travelExpense = costBlocks.length > 0 ? (Number(costBlocks[0].invAmount) || 0) : 0;
  const otherExpenses = totalInv - travelExpense;
  const expenseNotes = JSON.stringify(costBlocks);

  const addCostBlock = () => setCostBlocks(prev => [...prev, { id: Math.random().toString(), invAmount: 0, invDesc: "", clientAmount: 0, clientDesc: "" }]);
  const removeCostBlock = (i: number) => setCostBlocks(prev => prev.filter((_, idx) => idx !== i));
  const updateCostBlock = (i: number, field: keyof CostBlock, value: string | number) =>
    setCostBlocks(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // Quick Complete state
  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [balanceInput, setBalanceInput] = useState<number>(pendingAmount);

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Makeup type state
  const predefinedTypes = ["Simple Makeover", "Bridal Makeover", "Saree Draping + Hairstyle"];
  const initialIsOther = initialData?.makeup_type ? !predefinedTypes.includes(initialData.makeup_type) : false;

  const [makeupType, setMakeupType] = useState<string>(
    initialIsOther ? "Other" : initialData?.makeup_type || "Simple Makeover"
  );
  const [customMakeup, setCustomMakeup] = useState<string>(
    initialIsOther ? initialData.makeup_type : ""
  );
  const finalMakeupType = makeupType === "Other" ? customMakeup : makeupType;

  // Dates state
  const [dates, setDates] = useState<string[]>(
    initialData?.date ? initialData.date.split(",").map((d: string) => d.trim()) : [""]
  );

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };
  const addDate = () => setDates([...dates, ""]);
  const removeDate = (index: number) => {
    if (dates.length > 1) setDates(dates.filter((_, i) => i !== index));
  };
  const finalDatesString = dates.filter(Boolean).sort().join(", ");

  // ── Handlers ──

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
      const result = isEditing
        ? await updateOrder(orderId, formData)
        : await createOrder(formData);
      if (result.success) router.push("/admin/dashboard");
      else setError(result.error || "Failed to save order");
    });
  }

  async function handleDelete() {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteOrder(orderId!);
      if (result.success) router.push("/admin/dashboard");
      else setError(result.error || "Failed to delete");
    });
  }

  async function handleQuickComplete() {
    if (balanceInput < 0) {
      setError("Balance cannot be negative.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await quickCompleteOrder(orderId!, balanceInput);
      if (result.success) router.push("/admin/dashboard");
      else setError(result.error || "Failed to complete order");
    });
  }

  return (
    <div className="space-y-4">

      {/* ═══════════════════════════════════════
          QUICK COMPLETE PANEL — upcoming orders only
          ═══════════════════════════════════════ */}
      {isEditing && isUpcoming && (
        <div className="rounded-2xl overflow-hidden border border-green-200 shadow-sm">
          {/* Header — always visible */}
          <button
            type="button"
            onClick={() => {
              setShowQuickComplete(!showQuickComplete);
              setBalanceInput(pendingAmount);
            }}
            className="w-full flex items-center justify-between px-4 py-3.5 bg-green-600 text-white active:bg-green-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">Complete This Order</p>
                <p className="text-[10px] text-green-100 mt-0.5">
                  {pendingAmount > 0
                    ? `₹${pendingAmount.toLocaleString()} balance to collect`
                    : "Fully paid — tap to mark done"}
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${showQuickComplete ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expandable body */}
          {showQuickComplete && (
            <div className="bg-green-50 px-4 py-4 space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-xl p-2.5 shadow-sm">
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Service</p>
                  <p className="text-sm font-poppins font-bold text-neutral-800">₹{computedTotalPrice.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 shadow-sm">
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Advance</p>
                  <p className="text-sm font-poppins font-bold text-green-700">₹{advanceAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl p-2.5 shadow-sm">
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mb-0.5">Pending</p>
                  <p className="text-sm font-poppins font-bold text-red-600">₹{pendingAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Balance input */}
              <div>
                <label className="block text-xs font-bold text-green-800 mb-1.5 uppercase tracking-wider">
                  Balance collected today
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={balanceInput || ""}
                    onChange={(e) => setBalanceInput(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-poppins font-bold text-green-900 bg-white text-lg"
                  />
                </div>
                {balanceInput > 0 && (
                  <p className="text-[11px] text-green-700 mt-1">
                    Total received: ₹{(advanceAmount + balanceInput).toLocaleString()} / ₹{computedTotalPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{error}</p>
              )}

              {/* Action button */}
              <button
                type="button"
                onClick={handleQuickComplete}
                disabled={isPending}
                className="w-full bg-green-600 text-white font-poppins font-bold py-3.5 rounded-xl hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-60 shadow-md text-base"
              >
                {isPending
                  ? "Saving..."
                  : balanceInput > 0
                  ? `Collect ₹${balanceInput.toLocaleString()} & Mark Complete`
                  : "Mark as Completed"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          MAIN FORM
          ═══════════════════════════════════════ */}
      <form
        action={handleSubmit}
        className="space-y-5 bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col"
      >
        {/* Hidden inputs */}
        <input type="hidden" name="makeup_type" value={finalMakeupType} />
        <input type="hidden" name="date" value={finalDatesString} />

        {error && !showQuickComplete && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* ── Client Info ── */}
        <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2">
          Client Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Name</label>
            <input
              type="text" name="client_name" required
              defaultValue={initialData?.client_name}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Phone</label>
            <input
              type="tel" name="phone_number" required
              defaultValue={initialData?.phone_number}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins"
            />
          </div>
        </div>

        {/* ── Booking Details ── */}
        <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">
          Booking Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Makeup type */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wide">Select Service</label>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: "Simple Makeover", desc: "Makeup + Hair + Saree Draping" },
                { id: "Bridal Makeover", desc: "HD Makeup + Hair + Saree Draping" },
                { id: "Saree Draping + Hairstyle", desc: "Saree Draping + Hairstyle only" },
                { id: "Other", desc: "Something else — please specify" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMakeupType(opt.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left group ${
                    makeupType === opt.id
                      ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/20"
                      : "border-neutral-100 bg-neutral-50 hover:border-neutral-200 active:scale-[0.99]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors ${
                    makeupType === opt.id ? "bg-brand-primary text-white" : "bg-white text-neutral-400 border border-neutral-100"
                  }`}>
                    {getMakeupIcon(opt.id)}
                  </div>
                  <div className="flex-grow">
                    <h4 className={`text-sm font-bold transition-colors ${
                      makeupType === opt.id ? "text-brand-primary" : "text-neutral-700"
                    }`}>
                      {opt.id}
                    </h4>
                    <p className={`text-[10px] uppercase font-medium tracking-wider transition-colors mt-0.5 ${
                      makeupType === opt.id ? "text-brand-primary/60" : "text-neutral-400"
                    }`}>
                      {opt.desc}
                    </p>
                  </div>
                  {makeupType === opt.id && (
                    <div className="text-brand-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {makeupType === "Other" && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="e.g. Baby Shower, Haldi"
                  value={customMakeup}
                  onChange={(e) => setCustomMakeup(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-brand-secondary text-brand-primary rounded-xl focus:ring-1 focus:ring-brand-primary outline-none font-poppins font-semibold bg-white animate-in slide-in-from-top-2 duration-300"
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Date(s)</label>
            <div className="space-y-2">
              {dates.map((d, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={d}
                    min={minDate}
                    onChange={(e) => handleDateChange(i, e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins"
                  />
                  {dates.length > 1 && (
                    <button
                      type="button" onClick={() => removeDate(i)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button" onClick={addDate}
                className="text-xs font-bold text-brand-secondary hover:text-brand-primary flex items-center gap-1 transition-colors uppercase tracking-wide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Add Date
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Location / Venue</label>
            <input
              type="text" name="location" required
              defaultValue={initialData?.location}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins"
            />
          </div>
        </div>

        {/* ── Payment ── */}
        <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">
          Payment (₹)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Base Service Price</label>
            <input
              type="number" required min="0"
              value={basePrice || ""}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins bg-neutral-50 font-bold text-neutral-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Advance Rcvd</label>
            <input
              type="number" name="advance_amount" required min="0"
              value={advanceAmount || ""}
              onChange={(e) => setAdvanceAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-green-200 rounded-lg focus:ring-1 focus:ring-green-500 outline-none font-poppins bg-green-50 text-green-700 font-bold"
            />
          </div>
          {/* ── Expenses Section ── */}
          <div className="col-span-2">
            {/* Hidden fields for server action */}
            <input type="hidden" name="total_price" value={computedTotalPrice} />
            <input type="hidden" name="travel_expense" value={travelExpense} />
            <input type="hidden" name="other_expenses" value={otherExpenses} />
            <input type="hidden" name="expense_notes" value={expenseNotes} />

            <div className="flex items-center justify-between mb-3 mt-2">
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide">Additional Items (Travel, etc.)</label>
            </div>

            <div className="space-y-4">
              {costBlocks.map((block, i) => (
                <div key={block.id} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 relative">
                  <button type="button" onClick={() => removeCostBlock(i)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 bg-white rounded-full shadow-sm hit-area z-10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  
                  <h4 className="font-bold text-neutral-700 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                    Additional Item #{i + 1}
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Row 1: Investment */}
                    <div className="bg-white p-3 rounded-xl border border-amber-200/60 shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
                      <label className="text-[10px] uppercase font-bold text-amber-800 mb-1 block tracking-wider">
                        Investment (Business Cost)
                      </label>
                      <p className="text-[10px] text-neutral-400 mb-2 leading-tight">This amount will be deducted from your final profit calculation.</p>
                      <div className="flex gap-2">
                        <div className="relative w-28 shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-amber-700">₹</span>
                          <input type="number" min="0" value={block.invAmount || ""} onChange={e => updateCostBlock(i, "invAmount", Number(e.target.value))} placeholder="0" className="w-full pl-7 pr-2 py-2 border border-neutral-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm font-bold text-amber-900 bg-amber-50/20" />
                        </div>
                        <input type="text" value={block.invDesc} onChange={e => updateCostBlock(i, "invDesc", e.target.value)} placeholder="Description (e.g. Travel, Flowers)" className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-sm text-neutral-700" />
                      </div>
                    </div>

                    {/* Row 2: Client Price */}
                    <div className="bg-white p-3 rounded-xl border border-blue-200/60 shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      <label className="text-[10px] uppercase font-bold text-blue-800 mb-1 block tracking-wider">
                        Client Price
                      </label>
                      <p className="text-[10px] text-neutral-400 mb-2 leading-tight">This amount will be automatically added to the Final Service Price.</p>
                      <div className="flex gap-2">
                        <div className="relative w-28 shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-blue-700">₹</span>
                          <input type="number" min="0" value={block.clientAmount || ""} onChange={e => updateCostBlock(i, "clientAmount", Number(e.target.value))} placeholder="0" className="w-full pl-7 pr-2 py-2 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm font-bold text-blue-900 bg-blue-50/20" />
                        </div>
                        <input type="text" value={block.clientDesc} onChange={e => updateCostBlock(i, "clientDesc", e.target.value)} placeholder="Description shown to client" className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-neutral-700" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCostBlock}
                className="text-xs font-bold text-brand-secondary hover:text-brand-primary flex items-center gap-1 transition-colors uppercase tracking-wide bg-brand-secondary/5 px-4 py-2 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                + Add Item
              </button>
            </div>

            {costBlocks.length === 0 && (
              <p className="text-[11px] text-neutral-400 mt-3">No additional items added. Tap above to add items like travel or accessories.</p>
            )}
          </div>
        </div>

        {/* Balance summary */}
        <div className="space-y-1.5 mt-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-neutral-50 border border-neutral-200 mb-2">
             <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
               Base + Client Additions
             </span>
             <span className="text-sm font-poppins font-bold text-neutral-800">
               {basePrice > 0 ? `₹${basePrice}` : '0'} + {totalClient > 0 ? `₹${totalClient}` : '0'} = ₹{computedTotalPrice}
             </span>
          </div>

          <div className={`flex justify-between items-center p-3 rounded-lg ${pendingAmount > 0 ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"}`}>
            <span className={`text-xs font-bold uppercase tracking-widest ${pendingAmount > 0 ? "text-red-800" : "text-green-700"}`}>
              Pending Balance
            </span>
            <span className={`text-xl font-poppins font-bold ${pendingAmount > 0 ? "text-red-600" : "text-green-600"}`}>
              {pendingAmount > 0 ? `₹${pendingAmount}` : "Paid in Full"}
            </span>
          </div>
          {totalInv > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">Total Investment</span>
                <span className="text-sm font-poppins font-bold text-amber-800">₹{totalInv} (Cost to you)</span>
              </div>
              {costBlocks.filter(e => e.invDesc || e.invAmount > 0).map(e => (
                <div key={e.id} className="flex justify-between items-center px-3 py-1 text-[11px] text-amber-700">
                  <span>• {e.invDesc || 'Bonus Item'}</span>
                  <span className="font-semibold">₹{e.invAmount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Notes & Status ── */}
        <h3 className="font-playfair font-bold text-brand-primary border-b border-brand-secondary/20 pb-2 pt-2">
          Notes & Status
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Status</label>
            <select
              name="status" required
              defaultValue={initialData?.status || "upcoming"}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins font-semibold bg-white"
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Notes (Optional)</label>
            <textarea
              name="custom_message" rows={3}
              defaultValue={initialData?.custom_message}
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-1 focus:ring-brand-secondary outline-none font-poppins text-sm resize-none"
            />
          </div>
        </div>

        {/* Action buttons */}
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
    </div>
  );
}
