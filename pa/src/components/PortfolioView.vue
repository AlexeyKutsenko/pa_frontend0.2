<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h1
          v-if="portfolio.name"
          class="text-center"
        >
          {{ portfolio.name }}
        </h1>
        <h1
          v-else
          class="text-center"
        >
          Portfolio #{{ portfolio.id }}
        </h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-list-group>
          <Ticker
            v-for="ticker in portfolio.tickers"
            :key="ticker.symbol"
            :ticker="ticker"
          />
        </b-list-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <h3>Make the portfolio look more like</h3>
        <b-form
          class="mb-2"
          @submit.prevent="adjustPortfolio"
        >
          <b-form-group
            label="Index"
            label-cols="3"
            label-for="selected_index"
          >
            <b-form-select
              id="selected_index"
              v-model="selected_index"
              :options="selectable_indices"
              required
            />
          </b-form-group>
          <b-form-group
            label="Money"
            label-cols="3"
            label-for="money"
          >
            <b-input
              id="money"
              v-model="money"
              required
            />
          </b-form-group>
          <b-button type="submit">
            Adjust
          </b-button>
        </b-form>
        <b-table
          ref="tickers-table"
          class="text-center"
          :fields="actionDisplayedFields"
          :items="portfolio.adjusted_tickers"
          hover
          striped
          small
        >
          <template v-slot:cell(action)="data">
            <b-button-group v-if="data.item.company_name !== 'Summary'">
              <b-button @click="approveTicker(data.item)">
                <b-icon-check />
              </b-button>
              <b-button @click="skipTicker(data.item.symbol)">
                <b-icon-x />
              </b-button>
            </b-button-group>
          </template>
        </b-table>
      </b-col>
    </b-row>
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
</template>

<script>
import Chart from 'chart.js';
import ColorHash from 'color-hash';
import Ticker from "@/components/Ticker";

export default {
  name: "PortfolioView",
  components: {Ticker},
  data: function () {
    return {
      approved_tickers: new Set(),
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
      displayedFields: [
        {key: 'company_name', sortable: false},
        {key: 'symbol', sortable: false},
        {key: 'country', sortable: false},
        {key: 'sector', sortable: false},
        {key: 'industry', sortable: false},
        {key: 'amount', sortable: false},
        {key: 'price', sortable: true},
        {key: 'cost', sortable: true},
      ],
      actionDisplayedFields: undefined,
      index_url: '/indices',
      money: undefined,
      portfolio: {
        accounts: undefined,
        tickers: undefined,
        name: undefined,
        adjusted_tickers: undefined,
      },
      selected_index: undefined,
      selectable_indices: [],
      skipped_tickers: [],
    }
  },
  computed: {
    fin_api: function () {
      return this.$store.getters.fin_api
    },
  },
  created() {
    this.portfolio_url = `/portfolios/${this.$route.params.id}`;
    this.adjust_portfolio_url = `${this.portfolio_url}/adjust/indices/`
    this.actionDisplayedFields = this.displayedFields.concat([{key: 'action', sortable: false}])
  },
  mounted: function () {
    this.fin_api
      .get(this.portfolio_url)
      .then((response) => {
        this.portfolio.accounts = response.data.accounts;
        this.portfolio.id = response.data.id;
        this.portfolio.tickers = response.data.tickers;
        this.portfolio.name = response.data.name;
        this.industriesBreakdown = response.data.industries_breakdown;
        this.sectorsBreakdown = response.data.sectors_breakdown;
        this.totalTickers = response.data.total_tickers;

        this.buildCompaniesBreakdownChart();
        this.buildSectorsBreakdownChart();
        this.buildIndustriesBreakdownChart();
      })

    this.fin_api
      .get(this.index_url)
      .then((response) => {
        response.data.results.forEach(index => {
          this.selectable_indices.push({value: index.id, text: index.name})
        })
      })
  },
  methods: {
    adjustPortfolio: function () {
      this.fin_api.get(this.adjust_portfolio_url + this.selected_index, {
        params: {
          'money': this.money,
          'skip-ticker': this.skipped_tickers
        }
      }).then((response) => {
        this.portfolio.adjusted_tickers = response.data.tickers
        this.portfolio.adjusted_tickers.push({
          'company_name': 'Summary',
          'cost': response.data.summary_cost
        })
      })
    },
    approveTicker: function (ticker) {
      this.approved_tickers.add(ticker.symbol);
      ticker._rowVariant = "success";
      this.$refs['tickers-table'].refresh();
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
    buildCompaniesBreakdownChart: function () {
      let chartData = {
        datasets: [{
          data: [],
          backgroundColor: [],
        }],
        labels: []
      };
      let ctx = document.getElementById('companiesBreakdownChart').getContext('2d');

      let groupedCompanies = this.groupBy(this.portfolio.tickers, 'sector')
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
    skipTicker: function (ticker_name) {
      this.skipped_tickers.push(ticker_name)
      this.adjustPortfolio()
    }
  }
}
</script>

