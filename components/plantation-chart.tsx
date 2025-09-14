"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface PlantationData {
  month: string
  saplings_planted: number
}

interface PlantationChartProps {
  data: PlantationData[]
}

export function PlantationChart({ data }: PlantationChartProps) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Saplings Planted',
        data: data.map(item => item.saplings_planted),
        backgroundColor: 'rgba(22, 163, 74, 0.6)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString()
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}
