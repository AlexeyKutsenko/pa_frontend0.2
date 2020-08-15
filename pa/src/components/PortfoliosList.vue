<template>
    <div>
        <Grid v-bind:API_URL="url" v-bind:displayedFields="fields" entityName="Portfolio"></Grid>
    </div>
</template>

<script>
    import Grid from "./Grid";

    export default {
        name: "PortfoliosList",
        components: {Grid},
        data: function () {
            return {
                url: '/portfolios/',
                fields: [
                    {
                        key: 'id',
                        sortable: true,
                    },
                    {
                        key: 'name',
                        sortable: true
                    },
                    {
                        key: 'action',
                        label: 'Actions'
                    }
                ]
            }
        }
    }
</script>

<style scoped>

</style>
