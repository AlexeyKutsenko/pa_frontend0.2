<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col class="m-2 shadow border-rounded">
          <canvas id="sectorsBreakdownChart" />
        </b-col>
        <b-col class="m-2 shadow border-rounded">
          <canvas id="industriesBreakdownChart" />
        </b-col>
        <b-col class="m-2 shadow border-rounded">
          <canvas id="companiesBreakdownChart" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Chart from 'chart.js';
import ColorHash from 'color-hash';

export default {
  name: 'PortfolioBreakdowns',
  props: {
    industriesBreakdown: {
      type: Array,
      default: () => []
    },
    sectorsBreakdown: {
      type: Array,
      default: () => []
    },
    tickers: {
      type: Array,
      default: () => []
    },
    totalTickers: {
      type: Number,
      default: () => undefined
    }
  },
  data: function () {
    return {
      colorHash: new ColorHash(),
      defaultChartConfig: {
        type: 'doughnut',
        data: null,
        options: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Default Title'
          },
        },
      },
    }
  },
  mounted: function () {
    this.buildCompaniesBreakdownChart();
    this.buildSectorsBreakdownChart();
    this.buildIndustriesBreakdownChart();
  },
  methods: {
    buildCompaniesBreakdownChart: function () {
      let chartData = {
        datasets: [{
          data: [],
          backgroundColor: [],
        }],
        labels: []
      };
      let ctx = document.getElementById('companiesBreakdownChart').getContext('2d');

      let groupedCompanies = this.groupBy(this.tickers, 'sector')
      this.sectorsBreakdown.forEach(sector => {
        let sectorName = sector.ticker__sector;
        groupedCompanies[sectorName].forEach(ticker => {
          let companyPercentage = Number((ticker.cost / this.totalTickers * 100).toFixed(2));
          chartData.datasets[0].data.push(companyPercentage);
          chartData.datasets[0].backgroundColor.push(this.colorHash.hex(ticker.symbol));
          chartData.labels.push(ticker.company_name);
        })
      })

      new Chart(ctx, this.getChartConfig('Companies Breakdown', chartData))
    },
    buildIndustriesBreakdownChart: function () {
      let chartData = {
        datasets: [{
          data: [],
          backgroundColor: [],
        }],
        labels: []
      };
      let ctx = document.getElementById('industriesBreakdownChart').getContext('2d');

      let groupedIndustries = this.groupBy(this.industriesBreakdown, 'ticker__sector')
      this.sectorsBreakdown.forEach(sector => {
        let sectorName = sector.ticker__sector;
        groupedIndustries[sectorName].forEach(industry => {
          let industryPercentage = Number((industry.sum_cost / this.totalTickers * 100).toFixed(2));
          chartData.datasets[0].data.push(industryPercentage);
          chartData.datasets[0].backgroundColor.push(this.colorHash.hex(industry.ticker__industry));
          chartData.labels.push(industry.ticker__industry)
        })
      })
      new Chart(ctx, this.getChartConfig('Industries Breakdown', chartData))

    },
    buildSectorsBreakdownChart: function () {
      let chartData = {
        datasets: [{
          data: [],
          backgroundColor: [],
        }],
        labels: []
      };
      this.sectorsBreakdown.forEach(sector => {
        let sectorPercentage = Number((sector.sum_cost / this.totalTickers * 100).toFixed(2));
        chartData.datasets[0].data.push(sectorPercentage);
        chartData.datasets[0].backgroundColor.push(this.colorHash.hex(sector.ticker__sector));
        chartData.labels.push(sector.ticker__sector)

      })


      let ctx = document.getElementById('sectorsBreakdownChart').getContext('2d');
      new Chart(ctx, this.getChartConfig('Sectors Breakdown', chartData))

    },
    getChartConfig: function (title, chartData) {
      let newChartConfig = JSON.parse(JSON.stringify(this.defaultChartConfig));
      newChartConfig.data = chartData;
      newChartConfig.options.title.text = title;
      return newChartConfig;
    },
    groupBy: function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
  }
}
</script>
