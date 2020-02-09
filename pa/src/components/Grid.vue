<template>
    <div class="container-fluid">
        <div v-if="items" :class="'row'">
            <b-table striped
                     hover
                     :items="items"
                     :fields="displayedFields"
                     :class="'text-center'"
                     @sort-changed="sortingChanged"
            >
                <template v-slot:cell(action)="data">
                    <b-button :to="{path: $route.path.concat('/', data.item.id)}">
                        View
                    </b-button>
                </template>
            </b-table>
        </div>
        <div class="row">
            <div class="col-12">
                <b-button v-if="previous" :class="'float-right'" v-on:click="pageChanged(previous.searchParams)">
                    Previous
                </b-button>
                <b-button v-if="next" :class="'float-right'" v-on:click="pageChanged(next.searchParams)">
                    Next
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {BASE} from "../vue-axios/axios-conf";

    export default {
        name: "Grid",
        props: {
            API_URL: {type: String, required: true},
            displayedFields: {type: Array, required: true},
            list: {type: Boolean, default: true},
            params : {type: Object}
        },
        data: function () {
            return {
                items: undefined,
                next: undefined,
                previous: undefined,
            }
        },
        methods: {
            getItems: function () {
                // eslint-disable-next-line no-console
                console.log(this.params);
                BASE
                    .get(this.API_URL, {
                        params: this.params
                    })
                    .then(response => {
                        // TODO: make normal cache
                        // TODO: make less specific (response.data.results) (response.data.tickers)

                        if (this.list) {
                            let cachedData = {};
                            response.data.results.forEach(element => {
                                cachedData[element.id] = element
                            });
                            localStorage.setItem('indices', JSON.stringify(cachedData));

                            this.items = response.data.results;
                            this.next = response.data.next ? new URL(response.data.next) : null;
                            this.previous = response.data.previous ? new URL(response.data.previous) : null;
                        } else {
                            this.items = response.data;
                        }
                    })
                    .catch(error => {
                        // TODO: handle error
                        this.error = error
                    })
            },
            sortingChanged: function (ctx) {
                this.url.searchParams.set('ordering', ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy);
                this.getItems()
            },
            pageChanged: function (params) {
                if (params.has('page')) {
                    this.url.searchParams.set('page', params.get('page'));
                } else {
                    this.url.searchParams.delete('page');
                }
                this.getItems()
            }
        },
        mounted: function () {
            this.getItems();
        },
        watch: {
            params : function () {
                this.getItems()
            }
        }
    }
</script>

<style scoped>

</style>
