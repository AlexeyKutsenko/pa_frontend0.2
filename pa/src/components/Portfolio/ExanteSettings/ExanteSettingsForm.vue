<template>
  <FormComponent
    v-if="form"
    :embedded:="embedded"
    :entity="entity"
    :prop-form="form"
    :url="url"
  />
</template>

<script>
import FormComponent from "../../utils/FormComponent";
import {parse_options} from "../../../utils/parser";
import {Form} from "../../../utils/form";

export default {
  name: "ExanteSettingsForm",
  components: {FormComponent},
  extends: FormComponent,
  props: {
    portfolioId: {
      type: Number,
      required: true
    },
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
        .options(this.url)
        .then(response => {
          if (response.data) {
            // get options for form building
            let fieldsInfo = parse_options(response.data['actions']['POST'])

            // build form
            let form = new Form(fieldsInfo);

            form.fields.portfolio.data = this.portfolioId

            if (that.entity) {
              form.set_defaults(this.entity)
            }

            that.form = form
          }
        })
  },
  methods: {

  }
}
</script>

<style scoped>

</style>