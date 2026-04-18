"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

/** Returns today's date as YYYY-MM-DD string in IST, regardless of visitor's device locale */
function getTodayIST(): Date {
  // toLocaleDateString with timeZone gives us the IST date string, which we parse back into a midnight Date
  const istDateStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // "YYYY-MM-DD"
  const [year, month, day] = istDateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Dynamic booked dates passed from Next.js server component
export default function Calendar({ bookedDates = [] }: { bookedDates?: string[] }) {
  const { t } = useLanguage();

  const [today, setToday] = useState<Date | null>(null);
  const [activeMonth, setActiveMonth] = useState(0); // 0, 1, or 2
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeMonth < 2) {
      setActiveMonth((prev) => prev + 1);
    }
    if (isRightSwipe && activeMonth > 0) {
      setActiveMonth((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setToday(getTodayIST());
  }, []);

  if (!today) {
    return (
      <section className="scroll-mt-20 py-12 px-6 bg-brand-light" id="calendar">
        <div className="text-center mb-8">
          <h3 className="font-playfair text-3xl font-bold text-brand-primary">
            {t("calendar.title")}
          </h3>
          <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full" />
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-3 w-3 bg-brand-secondary/50 rounded-full"></div>
            <div className="h-3 w-3 bg-brand-secondary/50 rounded-full"></div>
            <div className="h-3 w-3 bg-brand-secondary/50 rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  // Generate the current month + next 2 months based on IST
  const getMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(d);
    }
    return months;
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const months = getMonths();
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const activeDate = months[activeMonth];
  const yearNum = activeDate.getFullYear();
  const monthNum = activeDate.getMonth();
  const daysInMonth = getDaysInMonth(yearNum, monthNum);
  const firstDay = getFirstDayOfMonth(yearNum, monthNum);

  const blanks = Array.from({ length: firstDay }).map((_, i) => (
    <div key={`blank-${i}`} className="p-2" />
  ));

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const date = i + 1;
    const dateStr = `${yearNum}-${String(monthNum + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    const isBooked = bookedDates.includes(dateStr);
    // Compare against IST midnight — a date is past if it is strictly before or equal to today
    const thisDate = new Date(yearNum, monthNum, date);
    const isPast = thisDate <= today;

    let bgClass = "";
    if (isPast) {
      bgClass = "bg-neutral-100 text-neutral-400 opacity-50";
    } else if (isBooked) {
      bgClass = "bg-red-50 text-red-700 border border-red-200 font-bold cursor-not-allowed";
    } else {
      bgClass = "bg-green-50 text-green-700 border border-green-200 font-bold shadow-sm";
    }

    return (
      <div
        key={dateStr}
        className={`aspect-square flex items-center justify-center rounded-lg text-sm ${bgClass}`}
      >
        {date}
      </div>
    );
  });

  return (
    <section className="scroll-mt-20 py-12 px-6 bg-brand-light" id="calendar">
      <div className="text-center mb-8">
        <h3 className="font-playfair text-3xl font-bold text-brand-primary">
          {t("calendar.title")}
        </h3>
        <div className="w-16 h-1 bg-brand-secondary mx-auto mt-4 rounded-full" />
      </div>

      {/* Month Tabs */}
      <div className="flex gap-2 justify-center mb-6">
        {months.map((month, idx) => {
          const label = month.toLocaleDateString("en-US", { month: "long" });
          const isActive = idx === activeMonth;
          return (
            <button
              key={idx}
              onClick={() => setActiveMonth(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-poppins font-semibold transition-all shadow-sm ${
                isActive
                  ? "bg-brand-secondary text-white shadow-md scale-105"
                  : "bg-white text-brand-primary border border-brand-secondary/20 hover:bg-brand-secondary/10"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Single Calendar */}
      <div 
        className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 max-w-sm mx-auto touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks}
          {days}
        </div>

        {/* Integrated Legend at Bottom */}
        <div className="mt-6 pt-4 border-t border-dashed border-neutral-100 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm border border-white" />
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t("calendar.available")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm border border-white" />
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">{t("calendar.booked")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
