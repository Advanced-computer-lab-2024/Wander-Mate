"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderCard = () => {
    const [data, setData] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [todaysOrders, setTodaysOrders] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/viewAllOrders");
                const orders = response.data;

                setData(orders);

                // Filter pending and completed orders
                const pendingOrders = orders.filter((order) => order.status === "pending");
                const completedOrders = orders.filter((order) => order.status === "delivered"||order.status === "shipped");

                // Calculate total sales
                const total = completedOrders.reduce((acc, order) => acc + order.total, 0);

                // Get today's date to filter today's orders
                const today = new Date().toLocaleDateString();

                const todaysOrdersCount = orders.filter(
                    (order) => new Date(order.date).toLocaleDateString() === today
                ).length;

                // Set state values
                setPendingCount(pendingOrders.length);
                setCompletedCount(completedOrders.length);
                setTotalSales(total);
                setTodaysOrders(todaysOrdersCount);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Sales Card */}
            <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#f1e3fe] items-start relative shadow-lg">
                <div className="w-10 h-10 bg-[#e4c8fd] rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:shopping-bag" className="text-white text-xl" />
                </div>
                <span className="text-lg font-semibold text-[#6c3eae]">Total Sales</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#6c3eae]">${Number(totalSales).toFixed(2)}</span>
                    <Icon icon="heroicons:arrow-trending-up" className="text-[#6c3eae] w-5 h-5" />
                </div>
                {/* Circle at the corner (rounded corner style) */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#e4c8fd] rounded-bl-[50%] rounded-tl-[50%] transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Today's Orders Card */}
            <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#ffe5b3] items-start relative shadow-lg">
                <div className="w-10 h-10 bg-[#ffcc80] rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:today" className="text-white text-xl" />
                </div>
                <span className="text-lg font-semibold text-[#d18c4d]">Today's Orders</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#d18c4d]">{todaysOrders}</span>
                    <Icon icon="heroicons:arrow-trending-up" className="text-[#d18c4d] w-5 h-5" />
                </div>
                {/* Circle at the corner (rounded corner style) */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#ffcc80] rounded-bl-[50%] rounded-tl-[50%] transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Completed Orders Card */}
            <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#d9f9e0] items-start relative shadow-lg">
                <div className="w-10 h-10 bg-[#a3e28c] rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:check-circle" className="text-white text-xl" />
                </div>
                <span className="text-lg font-semibold text-[#4a9e5f]">Completed Orders</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#4a9e5f]">{completedCount}</span>
                    <Icon icon="heroicons:arrow-trending-up" className="text-[#4a9e5f] w-5 h-5" />
                </div>
                {/* Circle at the corner (rounded corner style) */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#a3e28c] rounded-bl-[50%] rounded-tl-[50%] transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Pending Orders Card */}
            <div className="flex flex-col gap-3 p-5 rounded-xl overflow-hidden bg-[#ffd9d9] items-start relative shadow-lg">
                <div className="w-10 h-10 bg-[#ffb3b3] rounded-full flex items-center justify-center">
                    <Icon icon="material-symbols:pending" className="text-white text-xl" />
                </div>
                <span className="text-lg font-semibold text-[#e56f6f]">Pending Orders</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#e56f6f]">{pendingCount}</span>
                    <Icon icon="heroicons:arrow-trending-up" className="text-[#e56f6f] w-5 h-5" />
                </div>
                {/* Circle at the corner (rounded corner style) */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#ffb3b3] rounded-bl-[50%] rounded-tl-[50%] transform translate-x-1/2 translate-y-1/2"></div>
            </div>
        </div>
    );
};

export default OrderCard;
