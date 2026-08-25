"use client";

import { useState } from "react";
import {
  UserRound,
  ChevronDown,
  TicketsPlane,
  Plus,
  Minus,
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  CalendarIcon,
  Search,
} from "lucide-react";
import DatePicker, { registerLocale } from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("id", id);

export default function InputFlight() {
  const [boxOpen, setBoxOpen] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [balita, setBalita] = useState(0);
  const [ticketClass, setTicketClass] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const classes = ["Economy", "Business", "First"];
  const [tripType, setTripType] = useState("one-way");
  const dateLabel = departureDate
    ? format(departureDate, "d MMM yyyy", { locale: id })
    : "Pilih Tanggal";
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl bg-white border border-slate-100 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
            <input
              type="radio"
              name="tripType"
              value="one-way"
              checked={tripType === "one-way"}
              onChange={() => setTripType("one-way")}
              className="w-4 h-4 accent-blue-600"
            />
            <span>One Way</span>
          </label>
        </div>

        <div className="flex gap-8">
          <div className="relative">
            <button
              className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 rounded-full px-3 py-2 hover:bg-slate-50 transition-colors"
              onClick={() => setBoxOpen("passanger")}
            >
              <UserRound size={18} />
              <span>Penumpang</span>
              <ChevronDown size={18} />
            </button>
            {boxOpen === "passanger" && (
              <>
                <div
                  className="fixed inset-0 z-10 bg-transparent"
                  onClick={() => setBoxOpen("")}
                />
                <div className="flex flex-col gap-5 items-start w-md bg-white rounded-lg p-5 absolute right-0 mt-2 border border-slate-200 shadow-lg z-20">
                  <span className="font-bold text-2xl">Atur Penumpang</span>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-md">Dewasa (12 tahun ke atas)</span>
                    <div className="flex gap-5 items-center">
                      <button
                        className="w-8 h-8 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                        onClick={() => setAdults((prev) => prev + 1)}
                      >
                        <Plus size={20} className="stroke-[2.5]" />
                      </button>
                      <span>{adults}</span>
                      <button>
                        <Minus
                          size={20}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            adults <= 0
                              ? "border-slate-200 text-slate-300 cursor-not-allowed"
                              : "border-blue-500 text-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => setAdults((prev) => prev - 1)}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-md">Anak (2 - 11 tahun)</span>
                    <div className="flex gap-5 items-center">
                      <button
                        className="w-8 h-8 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                        onClick={() => setChildren((prev) => prev + 1)}
                      >
                        <Plus size={20} className="stroke-[2.5]" />
                      </button>
                      <span>{children}</span>
                      <button>
                        <Minus
                          size={20}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            children <= 0
                              ? "border-slate-200 text-slate-300 cursor-not-allowed"
                              : "border-blue-500 text-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => setChildren((prev) => prev - 1)}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <span className="text-md">Bayi (dibawah 2 tahun)</span>
                    <div className="flex gap-5 items-center">
                      <button
                        className="w-8 h-8 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                        onClick={() => setBalita((prev) => prev + 1)}
                      >
                        <Plus size={20} className="stroke-[2.5]" />
                      </button>
                      <span>{balita}</span>
                      <button>
                        <Minus
                          size={20}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            balita <= 0
                              ? "border-slate-200 text-slate-300 cursor-not-allowed"
                              : "border-blue-500 text-blue-500 hover:bg-blue-50"
                          }`}
                          onClick={() => setBalita((prev) => prev - 1)}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 rounded-full px-3 py-2 hover:bg-slate-50 transition-colors"
              onClick={() => setBoxOpen("class")}
            >
              <TicketsPlane size={18} />
              <span>Class</span>
              <ChevronDown size={18} />
            </button>
            {boxOpen === "class" && (
              <>
                <div
                  className="fixed inset-0 z-10 bg-transparent"
                  onClick={() => setBoxOpen("")}
                />
                <div className="grid grid-cols-2 gap-5 items-start w-xs bg-white rounded-lg p-5 absolute right-0 mt-2 border border-slate-200 shadow-lg z-20">
                  {classes.map((item) => {
                    const isSelected = ticketClass === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setTicketClass(item)}
                        className={`w-full py-2.5 px-4 rounded-full text-sm font-medium border transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 text-blue-500"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-200" />

      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 md:gap-4 md:items-end">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-xs font-medium text-slate-600">
            From
          </label>
          <div className="relative flex items-center">
            <PlaneTakeoff
              size={18}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              id="from"
              type="text"
              placeholder="Origin"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
              onChange={(e) => setFrom(e.target.value)}
              value={from}
            />
          </div>
        </div>

        <div className="flex md:items-end justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 text-slate-500 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="to" className="text-xs font-medium text-slate-600">
            To
          </label>
          <div className="relative flex items-center">
            <PlaneLanding
              size={18}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              id="to"
              type="text"
              placeholder="Destination"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
              onChange={(e) => setTo(e.target.value)}
              value={to}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-xs font-medium text-slate-600">
            Date
          </label>
          <div className="relative">
            <button
              id="date"
              type="button"
              onClick={() => setIsOpenCalendar(!isOpenCalendar)}
              className="flex items-center gap-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 hover:border-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition text-left"
            >
              <CalendarIcon size={18} className="text-slate-400 shrink-0" />
              <span className="text-sm font-medium text-slate-800 truncate">
                {dateLabel}
              </span>
            </button>
            {isOpenCalendar && (
              <div className="relative">
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsOpenCalendar(false)}
                />

                <div className="absolute top-full left-0 mt-2 z-30 bg-white p-4 rounded-xl shadow-xl border border-slate-200">
                  <DatePicker
                    selected={departureDate}
                    onChange={(date: Date | null) => {
                      setDepartureDate(date);
                      setIsOpenCalendar(false);
                    }}
                    minDate={new Date()}
                    locale="id"
                    inline
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          className="h-11 md:mt-[22px] w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          <Search size={18} />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
