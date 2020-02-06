<template>
    <div>
        <div v-if="items" :class="'row'">
            <b-table striped
                     hover
                     :items="items"
                     :fields="fields"
                     :class="'text-center'"
                     @sort-changed="sortingChanged"
            >
                <template v-slot:cell(action)="data">
<!--                    TODO Make Account editable-->
                    <b-button>
                        Edit
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
        props: {API_URL: {type: URL, required: true}, customFields: {type: Array, required: true}},
        data: function () {
            return {
                items: undefined,
                fields: this.customFields,
                next: undefined,
                previous: undefined,
                url: this.API_URL,
            }
        },
        methods: {
            getItems: function () {
                BASE
                    .get(this.url.href)
                    .then(response => {
                        this.items = response.data.results;
                        this.next = response.data.next ? new URL(response.data.next) : null;
                        this.previous = response.data.previous ? new URL(response.data.previous) : null;
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
    }
</script>

<style scoped>

</style>