import React from "react";
import { Building, MapPin, Send } from "lucide-react";
import photo1 from "../public/images/files/greeece.jpg";
import photo2 from "../public/images/files/roma.jpg";

export default function BookingSteps() {
  return (
    <div className="container mx-auto px-4 py-16 relative">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 font-['Open_Sans']">
          Book Your Next Trip in 3 Easy Steps
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column - Steps */}
        <div className="space-y-10">
          {/* Step 1 */}
          <div className="flex gap-6">
            <div className="bg-[#F0BB1F] w-[70px] h-[70px] rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#5E6282] mb-3 text-xl font-['Open_Sans']">
                Choose Destination
              </h3>
              <p className="text-[#5E6282] text-lg font-['Open_Sans']">
              Select your dream travel destination from a variety of options across the globe, tailored to your preferences.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6">
            <div className="bg-[#F15A2B] w-[70px] h-[70px] rounded-2xl flex items-center justify-center shrink-0">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#5E6282] mb-3 text-xl font-['Open_Sans']">
                Make Payment
              </h3>
              <p className="text-[#5E6282] text-lg font-['Open_Sans']">
              Complete your booking securely with our multiple payment options, including credit card or wallet.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6">
            <div className="bg-[#006380] w-[70px] h-[70px] rounded-2xl flex items-center justify-center shrink-0">
              <Send className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#5E6282] mb-3 text-xl font-['Open_Sans']">
                Reach Airport on Selected Date
              </h3>
              <p className="text-[#5E6282] text-lg font-['Open_Sans']">
              Arrive at the airport on your selected date, and let us take care of the rest for a hassle-free journey.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Main Trip Card (Trip to Greece) */}
        <div className="relative">
          {/* Blue blur effect */}
          <div className="absolute top-0 right-0 w-[354px] h-[367px] bg-[#59B1E6] opacity-40 blur-[75px] rounded-full" />

          {/* Main Trip Card - Greece */}
          <div className="relative w-full max-w-[370px] bg-white rounded-[26px] shadow-[0px_100px_80px_rgba(0,0,0,0.02),0px_64.8148px_46.8519px_rgba(0,0,0,0.0151852)] z-10">
            <div className="p-6 space-y-6">
              <img
                src={photo1}
                alt="Trip to Greece"
                className="rounded-[24px] w-full object-cover"
              />

              <h3 className="font-medium text-xl text-[#080809] font-['Poppins']">
                Trip To Greece
              </h3>

              <div className="flex items-center gap-4 text-[#84829A] text-base font-['Poppins']">
                <span className="text-base">14-29 June</span>
                <div className="w-px h-5 bg-[#84829A]" />
                <span className="text-base">by Robbin Joseph</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#84829A]" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                    <Send className="w-6 h-6 text-[#84829A]" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                    <Building className="w-6 h-6 text-[#84829A]" />
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-auto text-[#84829A] text-base font-['Poppins']">
                  <Building className="w-5 h-5" />
                  <span className="text-base">24 people going</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rome Trip Card */}
          <div className="absolute bottom-3 right-12 w-[263px] bg-white rounded-[18px] shadow-xl z-20">
            <div className="p-5 flex gap-4">
            <div className="relative w-[55px] h-[55px] rounded-full bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.3)] overflow-hidden">
  <img
    src={photo2}
    alt="Trip to Rome"
    className="object-cover w-full h-full"
  />
</div>


              <div className="flex-1">
                <span className="text-sm text-[#84829A] font-['Poppins']">
                  Ongoing
                </span>
                <h4 className="font-medium text-lg text-[#080809] font-['Poppins']">
                  Trip to Rome
                </h4>
                <span className="text-sm text-[#8A79DF] font-['Poppins']">
                  40% completed
                </span>
                <div className="mt-3 h-[6px] bg-[#F5F5F5] rounded-full">
                  <div className="w-[40%] h-full bg-[#8A79DF] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
