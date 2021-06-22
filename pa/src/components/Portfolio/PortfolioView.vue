<template>
  <b-container fluid>
    <!-- Portfolio Name -->
    <b-row>
      <b-col>
        <h1
          class="text-center"
        >
          {{ portfolio.displayName }}
          <b-button
            id="importPortfolioButton"
            v-b-modal.importPortfolioModal
            variant="light"
          >
            <b-icon
              icon="arrow-repeat"
            />
          </b-button>
          <b-tooltip
            target="importPortfolioButton"
          >
            Import portfolio from Exante
          </b-tooltip>
          <b-modal
            id="importPortfolioModal"
            @ok="importPortfolio"
          >
            <FormComponent
              v-if="importPortfolioUrl"
              ref="importPortfolioForm"
              :embedded="true"
              :method="'PUT'"
              :request-url="importPortfolioUrl"
            />
          </b-modal>
        </h1>
      </b-col>
    </b-row>
    <!-- Portfolio Status -->
    <PortfolioStatus
      v-if="portfolio.status"
      :portfolio-url="portfolioUrl"
      :status="portfolio.status"
      :tickers-last-updated="portfolio.tickersLastUpdated"
      :tickers-time-delta="portfolio.tickersTimeDelta"
    />
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
import FormComponent from "../utils/FormComponent";
import {prepare_request_data} from "@/utils/helpers";
import {errorMsg, successUpdateMsg} from "../utils/msgHelpers";
import PortfolioStatus from "./common/PortfolioStatus";


export default {
  name: "PortfolioView",
  components: {
    ExanteSettings,
    PortfolioAdjusting,
    PortfolioBreakdowns,
    PortfolioPolicyView,
    PortfolioStatus,
    FormComponent
  },
  data: function () {
    return {
      importPortfolioUrl: undefined,
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
        adjusted_tickers: undefined,
        displayName: undefined,
        status: undefined,
        name: undefined,
        tickers: undefined,
        tickersLastUpdated: undefined,
        tickersTimeDelta: undefined,
      },
      portfolioPolicy: undefined,
      portfolioViewFields: [
        {key: "symbol", label: "Symbol"},
        {key: "company_name", label: "Name"},
        {key: "country", label: "Country", sortable: true},
        {key: "sector", label: "Sector", sortable: true},
        {key: "industry", label: "Industry", sortable: true},
      ],
      portfolioUrl: undefined,
      sectorsBreakdown: undefined,
      selectedTicker: undefined,
      totalTickers: undefined,
    };
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi;
    },
  },
  created() {
    this.portfolioUrl = `/portfolios/${this.$route.params.id}`;
    this.importPortfolioUrl = `${this.portfolioUrl}/import_from_exante/`

    this.errorMsg = errorMsg
    this.successUpdateMsg = successUpdateMsg
  },
  mounted: function () {
    this.reloadPortfolio()
  },
  methods: {
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
    importPortfolio: function () {
      let form = this.$refs.importPortfolioForm.form;
      form.validate()

      if (form.valid) {
        let {creationData, paramsQuery} = prepare_request_data(form)

        this.finApi
          .put(this.importPortfolioUrl, creationData, {params: paramsQuery})
          .then(response => {
            if (response.status === 200) {
              this.successUpdateMsg(this.entityName)
            } else {
              throw 'Response status is not supported'
            }
          })
          .catch(errorResponse => {
            this.errorMsg(errorResponse, form)
          })
      }
    },
    reloadPortfolio: function () {
      this.finApi
        .get(this.portfolioUrl)
        .then((response) => {
          this.portfolio.accounts = response.data.accounts;
          this.portfolio.exantesettings = response.data.exantesettings;
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

          this.portfolio.displayName = this.portfolio.name ? this.portfolio.name : `Portfolio #${this.portfolio.id}`
        });
    },
    onRowSelected: function (ticker) {
      this.selectedTicker = ticker[0];
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
