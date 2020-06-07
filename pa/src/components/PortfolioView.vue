<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1 class="text-center" v-if="portfolio.name">{{portfolio.name}}</h1>
                <h1 class="text-center" v-else>Portfolio #{{portfolio.id}}</h1>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="4">
                <canvas id="sectorsBreakdownChart"></canvas>
            </b-col>
            <b-col cols="4">
                <canvas id="industriesBreakdownChart"></canvas>
            </b-col>
            <b-col cols="4">
                <canvas id="companiesBreakdownChart"></canvas>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <b-table striped hover :items="portfolio.tickers"></b-table>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
    import Chart from 'chart.js';
    import ColorHash from 'color-hash';

    export default {
        name: "PortfolioView",
        computed: {
            fin_api: function () {
                return this.$store.getters.fin_api
            },
        },
        data: function () {
            return {
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
                source_url: `/portfolios/${this.$route.params.id}`,
                portfolio: {
                    accounts: undefined,
                    tickers: undefined,
                    name: undefined,
                }
            }
        },
        methods: {
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

                let groupedCompanies = this.groupBy(this.portfolio.tickers, 'sector') // eslint-disable-line no-unused-vars
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
        },
        mounted: function () {

            this.fin_api
                .get(this.source_url)
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
        }
    }
</script>

<style scoped>

</style>