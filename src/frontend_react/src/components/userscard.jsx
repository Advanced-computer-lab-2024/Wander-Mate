"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";

const UserStatsCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      console.log("bnjb");
      try {
        const response = await axios.get(
          "http://localhost:8000/getUserStatistics"
        );
        console.log(response);
        const { totalUsers, monthlyNewUsers } = response.data;

        // Extract the new users for the current month
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        const currentMonthData = monthlyNewUsers.find(
          (data) =>
            data._id.year === currentYear && data._id.month === currentMonth
        );
        console.log(response);

        setTotalUsers(totalUsers);
        setNewUsersThisMonth(currentMonthData ? currentMonthData.newUsers : 0);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    fetchUserStatistics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Users Card */}
      <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#e3f2fd] items-start relative shadow-lg">
        <div className="w-10 h-10 bg-[#90caf9] rounded-full flex items-center justify-center">
          <Icon icon="mdi:account-group" className="text-white text-xl" />
        </div>
        <span className="text-lg font-semibold text-[#1e88e5]">
          Total Users
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#1e88e5]">
            {totalUsers}
          </span>
          <Icon
            icon="heroicons:arrow-trending-up"
            className="text-[#1e88e5] w-5 h-5"
          />
        </div>
      </div>

      {/* New Users This Month Card */}
      <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#e8f5e9] items-start relative shadow-lg">
        <div className="w-10 h-10 bg-[#66bb6a] rounded-full flex items-center justify-center">
          <Icon icon="mdi:calendar-month" className="text-white text-xl" />
        </div>
        <span className="text-lg font-semibold text-[#388e3c]">
          New Users This Month
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#388e3c]">
            {newUsersThisMonth}
          </span>
          <Icon
            icon="heroicons:arrow-trending-up"
            className="text-[#388e3c] w-5 h-5"
          />
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;
