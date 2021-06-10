<template>
  <div>
    <List
      entity-name="Index"
      :api-url="url"
      :displayed-fields="fields"
    />
  </div>
</template>

<script>
import List from "../utils/List";

export default {
    name: "IndicesList",
    components: {List},
    data: function () {
        return {
            url: '/indices/',
            fields: [
                {
                    key: 'name',
                    sortable: true,
                },
            ]
        }
    },
}
</script>

<style scoped>

</style>
