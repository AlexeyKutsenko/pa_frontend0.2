<template>
  <div>
    <Grid
      entity-name="Portfolio"
      :api-url="url"
      :displayed-fields="fields"
    />
  </div>
</template>

<script>
import Grid from "./List";

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
