<template>
  <div v-if="portfolioPolicy">
    <b-container>
      <b-form
        class="mt-3 mb-3 p-1 text-center border-bottom"
        @submit.prevent="updatePortfolioPolicy"
      >
        <b-form-group
          label="Assets to Equity Max Ratio"
          label-for="asset-to-equity-max-ratio"
        >
          <b-form-input
            id="asset-to-equity-max-ratio"
            v-model="assetToEquityMaxRatio"
            required
          />
        </b-form-group>
        <b-form-group
          label="Assets to Equity Min Ratio"
          label-for="asset-to-equity-min-ratio"
        >
          <b-form-input
            id="asset-to-equity-min-ratio"
            v-model="assetToEquityMinRatio"
            required
          />
        </b-form-group>
        <b-form-group
          label="Debt To Equity Max Ratio"
          label-for="debt-to-equity-max-ratio"
        >
          <b-form-input
            id="debt-to-equity-max-ratio"
            v-model="debtToEquityMaxRatio"
            required
          />
        </b-form-group>
        <b-form-group
          label="Max Dividend Payout Ratio"
          label-for="max-dividend-payout-ratio"
        >
          <b-form-input
            id="max-dividend-payout-ratio"
            v-model="maxDividendPayoutRatio"
            required
          />
        </b-form-group>
        <b-form-group
          label="Minimum Annual Earnings Growth"
          label-for="minimum-annual-earnings-growth"
        >
          <b-form-input
            id="minimum-annual-earnings-growth"
            v-model="minimumAnnualEarningsGrowth"
            required
          />
        </b-form-group>
        <b-form-group
          label="PE Quantile"
          label-for="pe-quantile"
        >
          <b-form-input
            id="pe-quantile"
            v-model="peQuantile"
            required
          />
        </b-form-group>
        <b-button
          type="submit"
          variant="primary"
        >
          Submit
        </b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "PortfolioPolicyView",
  props: {
    portfolioId: {
      type: Number,
      default: () => null
    },
    portfolioPolicy: {
      type: Object,
      default: () => {

      }
    }
  },
  data: function () {
    return {
      portfolioPolicyUrl: undefined,
      assetToEquityMaxRatio: undefined,
      assetToEquityMinRatio: undefined,
      debtToEquityMaxRatio: undefined,
      maxDividendPayoutRatio: undefined,
      minimumAnnualEarningsGrowth: undefined,
      peQuantile: undefined,
    }
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi
    },
  },
  created: function () {
    this.portfolioPolicyUrl = `/portfolio-policies/`
  },
  beforeUpdate: function () {
    if (this.portfolioPolicy === null) {
      this.finApi
        .post(this.portfolioPolicyUrl, {'portfolio': this.portfolioId})
        .then((response) => {
          this.assetToEquityMaxRatio = response.data.asset_to_equity_max_ratio;
          this.assetToEquityMinRatio = response.data.asset_to_equity_min_ratio;
          this.debtToEquityMaxRatio = response.data.debt_to_equity_max_ratio;
          this.maxDividendPayoutRatio = response.data.max_dividend_payout_ratio;
          this.minimumAnnualEarningsGrowth = response.data.minimum_annual_earnings_growth;
          this.peQuantile = response.data.pe_quantile;
        })
    } else if (this.portfolioPolicy) {
      this.assetToEquityMaxRatio = this.portfolioPolicy.asset_to_equity_max_ratio;
      this.assetToEquityMinRatio = this.portfolioPolicy.asset_to_equity_min_ratio;
      this.debtToEquityMaxRatio = this.portfolioPolicy.debt_to_equity_max_ratio;
      this.maxDividendPayoutRatio = this.portfolioPolicy.max_dividend_payout_ratio;
      this.minimumAnnualEarningsGrowth = this.portfolioPolicy.minimum_annual_earnings_growth;
      this.peQuantile = this.portfolioPolicy.pe_quantile;
    }
  },
  methods: {
    updatePortfolioPolicy: function () {
      let updatingUrl = this.portfolioPolicyUrl + this.portfolioPolicy.id + '/';
      this.finApi
        .put(updatingUrl, {
          "asset_to_equity_max_ratio": this.assetToEquityMaxRatio,
          "asset_to_equity_min_ratio": this.assetToEquityMinRatio,
          "debt_to_equity_max_ratio": this.debtToEquityMaxRatio,
          "max_dividend_payout_ratio": this.maxDividendPayoutRatio,
          "minimum_annual_earnings_growth": this.minimumAnnualEarningsGrowth,
          "pe_quantile": this.peQuantile,
          "portfolio": this.portfolioId
        })
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Portfolio Policy has been updated`, {
                title: 'Success',
                variant: 'success',
                solid: false
              }
            );
          }
        })
        .catch((error) => {
          this.$bvToast.toast(`${error}`, {
              title: 'Error',
              variant: 'danger',
              solid: true
            }
          );
        })
    }
  }
}
</script>

<style scoped>

</style>
