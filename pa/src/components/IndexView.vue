<template>
    <div class="container-fluid">
        <div class="row p-2">
            <div class="col-2 shadow">
                <b-input-group>
                    <b-form-input type="number" v-model="money"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-secondary" v-on:click="adjustIndex()">
                            Calculate
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
                <b-form-group label="Countries">
                    <b-form-checkbox v-for="(country, idx) in countries"
                                     :key="idx"
                                     v-model="country.state"
                                     switch
                    >
                        {{country.text}}
                    </b-form-checkbox>
                </b-form-group>
                <b-form-group label="Sectors">
                    <b-form-checkbox v-for="(sector, idx) in sectors"
                                     :key="idx"
                                     v-model="sector.state"
                                     switch
                    >
                        {{sector.text}}
                    </b-form-checkbox>
                </b-form-group>
                <b-form-group label="Industries">
                    <b-form-checkbox v-for="(industry, idx) in industries"
                                     :key="idx"
                                     v-model="industry.state"
                                     switch
                    >
                        {{industry.text}}
                    </b-form-checkbox>
                </b-form-group>
            </div>
            <div class="col-10">
                <b-table class="text-center"
                         hover
                         ref="tickers-table"
                         striped
                         :items="tickers"
                         :fields="fields">
                    <template v-slot:cell(action)="data">
                        <b-button-group v-if="data.item.name !== 'Summary'">
                            <b-button v-on:click="approveTicker(data.item)">
                                <b-icon-check></b-icon-check>
                            </b-button>
                            <b-button v-on:click="skipTicker(data.item.symbol)">
                                <b-icon-x></b-icon-x>
                            </b-button>
                        </b-button-group>
                    </template>
                </b-table>
            </div>
        </div>

    </div>
</template>

<script>

    import {BASE} from "../vue-axios/axios-conf";

    export default {
        name: "IndexView",
        data: function () {
            return {
                source_url: `/indices/${this.$route.params.id}/adjusted/`,
                money: null,
                countries: [],
                sectors: [],
                industries: [],
                approved_tickers: new Set(),
                skipped_tickers: [],
                tickers: [],
                errorMsgConfig: {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                },
                fields: [
                    {key: 'symbol', sortable: true,},
                    {key: 'weight', sortable: true,},
                    {key: 'country', sortable: true,},
                    {key: 'sector', sortable: true,},
                    {key: 'industry', sortable: true,},
                    {key: 'amount', sortable: true,},
                    {key: 'price', sortable: true,},
                    {key: 'cost', sortable: true,},
                    {key: 'action', sortable: false}
                ],
            }
        },
        computed: {
            skipped_countries: function () {
                return this.countries
                    .filter(country => !country.state)
                    .map(country => country.text)
            },
            skipped_industries: function () {
                return this.industries
                    .filter(industry => !industry.state)
                    .map(industry => industry.text)
            },
            skipped_sectors: function () {
                return this.sectors
                    .filter(sector => !sector.state)
                    .map(sector => sector.text)
            }
        },
        methods: {
            adjustIndex: function () {

                BASE.get(this.source_url, {
                    params: {
                        'money': this.money,
                        'skip-country': this.skipped_countries,
                        'skip-sector': this.skipped_sectors,
                        'skip-industry': this.skipped_industries,
                        'skip-ticker': this.skipped_tickers
                    },
                }).then(response => {
                    response.data.tickers.forEach(ticker => {
                        if (this.approved_tickers.has(ticker.name)) {
                            ticker._rowVariant = "success"
                        }
                    })
                    this.tickers = response.data.tickers
                    this.tickers.push({
                        'name': 'Summary',
                        'cost': response.data.summary_cost
                    })
                }).catch(errorResponse => {
                    this.$bvToast.toast(`${errorResponse}`, this.errorMsgConfig)
                })
            },
            approveTicker: function (ticker) {
                this.approved_tickers.add(ticker.name);
                ticker._rowVariant = "success";
                this.$refs['tickers-table'].refresh();
            },
            getCalculationOptions: function () {
                BASE.options(this.source_url).then(response => {
                    response.data.query_params.countries.forEach(element => {
                        this.countries.push({text: element.country, state: true})
                    });

                    response.data.query_params.sectors.forEach(element => {
                        this.sectors.push({text: element.sector, state: true})
                    });

                    response.data.query_params.industries.forEach(element => {
                        this.industries.push({text: element.industry, state: true})
                    });
                }).catch(errorResponse => {
                    this.$bvToast.toast(`${errorResponse}`, this.errorMsgConfig)
                })
            },
            skipTicker: function (ticker_name) {
                this.skipped_tickers.push(ticker_name)
                this.adjustIndex()
            }
        },
        mounted() {
            this.getCalculationOptions()
        }
    }
</script>

<style scoped>

</style>
