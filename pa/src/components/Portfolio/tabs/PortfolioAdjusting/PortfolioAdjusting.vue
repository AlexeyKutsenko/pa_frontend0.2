<template>
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
          <IndexStatus
            :indices="indices"
            :selected-index="selectedIndex"
          />
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
        :items="adjustedTickers"
        :sort-by="sortBy"
        :sort-desc="true"
        hover
        striped
        small
      >
        <template #cell(company_name)="data">
          {{ data.item.company_name }}<br>
          <b-icon
            v-if="data.item.shares_dilution > 0.5"
            v-b-tooltip.hover
            :title="`Shareholders have been diluted in the past year, with total shares outstanding growing by
                     ${data.item.shares_dilution}%`"
            icon="exclamation-triangle"
            variant="warning"
          />
        </template>
        <template #cell(debt)="data">
          <div v-if="data.item.debt">
            Debt to Equity: {{ data.item.debt.debt_to_equity }}%<br>
            Assets to Equity: {{ data.item.debt.assets_to_equity }}
          </div>
        </template>
        <template #cell(annual_earnings_growth)="data">
          <div v-if="data.item.annual_earnings_growth">
            {{ data.item.annual_earnings_growth }}%
          </div>
        </template>
        <template #cell(returns_ratios)="data">
          <div v-if="data.item.returns_ratios">
            ROA: {{ data.item.returns_ratios.roa }}%<br>
            ROE: {{ data.item.returns_ratios.roe }}%
          </div>
        </template>
        <template #cell(action)="data">
          <b-button-group v-if="data.item.company_name !== 'Summary'">
            <b-button @click="approveTicker(data.item)">
              <b-icon-check />
            </b-button>
            <b-button @click="skipTicker(data.item.id)">
              <b-icon-x />
            </b-button>
          </b-button-group>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import {updatingStatuses} from "../../../utils/updatingStatuses";
import IndexStatus from "./IndexStatus";

export default {
  name: 'PortfolioAdjusting',
  components: {IndexStatus},
  props: {
    portfolio: {
      type: Object,
      default: () => {
      }
    },
  },
  data: function () {
    return {
      actionDisplayedFields: [
        {key: 'company_name', sortable: false},
        {key: 'stock_exchange.name', label: 'Stock Exchange', sortable: false},
        {key: 'symbol', sortable: false},
        {key: 'amount', sortable: false},
        {key: 'price', sortable: true},
        {key: 'weight', sortable: true},
        {key: 'cost', sortable: true},
        {key: 'action', sortable: false}
      ],
      adjustedTickers: [],
      approvedTickers: new Set(),
      indexUrl: '/indices',
      indices: [],
      money: undefined,
      selectableIndices: [],
      selectedIndex: undefined,
      skipped_tickers: [],
      sortBy: 'weight',
      updatingStatuses: undefined,
    }
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi
    },
  },
  created() {
    this.updatingStatuses = updatingStatuses;
    this.portfolioUrl = `/portfolios/${this.$route.params.id}`;
    this.adjustPortfolioUrl = `${this.portfolioUrl}/adjust/indices/`;
  },
  mounted() {
    this.finApi
      .get(this.indexUrl)
      .then((response) => {
        response.data.results.forEach(index => {
          this.indices.push ({
            status: index.status,
            tickersLastUpdated: new Date(index.tickers_last_updated),
            tickersTimeDelta: new Date() - new Date(index.tickers_last_updated)
          });
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
        this.adjustedTickers = []
        let summaryCost = Number(response.data.tickers.reduce((a, b) => a + b.cost, 0)).toFixed(2)

        response.data.tickers.forEach(ticker => {
          if (this.approvedTickers.has(ticker.id)) {
            ticker._rowVariant = 'success'
          }
          ticker.weight = (ticker.cost / summaryCost).toFixed(2)
          this.adjustedTickers.push(ticker)
        })

        this.adjustedTickers.push({
          'company_name': 'Summary',
          'cost': summaryCost
        })
      })
    },
    approveTicker: function (ticker) {
      if (this.approvedTickers.has(ticker.id)) {
        this.approvedTickers.delete(ticker.id)
        ticker._rowVariant = '';
      } else {
        this.approvedTickers.add(ticker.id);
        ticker._rowVariant = "success";
      }
      this.$refs['tickers-table'].refresh();
    },
    skipTicker: function (tickerId) {
      this.skipped_tickers.push(tickerId)
      this.adjustPortfolio()
    },
  }
}
</script>
