"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

// Simple JS Config for booked dates
const BOOKED_DATES = ["2026-04-11", "2026-04-12"];

export default function Calendar() {
  const { t } = useLanguage();

  // Generate the current month + next 2 months
  const getMonths = () => {
    const months = [];
    const today = new Date();
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

  const [activeMonth, setActiveMonth] = useState(0); // 0, 1, or 2

  const activeDate = months[activeMonth];
  const yearNum = activeDate.getFullYear();
  const monthNum = activeDate.getMonth();
  const daysInMonth = getDaysInMonth(yearNum, monthNum);
  const firstDay = getFirstDayOfMonth(yearNum, monthNum);

  const blanks = Array.from({ length: firstDay }).map((_, i) => (
    <div key={`blank-${i}`} className="p-2" />
  ));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const date = i + 1;
    const dateStr = `${yearNum}-${String(monthNum + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    const isBooked = BOOKED_DATES.includes(dateStr);
    const isPast = new Date(dateStr) < today;

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
    <section className="py-12 px-6 bg-brand-light" id="availability">
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

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm border border-white" />
          <span className="text-neutral-600">{t("calendar.available")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm border border-white" />
          <span className="text-neutral-600">{t("calendar.booked")}</span>
        </div>
      </div>

      {/* Single Calendar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
        <h4 className="font-playfair text-xl font-bold text-center mb-4 text-brand-primary">
          {activeDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h4>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-neutral-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks}
          {days}
        </div>
      </div>
    </section>
  );
}
