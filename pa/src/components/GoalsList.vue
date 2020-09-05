<template>
  <div>
    <List
      entity-name="Goal"
      :api-url="url"
      :displayed-fields="fields"
    />
  </div>
</template>

<script>
import List from "./List";

export default {
    name: "GoalsList",
    components: {List},
    data: function () {
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
