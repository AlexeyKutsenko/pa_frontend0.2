<template>
  <b-card
    :title="ticker.company_name"
  >
    <b-container fluid>
      <b-row>
        <b-col cols="4">
          <b-card-text>
            {{ ticker.country }} / {{ ticker.sector }} / {{ ticker.industry }} / {{ ticker.symbol }}
          </b-card-text>
        </b-col>
        <b-col cols="8">
          {{ ticker.ticker_statements }}
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>
<script>
import Chart from 'chart.js';

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
  methods: {
    buildTotalDebt: function () {
      let chartData = {
        labels: [],
        datasets: []
      };

      let values = [];
      this.ticker.ticker_statements.total_debt.forEach(statement => {
        chartData.labels.push(new Date(statement.fiscal_date_ending));
        values.push(statement.value)
      })

      chartData.datasets.push({
        data: values
      })
      new Chart(document.getElementById(this.ticker.symbol + '-total-debt'), {
        type: 'line',
        data: chartData
      })
    }
  }
}
</script>
