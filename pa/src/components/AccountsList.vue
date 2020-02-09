<template>
    <div>
        <Grid v-bind:API_URL="url" v-bind:displayedFields="fields"></Grid>
    </div>
</template>

<script>
    import Grid from "./Grid";

    export default {
        name: "AccountsList",
        components: {Grid},
        data: function () {
            return {
                url: '/accounts/',
                fields: [
                    {
                        key: 'name',
                        sortable: true
                    },
                    {
                        key: 'currency',
                        sortable: true
                    },
                    {
                        key: 'created',
                        sortable: true
                    },
                    {
                        key: 'updated',
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
