"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { hslToHex, hexToRGB } from "../lib/utils";
import { useThemeStore } from "../store";
import { useTheme } from "next-themes";
import { themes } from "../config/thems";
import { Doughnut } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import TourismGovernerFooter from "../components/tourismGovernerFooter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LegendEventsAdvertiser = ({ height = 350 }) => {
  const { theme: config } = useThemeStore();
  const { theme: mode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = themes.find((theme) => theme.name === config);

  const hslPrimary = `hsla(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
  })`;
  const hslInfo = `hsla(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].info
  })`;
  const hslWarning = `hsla(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].warning
  })`;
  const hslSuccess = `hsla(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].success
  })`;
  const hslMuted = `hsla(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].muted
  })`;

  const rgbPrimary = hexToRGB(hslToHex(hslPrimary), 0.8);
  const rgbInfo = hexToRGB(hslToHex(hslInfo), 0.8);
  const rgbWarning = hexToRGB(hslToHex(hslWarning), 0.8);
  const rgbSuccess = hexToRGB(hslToHex(hslSuccess), 0.8);
  const rgbMuted = hexToRGB(hslToHex(hslMuted), 0.8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const username = sessionStorage.getItem("username");
        const reply = await fetch(`http://localhost:8000/getID/${username}`);
        if (!reply.ok) throw new Error("Failed to get Advertiser ID");

        const { userID } = await reply.json();
        const advertiserId = userID;
        const response = await fetch(
          `http://localhost:8000/getAdvertiserTotalAttractionBookings/${advertiserId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        // Check if result.data exists and is an array
        console.log(result);
        if (
          result.report.activities &&
          Array.isArray(result.report.activities)
        ) {
          setChartData(result.report.activities);
        } else {
          console.error("No sales data available");
          setChartData([]); // Set to empty array if data is invalid
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setChartData([]); // Set to empty array on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Check if chartData is empty or undefined before calling .map()
  const data = {
    labels:
      chartData?.length > 0 ? chartData.map((item) => item.attractionName) : [],
    datasets: [
      {
        label: "Total Quantity",
        data:
          chartData?.length > 0
            ? chartData.map((item) => item.totalBookings)
            : [],
        backgroundColor: [
          rgbPrimary,
          rgbInfo,
          rgbWarning,
          rgbSuccess,
          rgbMuted,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: `hsl(${
            theme?.cssVars[
              mode === "dark" || mode === "system" ? "dark" : "light"
            ].chartLabel
          })`,
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) return <div>Loading...</div>; // Show loading message until data is fetched

  return (
    <React.Fragment>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Doughnut options={options} data={data} height={height} />
        </CardContent>
      </Card>
      {/* <TourismGovernerFooter /> */}
    </React.Fragment>
  );
};

export default LegendEventsAdvertiser;
