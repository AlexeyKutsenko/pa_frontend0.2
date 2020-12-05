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
    <b-row v-if="portfolio.tickers">
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
          <b-tab
            title="Adjusting"
          >
            <PortfolioAdjusting
              :displayed-fields="displayedFields"
              :portfolio="portfolio"
              :updating-statuses="updatingStatuses"
            />
          </b-tab>
          <b-tab
            title="Breakdowns"
          >
            <PortfolioBreakdowns
              :industries-breakdown="industriesBreakdown"
              :sectors-breakdown="sectorsBreakdown"
              :tickers="portfolio.tickers"
              :total-tickers="totalTickers"
            />
          </b-tab>
          <b-tab
            title="Portfolio Policy"
          >
            <PortfolioPolicyView
              :portfolio-id="portfolio.id"
              :portfolio-policy="portfolioPolicy"
            />
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import Ticker from "../Ticker";
import PortfolioAdjusting from "./PortfolioAdjusting";
import PortfolioBreakdowns from "./PortfolioBreakdowns";
import PortfolioPolicyView from "./PortfolioPolicyView";

export default {
  name: "PortfolioView",
  components: {PortfolioAdjusting, PortfolioBreakdowns, PortfolioPolicyView, Ticker},
  data: function () {
    return {
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
      industriesBreakdown: undefined,
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
      sectorsBreakdown: undefined,
      totalTickers: undefined,
      updatingStatuses: undefined
    }
  },
  computed: {
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
      })
  },
  methods: {
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
    }
  }
}
</script>

