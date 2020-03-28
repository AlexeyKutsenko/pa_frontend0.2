<template>
    <div>
        <Grid v-bind:API_URL="url" v-bind:displayedFields="fields" entity-name="Index"></Grid>
    </div>
</template>

<script>
    import Grid from "./Grid";

    export default {
        name: "IndicesList",
        components: {Grid},
        data: function () {
            return {
                url: '/indices/',
                fields: [
                    {
                        key: 'data_source_url',
                        sortable: true,
                    },
                    {
                        key: 'updated',
                        sortable: true
                    },
                    {
                        key: 'created',
                        sortable: true,
                    },
                    {
                        key: 'action',
                        label: 'Actions'
                    }
                ]
            }
        },
    }
</script>

<style scoped>

</style>
