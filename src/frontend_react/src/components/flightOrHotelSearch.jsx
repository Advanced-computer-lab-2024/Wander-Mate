import { ArrowDown, ArrowRight, Calendar } from "lucide-react";
import { useState } from "react";

const FlightOrHotelSearch = () => {
  const [selected, setSelected] = useState(0);
  const [buttonText, setButtonText] = useState("Search Hotels");
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div
        className="bg-[#EAF0F0] rounded-t-3xl"
        style={{ width: "fit-content" }}
      >
        <div className="flex items-center p-7 gap-5">
          <button
            className={
              selected === 0
                ? "flex items-center px-8 py-3 gap-4 bg-[#826AF9] rounded-lg text-white"
                : "flex items-center px-8 py-3 gap-4 text-[#283841]"
            }
            onClick={() => {
              setSelected(0);
              setButtonText("Search Hotels");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
              <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
              <path d="M12 4v16" />
            </svg>
            <span className="font-bold text-base tracking-wider">Hotels</span>
          </button>
          <button
            className={
              selected === 1
                ? "flex items-center px-8 py-3 gap-4 bg-[#826AF9] rounded-lg text-white"
                : "flex items-center px-8 py-3 gap-4 text-[#283841]"
            }
            onClick={() => {
              setSelected(1);
              setButtonText("Search Flights");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
            <span className="font-bold text-base tracking-wider">Flights</span>
          </button>
        </div>
      </div>
      <div className="bg-[#EAF0F0] rounded-b-3xl rounded-tr-3xl p-7">
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Destinations
              </span>
              <ArrowDown className="w-6 h-6 text-[#283841]" />
            </div>
            <div className="flex items-center p-3 bg-[#28384110] rounded-md">
              <input
                type="text"
                placeholder="Where are you going?"
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Check in
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
              <input
                type="text"
                placeholder="Choose Dates"
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
              <Calendar className="w-6 h-6 text-[#826AF9]" />
            </div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Check Out
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#28384110] rounded-md">
              <input
                type="text"
                placeholder="Choose Dates"
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
              <Calendar className="w-6 h-6 text-[#826AF9]" />
            </div>
          </div>
          <div className="flex-1 min-w-[280px]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-bold text-base tracking-wider text-[#283841]">
                Guest
              </span>
              <ArrowDown className="w-6 h-6 text-[#283841]" />
            </div>
            <div className="flex items-center p-3 bg-[#28384110] rounded-md">
              <input
                type="text"
                placeholder="Add guest"
                className="bg-transparent w-full text-base text-[#283841] placeholder-[#28384180] focus:outline-none"
              />
            </div>
          </div>
          <button className="flex items-center justify-center px-3 py-3 gap-2.5 bg-[#826AF9] rounded-lg text-white min-w-[186px]">
            <span className="font-semibold text-base tracking-wider">
              {buttonText}
            </span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightOrHotelSearch;
