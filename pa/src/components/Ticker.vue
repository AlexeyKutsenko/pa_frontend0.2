<template>
  <b-card
    :title="ticker.company_name"
  >
    <b-container fluid>
      <b-row>
        <b-col cols="4">
          <b-card-text>
            {{ ticker.country }} / {{ ticker.sector }} / {{ ticker.industry }} / {{ ticker.symbol }}<br>
          </b-card-text>
          <div
            v-if="ticker.updated"
          >
            Last Updated: {{ ticker.updated }}
          </div>
          <div
            v-else
          >
            Last Updated: Unknown
          </div>
        </b-col>
        <b-col cols="8">
          <b-container fluid>
            <b-row class="text-center">
              <b-col
                id="debt"
                cols="4"
              >
                <div
                  v-if="ticker.debt"
                >
                  <div>
                    <b>Debt to Equity:</b><br>{{ ticker.debt.debt_to_equity }}%<br>
                    <b>Assets to Equity:</b><br>{{ ticker.debt.assets_to_equity }}<br>
                  </div>
                </div>
                <div
                  v-else
                >
                  <b>Debt</b><br>
                  Unknown<br>
                  <b-icon
                    icon="question-circle"
                    scale="3"
                    class="m-3"
                  />
                </div>
              </b-col>
              <b-col
                id="earnings"
                cols="4"
              >
                <div
                  v-if="ticker.annual_earnings_growth"
                >
                  <b>Annual Earnings Growth:</b><br>
                  {{ ticker.annual_earnings_growth }}%
                </div>
                <div
                  v-else
                >
                  <b>Annual Earnings Growth:</b><br>
                  Unknown<br>
                  <b-icon
                    icon="question-circle"
                    scale="3"
                    class="m-3"
                  />
                </div>
              </b-col>
              <b-col
                id="returns"
                cols="4"
              >
                <div
                  v-if="ticker.returns_ratios"
                >
                  <div>
                    <b>Return on Assets:</b><br>
                    {{ ticker.returns_ratios.roa }}%
                  </div>
                  <div>
                    <b>Return on Equity:</b><br>
                    {{ ticker.returns_ratios.roe }}%
                  </div>
                </div>
                <div
                  v-else
                >
                  Unknown<br>
                  <b-icon
                    icon="question-circle"
                    scale="3"
                    class="m-3"
                  />
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>
<script>

export default {
  name: 'Ticker',
  props: {
    ticker: {
      type: Object,
      default: () => {
      }
    }
  },
  mounted() {
  },
  methods: {}
}
</script>
