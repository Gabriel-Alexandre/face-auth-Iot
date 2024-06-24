"use client";

import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Falha na autenticação", "Tempo esgotado", "Outros"],
  datasets: [
    {
      label: "# of Votes",
      data: [52, 11, 6],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export default function PizzaChart(user: any) {
  const [loading, setLoading] = useState<boolean | undefined>(false);

  return (
    <div className="w-60">
      <Pie
        options={{
          plugins: {
            legend: {
              align: "center",
              position: "bottom",
            },
            title: {
              display: true,
              text: "Gráfico de Erros do sistema",
              color: "#ffffff",
              font: {
                size: 16,
              },
            },
          },
        }}
        data={data}
      />
    </div>
  );
}
