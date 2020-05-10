<template>
    <div>
        <Grid v-bind:API_URL="url" v-bind:displayedFields="fields" entityName="Goal"></Grid>
    </div>
</template>

<script>
    import Grid from "./Grid";
    export default {
        name: "GoalsList",
        components: {Grid},
        data: function() {
            return {
                url: '/goals/',
                fields: [
                    {
                        key: 'name',
                        sortable: true,
                    },
                    {
                        key: 'coefficient',
                        sortable: true,
                    },
                    {
                        key: 'current_money_amount',
                        sortable: true,
                    },
                    {
                        key: 'target_money_amount',
                        sortable: true,
                    },
                    {
                        key: 'level',
                        sortable: true,
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
