<template>
    <div>
        <b-input-group>
            <b-form-input type="number" v-model.number="money"></b-form-input>
            <b-input-group-append>
                <b-button variant="outline-secondary" v-on:click="updateParams()">
                    Calculate
                </b-button>
            </b-input-group-append>
        </b-input-group>
        <div v-if="money">
            <Grid v-bind:API_URL="source_url"
                  v-bind:params="params"
                  v-bind:displayedFields="fields"
                  v-bind:list="false"></Grid>
        </div>
    </div>
</template>

<script>
    import Grid from "./Grid";

    export default {
        name: "IndexView",
        components: {Grid},
        data: function () {
            return {
                source_url: `/adjusted-index/index/${this.$route.params.id}/`,
                money: null,
                params: {},
                fields: [
                    {
                        key: 'name',
                        sortable: true,
                    },
                    {
                        key: 'weight',
                        sortable: true,
                    },
                    {
                        key: 'price',
                        sortable: true,
                    }
                ],
            }
        },
        methods: {
            updateParams: function () {
                this.params = {'money': this.money}
            }
        }
    }
</script>

<style scoped>

</style>
