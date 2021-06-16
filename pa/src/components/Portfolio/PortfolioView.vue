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
            <div v-if="(portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) > 1">
              {{ Math.floor(portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) }} weeks ago
            </div>
            <!-- More than a day -->
            <div v-else-if=" (portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24)) % 7 > 1 ">
              {{ Math.floor((portfolio.tickersTimeDelta / (1000 * 60 * 60 * 24)) % 7) }} days ago
            </div>
            <!-- More than an hour -->
            <div v-else-if="(portfolio.tickersTimeDelta / (1000 * 60 * 60)) % 24 > 1 ">
              {{ Math.floor((portfolio.tickersTimeDelta / (1000 * 60 * 60)) % 24) }} hours ago
            </div>
            <!-- More than a minute -->
            <div v-else-if="(portfolio.tickersTimeDelta / (1000 * 60)) % 60 > 1">
              {{ Math.floor((portfolio.tickersTimeDelta / (1000 * 60)) % 60) }} minutes ago
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
              <b-container
                class="pl-0"
                fluid
              >
                <b-row class="text-center">
                  <b-col
                    cols="8"
                  >
                    <b-table
                      bordered
                      selectable
                      :fields="portfolioViewFields"
                      :items="portfolio.tickers"
                      :select-mode="'single'"
                      @row-selected="onRowSelected"
                    />
                  </b-col>
                  <b-col
                    class="border"
                    cols="4"
                  >
                    <h3>Indicators</h3>
                    <div v-if="selectedTicker">
                      <b-table-simple id="indicators">
                        <b-tbody>
                          <b-tr
                            v-for="field in indicatorsViewFields"
                            :key="field.key"
                          >
                            <b-td>
                              {{ field.label }}
                            </b-td>
                            <b-td>
                              {{ getAttr(selectedTicker, field.key) }}
                            </b-td>
                          </b-tr>
                        </b-tbody>
                      </b-table-simple>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
            </b-list-group>
          </b-tab>
          <b-tab
            title="Adjusting"
          >
            <PortfolioAdjusting
              :portfolio="portfolio"
              :updating-statuses="updatingStatuses"
            />
          </b-tab>
          <b-tab
            title="Breakdowns"
          >
            <PortfolioBreakdowns
              v-if="portfolio.tickers"
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
              v-if="portfolioPolicy"
              :portfolio-id="portfolio.id"
              :portfolio-policy="portfolioPolicy"
            />
          </b-tab>
          <b-tab
            title="Exante Settings"
          >
            <ExanteSettings
              v-if="portfolio.exantesettings || portfolio.id"
              :exante-settings="portfolio.exantesettings"
              :portfolio-id="portfolio.id"
            />
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ExanteSettings from "./ExanteSettings/ExanteSettings";
import PortfolioAdjusting from "./PortfolioAdjusting";
import PortfolioBreakdowns from "./PortfolioBreakdowns";
import PortfolioPolicyView from "./PortfolioPolicyView";

export default {
  name: "PortfolioView",
  components: {
    ExanteSettings,
    PortfolioAdjusting,
    PortfolioBreakdowns,
    PortfolioPolicyView,
  },
  data: function () {
    return {
      indicatorsViewFields: [
        {
          key: "amount",
          label: "Amount",
        },
        {
          key: "price",
          label: "Price",
        },
        {
          key: "cost",
          label: "Cost",
        },
        {
          key: "pe",
          label: "PE",
        },
        {
          key: "annual_earnings_growth",
          label: "Annual Earnings Growth",
        },
        {
          key: "returns_ratios.roa",
          label: "ROA",
        },
        {
          key: "returns_ratios.roe",
          label: "ROE",
        },
        {
          key: "debt.assets_to_equity",
          label: "Assets to Equity",
        },
        {
          key: "debt.debt_to_equity",
          label: "Debt to Equity",
        },
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
      portfolioViewFields: [
        {key: "symbol", label: "Symbol"},
        {key: "company_name", label: "Name"},
        {key: "country", label: "Country", sortable: true},
        {key: "sector", label: "Sector", sortable: true},
        {key: "industry", label: "Industry", sortable: true},
      ],
      sectorsBreakdown: undefined,
      selectedTicker: undefined,
      totalTickers: undefined,
      updatingStatuses: undefined,
    };
  },
  computed: {
    isPortfolioUpdatable: function () {
      let updatedMoreThanHourAgo = this.portfolio.tickersTimeDelta / (1000 * 60 * 60) > 1;
      return (this.portfolio.status !== this.updatingStatuses.updating && updatedMoreThanHourAgo);
    },
    finApi: function () {
      return this.$store.getters.finApi;
    },
  },
  created() {
    this.updatingStatuses = {
      successfully_updated: "Successfully Updated",
      updating: "Updating",
      update_failed: "Update Failed",
    };
    this.portfolioUrl = `/portfolios/${this.$route.params.id}`;
  },
  mounted: function () {
    this.finApi
      .get(this.portfolioUrl)
      .then((response) => {
        this.portfolio.accounts = response.data.accounts;
        this.portfolio.exantesettings = response.data.exantesettings;
        this.portfolio.id = response.data.id;
        this.portfolio.name = response.data.name;
        this.portfolio.status = response.data.status;
        this.portfolio.tickers = response.data.tickers;
        this.portfolio.tickersLastUpdated = new Date(
          response.data.tickers_last_updated
        );
        this.portfolio.tickersTimeDelta =
          new Date() - this.portfolio.tickersLastUpdated;
        this.portfolioPolicy = response.data.portfolio_policy;
        this.industriesBreakdown = response.data.industries_breakdown;
        this.sectorsBreakdown = response.data.sectors_breakdown;
        this.totalTickers = response.data.total_tickers;
      });
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
      });
    },
    onRowSelected: function (ticker) {
      this.selectedTicker = ticker[0];
    },
    getAttr: function (o, s) {
      s = s.replace(/^\./, ""); // strip a leading dot
      let a = s.split(".");
      for (let i = 0, n = a.length; i < n; ++i) {
        let k = a[i];
        if (o === null) {
          return null;
        }
        if (k in o) {
          o = o[k];
        } else {
          return;
        }
      }
      return o;
    },
  },
};
</script>

<style scoped>
table#indicators > tbody > tr > td:first-child {
  text-align: left;
}

table#indicators > tbody > tr > td:last-child {
  text-align: right;
}
</style>
