<template>
  <div class="charts-wrapper">
    <div class="chart-card">
      <Chart
        :type="'doughnut'"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :chart-title="chartTitle"
        :chart-height="chartHeight"
        :chart-width="chartWidth"
        :chart-max-width="chartMaxWidth"
      />
    </div>
    <div class="chart-card">
      <Chart
        :type="'line'"
        :chart-data="chart2.chartData"
        :chart-options="chart2.chartOptions"
        :chart-title="chart2.chartTitle"
        :chart-height="chart2.chartHeight"
        :chart-width="chart2.chartWidth"
        :chart-max-width="chart2.chartMaxWidth"
      />
    </div>
    <div class="chart-card">
      <Chart
        :type="'radar'"
        :chart-data="chart3.chartData"
        :chart-options="chart3.chartOptions"
        :chart-title="chart3.chartTitle"
        :chart-height="chart3.chartHeight"
        :chart-width="chart3.chartWidth"
        :chart-max-width="chart3.chartMaxWidth"
      />
    </div>
    <div class="chart-card">
      <Chart
        :type="'bar'"
        :chart-data="chart4.chartData"
        :chart-options="chart4.chartOptions"
        :chart-title="chart4.chartTitle"
        :chart-height="chart4.chartHeight"
        :chart-width="chart4.chartWidth"
        :chart-max-width="chart4.chartMaxWidth"
      />
    </div>
  </div>
</template>

<script>
import Chart from "@/components/chart.vue";
export default {
  name: "OrdersPage",
  components: {
    Chart,
  },
  data() {
    return {
      chartTitle: "Monthly Orders",
      chartHeight: 400,
      chartWidth: "100%",
      chartMaxWidth: 1000,

      // Doughnut Chart with gradient
      chartData: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Orders",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "#FF6384");
              gradient.addColorStop(1, "#FFB6C1");
              return gradient;
            },
            borderColor: "#FF4B68",
            borderWidth: 1,
          },
        ],
      },

      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },

      // Line Chart with gradient
      chart2: {
        chartTitle: "Monthly Orders 2",
        chartHeight: 400,
        chartWidth: "100%",
        chartMaxWidth: 1000,
        chartData: {
          labels: ["cat", "dog", "Mouse", "waa", "mlm", "June"],
          datasets: [
            {
              label: "Orders",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#36A2EB");
                gradient.addColorStop(1, "#A2D9CE");
                return gradient;
              },
              borderColor: "#228BE6",
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        chartOptions: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },

      // Radar Chart with gradient
      chart3: {
        chartTitle: "Monthly Orders 3",
        chartHeight: 400,
        chartWidth: "100%",
        chartMaxWidth: 1000,
        chartData: {
          labels: ["cat", "dog", "Mouse", "waa", "mlm", "June"],
          datasets: [
            {
              label: "Orders",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createRadialGradient(
                  150,
                  150,
                  50,
                  150,
                  150,
                  150
                );
                gradient.addColorStop(0, "#FFCE56");
                gradient.addColorStop(1, "#FFF8DC");
                return gradient;
              },
              borderColor: "#F1C40F",
              borderWidth: 2,
            },
          ],
        },
        chartOptions: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
            },
          },
        },
      },

      // Bar Chart with gradient
      chart4: {
        chartTitle: "Monthly Orders 4",
        chartHeight: 400,
        chartWidth: "100%",
        chartMaxWidth: 1000,
        chartData: {
          labels: ["cat", "dog", "Mouse", "waa", "mlm", "June"],
          datasets: [
            {
              label: "Orders",
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "#4BC0C0");
                gradient.addColorStop(1, "#B2DFDB");
                return gradient;
              },
              borderColor: "#26A69A",
              borderWidth: 1,
            },
          ],
        },
        chartOptions: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    };
  },
};
</script>
<style scoped>
.charts-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
