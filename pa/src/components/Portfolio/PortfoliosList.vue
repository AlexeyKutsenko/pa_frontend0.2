<template>
  <div>
    <List
      entity-name="Portfolio"
      :api-url="url"
      :displayed-fields="fields"
    />
  </div>
</template>

<script>
import List from "../utils/List";

export default {
  name: "PortfoliosList",
  components: {List},
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
