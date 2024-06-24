'use client'

import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  export const options = {
    responsive: true,
    locale: 'pt-BR',
    scales: {
      x: {
        display: true,
        ticks: {
            color: '#ffffff'
        }, 
      },
      y: {
        display: true,
        ticks: {
            color: '#ffffff'
        }, 
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: "#ffffff"
        }
      },
      title: {
        display: true,
        text: 'Quantidade de Logs ao longo do Tempo',
        color: '#ffffff',
        font: {
          size: 16
        }
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export const data = {
    labels,
    datasets: [
      {
        label: 'Quantidade de Logs (Sucesso)',
        data: [100, 101, 97, 85, 102, 92, 94],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Quantidade de Logs (Error)',
        data: [47, 46, 55, 51, 50, 60, 69],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };


export default function BarChart(user: any) {

  return (
    <div >
      <Bar options={options} data={data} />
    </div>
  );
}
