<template>
  <div>
    <Grid
      entity-name="Index"
      :api-url="url"
      :displayed-fields="fields"
    />
  </div>
</template>

<script>
import Grid from "./List";

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
