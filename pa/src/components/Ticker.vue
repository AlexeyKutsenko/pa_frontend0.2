<template>
  <b-card
    :title="ticker.company_name"
  >
    <b-container fluid>
      <b-row>
        <b-col cols="3">
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
        <b-col cols="9">
          <b-container>
            <b-row class="text-center align-items-center">
              <b-col
                cols="3"
              >
                <div
                  v-if="ticker.amount && ticker.price"
                >
                  <div>
                    <b class="text-secondary">Amount: </b>
                    <span class="text-warning">{{ ticker.amount }}</span>
                  </div>
                  <div>
                    <b class="text-secondary">Price: </b>
                    <span class="text-warning">{{ ticker.price }}</span>
                  </div>
                  <div>
                    <b class="text-secondary">Cost: </b>
                    <span class="text-warning">{{ ticker.cost }}</span>
                  </div>
                </div>
              </b-col>
              <b-col
                id="debt"
                cols="3"
              >
                <div
                  v-if="ticker.debt"
                >
                  <div>
                    <b class="text-secondary">Debt to Equity: </b>
                    <span class="text-warning">{{ ticker.debt.debt_to_equity }}%</span>
                  </div>
                  <div>
                    <b class="text-secondary">Assets to Equity: </b>
                    <span class="text-warning">{{ ticker.debt.assets_to_equity }}</span>
                  </div>
                </div>
                <div
                  v-else
                >
                  <b class="text-secondary">Debt</b>
                  <span class="text-warning">Unknown</span>>
                  <b-icon
                    icon="question-circle"
                    scale="3"
                    class="m-3"
                  />
                </div>
              </b-col>
              <b-col
                id="earnings"
                cols="3"
              >
                <div
                  v-if="ticker.annual_earnings_growth"
                >
                  <b class="text-secondary">Annual Earnings Growth: </b>
                  <span class="text-warning">{{ ticker.annual_earnings_growth }}%</span>
                </div>
                <div
                  v-else
                >
                  <b class="text-secondary">Annual Earnings Growth: </b>
                  <span class="text-warning">Unknown</span>>
                  <b-icon
                    icon="question-circle"
                    scale="3"
                    class="m-3"
                  />
                </div>
              </b-col>
              <b-col
                id="returns"
                cols="3"
              >
                <div
                  v-if="ticker.returns_ratios"
                >
                  <div>
                    <b class="text-secondary">Return on Assets: </b>
                    <span class="text-warning">{{ ticker.returns_ratios.roa }}%</span>
                  </div>
                  <div>
                    <b class="text-secondary">Return on Equity: </b>
                    <span class="text-warning">{{ ticker.returns_ratios.roe }}%</span>
                  </div>
                </div>
                <div
                  v-else
                >
                  <span class="text-warning">Unknown</span>
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
