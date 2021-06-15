<template>
  <div class="row">
    <div class="col-12 p-1">
      <b-button v-b-modal="'create' + entityName">
        Create {{ entityName }}
      </b-button>
    </div>
    <b-modal
      :id="'create' + entityName"
      @ok="submitForm"
    >
      <FormComponent
        ref="formComponent"
        :embedded="true"
        :prop-form="form"
        :url="apiUrl"
      />
    </b-modal>
  </div>
</template>

<script>
import FormComponent from './FormComponent';
import {parse_options} from '../../utils/parser';
import {prepare_request_data} from '../../utils/helpers';
import {Form} from "../../utils/form";

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
    let that = this
    this.finApi
        .options(this.apiUrl)
        .then(response => {
          if (response.data) {
            let fieldsInfo = parse_options(response.data['actions']['POST'])

            that.form = new Form(fieldsInfo)

          }
        })
        .catch(errorResponse => {
          this.$bvToast.toast(`${errorResponse}`, this.errorMsgConfig)
        })
  },
  methods: {
    submitForm: function (bvModalEvt) {
      bvModalEvt.preventDefault();

      let form = this.$refs.formComponent.propForm;
      form.validate();

      if (form.valid) {
        let {creationData, paramsQuery} = prepare_request_data(form);

        this.finApi
          .post(this.apiUrl, creationData, {params: paramsQuery})
          .then(response => {
            if (response.status === 201) {
              this.$nextTick(() => {
                this.$bvModal.hide('create' + this.entityName)
              });

              this.$bvToast.toast(`${this.entityName} has been created`, {
                  title: 'Success',
                  variant: 'success',
                  solid: false
                }
              );

              this.$emit('entityCreated')
            }
          })
          .catch(errorResponse => {
            if (errorResponse["message"] && errorResponse.response.status !== 400) {
              this.$bvToast.toast(`${errorResponse["message"]}`,
                this.errorMsgConfig)
            } else {
              for (const errorField in errorResponse.response.data) {
                if (errorResponse.response.data.hasOwnProperty(errorField) &&
                  form.fields[errorField]) {

                  let fieldName = form.fields[errorField].label;
                  let errorMsg = errorResponse.response.data[errorField];

                  this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                } else {
                  let fieldName = 'detail';
                  let errorMsg = errorResponse.response.data[fieldName]
                  this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                }
              }
            }

            this.$nextTick(() => {
              this.$bvModal.hide('create' + this.entityName)
            });
          });
      }
    }
  },
}
</script>
