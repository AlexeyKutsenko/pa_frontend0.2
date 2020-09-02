<template>
  <div>
    <Grid
      entity-name="Portfolio"
      :a-p-i-u-r-l="url"
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
