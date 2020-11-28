<template>
  <b-container fluid>
    <!-- Portfolio Name -->
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
    <!-- Portfolio Status -->
    <b-row
      class="align-items-center text-center m-1"
    >
      <b-col>
        <div>
          Status:
        </div>
        <b-badge
          v-if="portfolio.status === updatingStatuses.successfully_updated"
          class="d-inline"
          variant="success"
        >
          {{ portfolio.status }}
        </b-badge>
        <b-badge
          v-else-if="portfolio.status === updatingStatuses.updating"
          class="d-inline"
          variant="warning"
        >
          {{ portfolio.status }}
        </b-badge>
        <b-badge
          v-else
          class="d-inline"
          variant="danger"
        >
          {{ portfolio.status }}
        </b-badge>
      </b-col>
      <b-col>
        Last Updated:
        <div
          v-if="portfolio.tickersLastUpdated"
        >
          <div
            id="portfolio-tickers-last-updated-date"
          >
            <!-- More than a week -->
            <div v-if="(portfolio.tickersTimeDelta / (1000*60*60*24*7)) > 1">
              {{ Math.floor(portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) }} weeks ago
            </div>
            <!-- More than a day -->
            <div v-else-if="((portfolio.tickersTimeDelta / (1000*60*60*24)) % 7) > 1">
              {{ Math.floor(((portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24)) % 7)) }} days ago
            </div>
            <!-- More than an hour -->
            <div v-else-if="((portfolio.tickersTimeDelta / (1000*60*60)) % 24) > 1">
              {{ Math.floor(((portfolio.tickersTimeDelta / (1000 * 60 * 60)) % 24)) }} hours ago
            </div>
            <!-- More than a minute -->
            <div v-else-if="((portfolio.tickersTimeDelta / (1000*60)) % 60) > 1">
              {{ Math.floor(((portfolio.tickersTimeDelta / (1000 * 60)) % 60)) }} minutes ago
            </div>
            <div v-else>
              Less than minute ago
            </div>
          </div>
          <b-tooltip
            target="portfolio-tickers-last-updated-date"
          >
            {{ portfolio.tickersLastUpdated }}
          </b-tooltip>
        </div>
      </b-col>
      <b-col>
        <span
          id="reloadPortfolioTickers"
        >
          <b-button
            variant="outline-secondary"
            :disabled="!isPortfolioUpdatable"
            @click="reloadPortfolioTickers()"
          >
            Reload Tickers Information
          </b-button>
        </span>
        <b-tooltip
          v-if="!isPortfolioUpdatable"
          target="reloadPortfolioTickers"
        >
          Updated less than an hour ago or currently is updating
        </b-tooltip>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-tabs>
          <!-- Tickers -->
          <b-tab title="Tickers">
            <b-list-group>
              <Ticker
                v-for="ticker in portfolio.tickers"
                :key="ticker.symbol"
                :ticker="ticker"
              />
            </b-list-group>
          </b-tab>
          <b-tab title="Portfolio Policy">
            <PortfolioPolicyView
              :portfolio-id="portfolio.id"
              :portfolio-policy="portfolioPolicy"
            />
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
    <!-- Adjust Form -->
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
            label-for="selected-index"
          >
            <b-form-select
              id="selected-index"
              v-model="selectedIndex"
              :options="selectableIndices"
              required
            />
          </b-form-group>
          <div
            v-if="selectedIndex"
            class="align-items-center text-center m-1"
          >
            <b-container fluid>
              <b-row>
                <b-col>
                  <div>
                    Index Status:
                  </div>
                  <b-badge
                    v-if="indices[selectedIndex].status === updatingStatuses.successfully_updated"
                    class="d-inline"
                    variant="success"
                  >
                    {{ indices[selectedIndex].status }}
                  </b-badge>
                  <b-badge
                    v-else-if="indices[selectedIndex].status === updatingStatuses.updating"
                    class="d-inline"
                    variant="warning"
                  >
                    {{ indices[selectedIndex].status }}
                  </b-badge>
                  <b-badge
                    v-else
                    class="d-inline"
                    variant="danger"
                  >
                    {{ indices[selectedIndex].status }}
                  </b-badge>
                </b-col>
                <b-col>
                  Last Updated
                  <div
                    id="index-tickers-last-updated-date"
                  >
                    <!-- More than a week -->
                    <div v-if="(indices[selectedIndex].tickersTimeDelta / (1000*60*60*24*7)) > 1">
                      {{ Math.floor(indices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) }} weeks ago
                    </div>
                    <!-- More than a day -->
                    <div v-else-if="((indices[selectedIndex].tickersTimeDelta / (1000*60*60*24)) % 7) > 1">
                      {{ Math.floor(((indices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60 * 24)) % 7)) }} days ago
                    </div>
                    <!-- More than an hour -->
                    <div v-else-if="((indices[selectedIndex].tickersTimeDelta / (1000*60*60)) % 24) > 1">
                      {{ Math.floor(((indices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60)) % 24)) }} hours ago
                    </div>
                    <!-- More than a minute -->
                    <div v-else-if="((indices[selectedIndex].tickersTimeDelta / (1000*60)) % 60) > 1">
                      {{ Math.floor(((indices[selectedIndex].tickersTimeDelta / (1000 * 60)) % 60)) }} minutes ago
                    </div>
                    <div v-else>
                      Less than minute ago
                    </div>
                  </div>
                  <b-tooltip
                    target="index-tickers-last-updated-date"
                  >
                    {{ indices[selectedIndex].tickersLastUpdated }}
                  </b-tooltip>
                </b-col>
                <b-col>
                  <span
                    id="reloadIndexTickers"
                  >
                    <b-button
                      variant="outline-secondary"
                      :disabled="!isIndexUpdatable"
                      @click="reloadIndexTickers()"
                    >
                      Reload Tickers Information
                    </b-button>
                  </span>
                  <b-tooltip
                    v-if="!isIndexUpdatable"
                    target="reloadIndexTickers"
                  >
                    Updated less than an hour ago or currently is updating
                  </b-tooltip>
                </b-col>
              </b-row>
            </b-container>
          </div>
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
          <template v-slot:cell(debt)="data">
            <div v-if="data.item.debt">
              Debt to Equity: {{ data.item.debt.debt_to_equity }}%<br>
              Assets to Equity: {{ data.item.debt.assets_to_equity }}
            </div>
          </template>
          <template v-slot:cell(annual_earnings_growth)="data">
            <div v-if="data.item.annual_earnings_growth">
              {{ data.item.annual_earnings_growth }}%
            </div>
          </template>
          <template v-slot:cell(returns_ratios)="data">
            <div v-if="data.item.returns_ratios">
              ROA: {{ data.item.returns_ratios.roa }}%<br>
              ROE: {{ data.item.returns_ratios.roe }}%
            </div>
          </template>
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
import PortfolioPolicyView from "@/components/Portfolio/PortfolioPolicyView";

export default {
  name: "PortfolioView",
  components: {Ticker, PortfolioPolicyView},
  data: function () {
    return {
      actionDisplayedFields: undefined,
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
        {key: 'debt', sortable: false},
        {key: 'annual_earnings_growth', sortable: false},
        {key: 'returns_ratios', sortable: false},
        {key: 'pe', label: 'PE', sortable: false},
        {key: 'amount', sortable: false},
        {key: 'price', sortable: true},
        {key: 'cost', sortable: true},
      ],
      indices: {},
      indexUrl: '/indices',
      money: undefined,
      portfolio: {
        accounts: undefined,
        tickers: undefined,
        status: undefined,
        tickersLastUpdated: undefined,
        tickersTimeDelta: undefined,
        name: undefined,
        adjusted_tickers: undefined,
      },
      portfolioPolicy: undefined,
      selectableIndices: [],
      selectedIndex: undefined,
      skipped_tickers: [],
      updatingStatuses: undefined
    }
  },
  computed: {
    isIndexUpdatable: function () {
      if (this.selectedIndex && this.indices[this.selectedIndex]) {
        let index = this.indices[this.selectedIndex];
        let updatedMoreThatHourAgo = index.tickersTimeDelta / (1000 * 60 * 60) > 1;
        return index.status !== this.updatingStatuses.update && updatedMoreThatHourAgo;
      }
      return false
    },
    isPortfolioUpdatable: function () {
      let updatedMoreThanHourAgo = this.portfolio.tickersTimeDelta / (1000 * 60 * 60) > 1;
      return this.portfolio.status !== this.updatingStatuses.updating && updatedMoreThanHourAgo;
    },
    finApi: function () {
      return this.$store.getters.finApi
    },
  },
  created() {
    this.updatingStatuses = {
      successfully_updated: "Successfully Updated",
      updating: "Updating",
      update_failed: "Update Failed"
    }
    this.portfolioUrl = `/portfolios/${this.$route.params.id}`;
    this.adjustPortfolioUrl = `${this.portfolioUrl}/adjust/indices/`
    this.actionDisplayedFields = this.displayedFields.concat([{key: 'action', sortable: false}])
  },
  mounted: function () {
    this.finApi
      .get(this.portfolioUrl)
      .then((response) => {
        this.portfolio.accounts = response.data.accounts;
        this.portfolio.id = response.data.id;
        this.portfolio.name = response.data.name;
        this.portfolio.status = response.data.status;
        this.portfolio.tickers = response.data.tickers;
        this.portfolio.tickersLastUpdated = new Date(response.data.tickers_last_updated);
        this.portfolio.tickersTimeDelta = new Date() - this.portfolio.tickersLastUpdated;
        this.portfolioPolicy = response.data.portfolio_policy;
        this.industriesBreakdown = response.data.industries_breakdown;
        this.sectorsBreakdown = response.data.sectors_breakdown;
        this.totalTickers = response.data.total_tickers;

        this.buildCompaniesBreakdownChart();
        this.buildSectorsBreakdownChart();
        this.buildIndustriesBreakdownChart();
      })

    this.finApi
      .get(this.indexUrl)
      .then((response) => {
        response.data.results.forEach(index => {
          this.indices[index.id] = {
            status: index.status,
            tickersLastUpdated: new Date(index.tickers_last_updated),
            tickersTimeDelta: new Date() - new Date(index.tickers_last_updated)
          };
          this.selectableIndices.push({value: index.id, text: index.name})
        })
      })
  },
  methods: {
    adjustPortfolio: function () {
      this.finApi.get(this.adjustPortfolioUrl + this.selectedIndex, {
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
    reloadIndexTickers: function () {
      let reloadUrl = `${this.indexUrl}/${this.selectedIndex}/tickers/`
      this.finApi.put(reloadUrl).then((response) => {
        let responseStatuses = [200, 202];
        if (responseStatuses.includes(response.status)) {
          this.indices[this.selectedIndex].status = this.updatingStatuses.updating;
          this.indices[this.selectedIndex].tickersLastUpdated = new Date();
          this.indices[this.selectedIndex].tickersTimeDelta = 0;
          this.computeIsIndexUpdatableProperty()
        }
      }).catch((response) => {
        if (response.status === 406) {
          this.indices[this.selectedIndex].status = this.updatingStatuses.updating;
          this.indices[this.selectedIndex].tickersLastUpdated = new Date();
          this.indices[this.selectedIndex].tickersTimeDelta = 0;
          this.computeIsIndexUpdatableProperty()
        }
      })
    },
    reloadPortfolioTickers: function () {
      let reloadUrl = `${this.portfolioUrl}/tickers/`;
      this.finApi.put(reloadUrl).then((response) => {
        let responseStatuses = [200, 202];
        if (responseStatuses.includes(response.status)) {
          this.portfolio.status = this.updatingStatuses.updating;
          this.portfolio.tickersLastUpdated = new Date();
          this.portfolio.tickersTimeDelta = 0;
        }
      }).catch((response) => {
        if (response.status === 406) {
          this.portfolio.status = this.updatingStatuses.updating;
          this.portfolio.tickersLastUpdated = new Date();
          this.portfolio.tickersTimeDelta = 0;
        }
      })
    },
    skipTicker: function (ticker_name) {
      this.skipped_tickers.push(ticker_name)
      this.adjustPortfolio()
    },
    computeIsIndexUpdatableProperty: function () {
      // Is Index Updatable property doesn't compute automatically need to change this.selectedIndex
      this.selectedIndex += 1;
      this.selectedIndex -= 1;
    }
  }
}
</script>

<style scoped>
#portfolio-tickers-last-updated-date, #index-tickers-last-updated-date {
  color: #0e2d49;
  text-decoration: underline dashed;
}
</style>
