<template>
  <FormComponent
    v-if="form"
    :embedded:="embedded"
    :entity="entity"
    :entity-name="'Exante Settings'"
    :method="method"
    :prop-form="form"
    :request-url="requestUrl"
  />
</template>

<script>
import FormComponent from "../../../utils/FormComponent/FormComponent";
import {parse_options} from "@/utils/parser";
import {Form} from "@/utils/form";

export default {
  name: "ExanteSettingsForm",
  components: {FormComponent},
  extends: FormComponent,
  props: {
    portfolioId: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      form: null
    }
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi
    }
  },
  created: function () {
    let that = this;
    this.finApi
        .options(this.requestUrl)
        .then(response => {
          if (response.data) {
            // get options for form building
            let fieldsInfo = parse_options(response.data['actions'][that.method])

            // build form
            let form = new Form(fieldsInfo);

            if (that.entity) {
              form.set_defaults(that.entity)
            }

            form.fields.portfolio.data = that.portfolioId

            that.form = form
          }
        })
  },
  methods: {}
}
</script>

<style scoped>

</style>
