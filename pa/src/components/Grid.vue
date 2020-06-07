<template>
    <div class="container-fluid">
        <CreateButton v-bind:API_URL="API_URL"
                      v-bind:entityName="entityName"
                      v-on:entityCreated="getItems"
        ></CreateButton>
        <div v-if="items" class="row">
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
                <b-button v-if="previous" :class="'float-right'"
                          v-on:click="pageChanged(previous.searchParams)">
                    Previous
                </b-button>
                <b-button v-if="next" :class="'float-right'"
                          v-on:click="pageChanged(next.searchParams)">
                    Next
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
    import CreateButton from "./CreateButton";

    export default {
        name: "Grid",
        components: {CreateButton},
        props: {
            API_URL: {type: String, required: true},
            entityName: {type: String, required: true},
            displayedFields: {type: Array, required: true},
            list: {type: Boolean, default: true},
        },
        computed: {
            fin_api: function () {
                return this.$store.getters.fin_api
            },
        },
        data: function () {
            return {
                items: undefined,
                next: undefined,
                previous: undefined,
                params: new URLSearchParams()
            }
        },
        methods: {
            getItems: function () {
                this.fin_api
                    .get(this.API_URL, {
                        params: this.params
                    })
                    .then(response => {
                        // TODO: make normal cache

                        let cachedData = {};
                        response.data.results.forEach(element => {
                            cachedData[element.id] = element
                        });
                        localStorage.setItem('entities', JSON.stringify(cachedData));

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
                this.params.set('ordering', ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy);
                this.getItems()
            },
            pageChanged: function (params) {
                if (params.has('page')) {
                    this.params.set('page', params.get('page'));
                } else {
                    this.params.delete('page');
                }
                this.getItems()
            }
        },
        mounted: function () {
            this.getItems();
        },
        watch: {
            params: function () {
                this.getItems()
            }
        }
    }
</script>

<style scoped>

</style>
