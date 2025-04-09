"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Falha na autenticação", "Tempo esgotado", "Outros"],
  datasets: [
    {
      label: "Erros por categoria",
      data: [252, 71, 27],
      backgroundColor: [
        "rgba(251, 113, 133, 0.8)",
        "rgba(56, 189, 248, 0.8)",
        "rgba(250, 204, 21, 0.8)",
      ],
      borderColor: [
        "rgba(251, 113, 133, 1)",
        "rgba(56, 189, 248, 1)",
        "rgba(250, 204, 21, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function PizzaChart() {
  return (
    <div className="w-full max-w-[200px]">
      <Pie
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "right",
              align: "center",
              labels: {
                color: "#ffffff",
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 10,
                font: {
                  size: 11,
                }
              },
            },
            title: {
              display: true,
              text: "Gráfico de Erros do sistema",
              color: "#ffffff",
              font: {
                size: 16,
                weight: 'bold',
              },
              padding: {
                bottom: 15,
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + (b as number), 0);
                  const percentage = Math.round((value as number / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
        }}
        data={data}
      />
    </div>
  );
}
