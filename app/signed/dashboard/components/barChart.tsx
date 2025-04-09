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
    ArcElement,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Pie } from "react-chartjs-2";
  
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dados mockados para diferentes períodos
const chartData = {
  mensal: {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
    sucesso: [100, 101, 97, 85, 102, 92, 94],
    erro: [47, 46, 55, 51, 50, 60, 69]
  },
  trimestral: {
    labels: ['1º Trimestre', '2º Trimestre', '3º Trimestre', '4º Trimestre'],
    sucesso: [298, 279, 320, 250],
    erro: [148, 161, 135, 105]
  },
  semestral: {
    labels: ['1º Semestre', '2º Semestre'],
    sucesso: [577, 570],
    erro: [309, 240]
  }
};

// Dados para o gráfico de pizza
const pieData = {
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

export default function BarChart() {
  const [periodo, setPeriodo] = useState<'mensal' | 'trimestral' | 'semestral'>('semestral');
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    locale: 'pt-BR',
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        display: true,
        ticks: {
            color: '#ffffff',
            font: {
              size: 11
            }
        }, 
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        display: true,
        ticks: {
            color: '#ffffff',
            font: {
              size: 11
            }
        }, 
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: "#ffffff",
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Quantidade de Logs ao longo do Tempo',
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: {
          bottom: 10
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          color: "#ffffff",
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          padding: 10,
          font: {
            size: 10,
          }
        },
      },
      title: {
        display: true,
        text: "Gráfico de Erros do sistema",
        color: '#ffffff',
        font: {
          size: 14,
          weight: 'bold' as const
        },
        padding: {
          bottom: 5,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const data = {
    labels: chartData[periodo].labels,
    datasets: [
      {
        label: 'Quantidade de Logs (Sucesso)',
        data: chartData[periodo].sucesso,
        backgroundColor: 'rgba(56, 189, 248, 0.7)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      },
      {
        label: 'Quantidade de Logs (Erro)',
        data: chartData[periodo].erro,
        backgroundColor: 'rgba(251, 113, 133, 0.7)',
        borderColor: 'rgba(251, 113, 133, 1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  // Calcular estatísticas
  const totalSucesso = chartData[periodo].sucesso.reduce((a, b) => a + b, 0);
  const totalErro = chartData[periodo].erro.reduce((a, b) => a + b, 0);
  const total = totalSucesso + totalErro;
  const taxaSucesso = ((totalSucesso / total) * 100).toFixed(1);
  const mediaSucesso = (totalSucesso / chartData[periodo].sucesso.length).toFixed(0);
  const mediaErro = (totalErro / chartData[periodo].erro.length).toFixed(0);
  const maxSucesso = Math.max(...chartData[periodo].sucesso);
  const maxErro = Math.max(...chartData[periodo].erro);

  return (
    <div className="flex flex-col h-full bg-gray-900 bg-opacity-40 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">Desempenho do Sistema</h3>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button 
            className={`px-4 py-1 text-xs rounded-md transition-colors ${periodo === 'mensal' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setPeriodo('mensal')}
          >
            Mensal
          </button>
          <button 
            className={`px-4 py-1 text-xs rounded-md transition-colors ${periodo === 'trimestral' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setPeriodo('trimestral')}
          >
            Trimestral
          </button>
          <button 
            className={`px-4 py-1 text-xs rounded-md transition-colors ${periodo === 'semestral' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setPeriodo('semestral')}
          >
            Semestral
          </button>
        </div>
      </div>
      
      <div className="h-[340px] mt-8 mb-16">
        <Bar options={options} data={data} />
      </div>
      
      <div className="grid grid-cols-12 gap-6 h-[300px]">
        {/* Estatísticas */}
        <div className="col-span-7 flex flex-col h-full">
          <div className="grid grid-cols-3 gap-4 mb-6 flex-1">
            <div className="bg-gray-800 bg-opacity-50 rounded-md p-3">
              <p className="text-xs text-gray-400 mb-2">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-blue-400">{taxaSucesso}%</p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-md p-3">
              <p className="text-xs text-gray-400 mb-2">Média de Logs/Período</p>
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-blue-400">{mediaSucesso}</span>
                  <span className="text-xs text-gray-400 ml-2">sucesso</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xl font-bold text-red-400">{mediaErro}</span>
                  <span className="text-xs text-gray-400 ml-2">erro</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-md p-3">
              <p className="text-xs text-gray-400 mb-2">Pico de Atividade</p>
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-blue-400">{maxSucesso}</span>
                  <span className="text-xs text-gray-400 ml-2">sucesso</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xl font-bold text-red-400">{maxErro}</span>
                  <span className="text-xs text-gray-400 ml-2">erro</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-md p-3 flex-1">
            <p className="text-xs text-gray-400 mb-2">Total de Logs</p>
            <p className="text-2xl font-bold text-white mb-2">{total}</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${taxaSucesso}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de Pizza */}
        <div className="col-span-5 bg-gray-800 bg-opacity-50 rounded-md p-3 flex items-center justify-center h-full">
          <div className="h-[250px] w-full">
            <Pie options={pieOptions} data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
