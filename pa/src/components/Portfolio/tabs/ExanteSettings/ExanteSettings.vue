<template>
  <div>
    <b-container>
      <FormComponent
        v-if="exanteSettings"
        entity-name="Exante Settings"
        :entity="exanteSettings"
        :fields-classes="fieldsClasses"
        :method="RequestMethods.PUT"
        :request-url="String('/exante-settings/') + exanteSettings.id + '/'"
      />
      <FormComponent
        v-else
        entity-name="Exante Settings"
        :entity="{'portfolio': portfolioId}"
        :fields-classes="fieldsClasses"
        :method="RequestMethods.POST"
        :request-url="String(/exante-settings/)"
      />
    </b-container>
  </div>
</template>

<script>

import FormComponent from "../../../utils/FormComponent/FormComponent";
import {RequestMethods} from "../../../../utils/requestMethods";

export default {
  name: 'ExanteSettings',
  components: {FormComponent},
  props: {
    exanteSettings: {
      type: Object,
      default: () => {
      }
    },
    portfolioId: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      fieldsClasses: {
        portfolio: 'd-none'
      },
      RequestMethods: RequestMethods,
    }
  },
};
</script>

<style scoped>

</style>
