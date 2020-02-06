<template>
    <div :class="'container-fluid'">
        <Grid v-bind:API_URL="url" v-bind:customFields="fields"></Grid>
    </div>
</template>

<script>
    import {BASE} from "../vue-axios/axios-conf";
    import Grid from "./Grid";

    export default {
        name: "AccountsList",
        components: {Grid},
        data: function () {
            return {
                url: new URL(BASE.defaults.baseURL + 'fin/accounts/'),
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
                        label: 'Action'
                    }]
            }
        },
    }
</script>

<style scoped>

</style>