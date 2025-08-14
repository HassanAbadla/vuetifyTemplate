<template>
  <div class="chart-container" :style="containerStyle">
    <h2 v-if="chartTitle">{{ chartTitle }}</h2>
    <canvas id="myChart" ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "Chart",
  props: {
    type: { type: String, default: "bar" },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
    chartTitle: {
      type: String,
    },
    chartHeight: {
      type: [Number, String],
      default: 300,
    },
    chartWidth: {
      type: [Number, String],
      default: "100%",
    },
    chartMaxWidth: {
      type: [Number, String],
      default: 800,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    containerStyle() {
      return {
        height:
          typeof this.chartHeight === "number"
            ? `${this.chartHeight}px`
            : this.chartHeight,
        width:
          typeof this.chartWidth === "number"
            ? `${this.chartWidth}px`
            : this.chartWidth,
        maxWidth:
          typeof this.chartMaxWidth === "number"
            ? `${this.chartMaxWidth}px`
            : this.chartMaxWidth,
      };
    },
    mergedOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        ...this.chartOptions,
      };
    },
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      try {
        const ctx = this.$refs.chartCanvas.getContext("2d");
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart(ctx, {
          type: this.type,
          data: this.chartData,
          options: this.mergedOptions,
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    },
  },
  watch: {
    chartData: {
      handler() {
        this.$nextTick(this.createChart);
      },
      deep: true,
    },
    chartOptions: {
      handler() {
        this.$nextTick(this.createChart);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: 0 auto;
}
</style>
