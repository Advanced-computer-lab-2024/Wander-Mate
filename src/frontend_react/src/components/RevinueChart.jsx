'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Chart options
const options = {
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      }
    },
    y: {
      stacked: true,
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
      ticks: {
        maxTicksLimit: 10,
      },
      max: 180
    },
  },
}

// Sample data
const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Net Profit',
      data: [40, 35, 35, 30, 20, 35, 20, 35, 35, 35, 40, 35],
      backgroundColor: '#a855f7',
    },
    {
      label: 'Orders',
      data: [50, 45, 35, 45, 15, 45, 30, 40, 40, 25, 55, 55],
      backgroundColor: '#22d3ee',
    },
    {
      label: 'Return',
      data: [40, 45, 45, 45, 30, 45, 55, 40, 60, 35, 25, 55],
      backgroundColor: '#fb923c',
    },
  ],
}

export default function RevenueChart() {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">Average Revenue</h2>
        <Select defaultValue="2023">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] ">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}
