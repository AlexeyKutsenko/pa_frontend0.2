<template>
  <div>
    <b-container>
      <ExanteSettingsForm
        v-if="exanteSettings"
        :entity="exanteSettings"
        :portfolio-id="portfolioId"
        :url="String(/exante-settings/)"
      />
      <ExanteSettingsForm
        v-else
        :portfolio-id="portfolioId"
        :url="String(/exante-settings/)"
      />
    </b-container>
  </div>
</template>

<script>

import ExanteSettingsForm from "./ExanteSettingsForm";

export default {
  name: 'ExanteSettings',
  components: {ExanteSettingsForm,},
  props: {
    exanteSettings: {
      type: Object,
      default: () => {}
    },
    portfolioId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
    }
  },
};
</script>

<style scoped>

</style>