<template>
  <div class="row">
    <div class="col-12 p-1">
      <b-button v-b-modal="'create' + entityName">
        Create {{ entityName }}
      </b-button>
    </div>
    <b-modal
      :id="'create' + entityName"
      @ok.prevent="submitForm"
    >
      <FormComponent
        ref="formComponent"
        :embedded="true"
        :method="'POST'"
        :prop-form="form"
        :request-url="apiUrl"
      />
    </b-modal>
  </div>
</template>

<script>
import FormComponent from './FormComponent/FormComponent';
import {prepare_request_data} from '@/utils/helpers';
import {errorMsg, successCreateMsg} from "./msgHelpers";

export default {
  name: "CreateButton",
  components: {FormComponent},
  props: {
    apiUrl: {type: String, required: true},
    entityName: {type: String, required: true},
  },
  data: function () {
    return {
      fieldsInfo: {},
      form: null,
      errorMsgConfig: {
        title: 'Error',
        variant: 'danger',
        solid: true
      },
    }
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi
    },
  },
  created: function () {
    this.errorMsg = errorMsg
    this.successCreateMsg = successCreateMsg
  },
  methods: {
    submitForm: function () {
      let form = this.$refs.formComponent.form;
      form.validate();

      if (form.valid) {
        let {creationData, paramsQuery} = prepare_request_data(form);

        this.finApi
          .post(this.apiUrl, creationData, {params: paramsQuery})
          .then(response => {
            if (response.status === 201) {
              this.successCreateMsg(this.entityName)
              this.$emit('entityCreated')
              this.$nextTick(() => {
                this.$bvModal.hide('create' + this.entityName)
              });
            } else {
              throw 'Response status is not supported'
            }
          })
          .catch(errorResponse => {
            this.$nextTick(() => {
              this.$bvModal.hide('create' + this.entityName)
            });

            this.errorMsg(errorResponse, form)
          });
      }
    }
  },
}
</script>
