import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto';

const ReportPage = () => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
  
    useEffect(() => {
      if (chartRef.current) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
  
        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Orders',
                data: [120, 190, 300, 500, 200, 300],
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: { y: { beginAtZero: true } },
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
  
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }, []);
  
    return (
      <section className="p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-xl p-6">
          <h1 className="font-bold text-sm mb-4 select-none">Monthly Order Report</h1>
          <div className="h-64">
            <canvas ref={chartRef} id="orderChart"></canvas>
          </div>
        </div>
      </section>
    );
  };

  export default ReportPage