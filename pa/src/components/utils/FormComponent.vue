<template>
  <div>
    <b-form
      v-if="form"
      @reset="onReset"
      @submit.prevent="onSubmitFunction"
    >
      <b-form-group
        v-for="(fieldInfo, fieldName) in form.fields"
        :id="'input-group-' + fieldName"
        :key="fieldName"
        :class="{'d-none': (fieldInfo.type === 'hidden')}"
        :label="fieldInfo.label"
        :label-for="'input-' + fieldName"
      >
        <input
          v-if="fieldInfo.type === 'hidden'"
          :id="'input-' + fieldName"
          v-model="fieldInfo.data"
          :placeholder="'Enter ' + fieldInfo.label"
          :state="fieldInfo.valid"
          :type="fieldInfo.type"
          :required="fieldInfo.required"
        >
        <b-form-input
          v-else-if="fieldInfo.type !== 'choice'"
          :id="'input-' + fieldName"
          v-model="fieldInfo.data"
          :placeholder="'Enter ' + fieldInfo.label"
          :state="fieldInfo.valid"
          :type="fieldInfo.type"
          :required="fieldInfo.required"
        />
        <b-form-select
          v-if="fieldInfo.type === 'choice'"
          :id="'input' + fieldName"
          v-model="fieldInfo.data"
          :options="fieldInfo.choices"
          :placeholder="'Enter' + fieldInfo.label"
          :state="fieldInfo.valid"
          :required="fieldInfo.required"
        />

        <b-form-invalid-feedback
          v-for="error in fieldInfo.errors"
          :id="'input-' + fieldName"
          :key="error"
        >
          {{ error }}
        </b-form-invalid-feedback>
      </b-form-group>

      <div
        v-if="!embedded"
      >
        <b-button
          class="m-1"
          type="submit"
          variant="primary"
        >
          Submit
        </b-button>
        <b-button
          class="m-1"
          type="reset"
          variant="danger"
        >
          Reset
        </b-button>
      </div>
    </b-form>
  </div>
</template>
<script>
import {prepare_request_data} from '../../utils/helpers';

export default {
  name: 'FormComponent',
  props: {
    onSubmit: {
      type: Function,
      default: () => undefined
    },
    embedded: {
      type: Boolean,
      default: () => false
    },
    entity: {
      type: Object,
      default: () => null
    },
    propForm: {
      type: Object,
      default: () => null
    },
    url: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      errorMsgConfig: {
        title: 'Error',
        variant: 'danger',
        solid: true
      },
      form: null,
      onSubmitFunction: this.defaultOnSubmit
    }
  },
  computed: {
    finApi: function () {
      return this.$store.getters.finApi
    }
  },
  created: function () {
    if(this.onSubmit() !== undefined) {
      this.onSubmitFunction = this.onSubmit
    }
    this.form = this.propForm
  },
  methods: {
    onReset: function (event) {
      this.event = event;
    },
    defaultOnSubmit: function () {
      this.form.validate()

      if (this.form.valid) {
        let {creationData, paramsQuery} = prepare_request_data(this.form)

        if (this.entity) {
          let updateUrl = this.url + this.entity.id + '/'
          this.finApi
              .put(updateUrl, creationData, {params: paramsQuery})
              .then(response => {
                if (response.status === 200) {
                  this.$bvToast.toast(`${this.entityName} has been updated`, {
                    title: 'Success',
                    variant: 'success',
                    solid: false
                  })
                }
              })
              .catch(errorResponse => {
                if (errorResponse["message"] && errorResponse.response.status !== 400) {
                  this.$bvToast.toast(`${errorResponse["message"]}`, this.errorMsgConfig)
                } else {
                  for (const errorField in errorResponse.response.data) {
                    if (errorResponse.response.data.hasOwnProperty(errorField) && this.form.fields[errorField]) {
                      let fieldName = this.form.fields[errorField].label;
                      let errorMsg = errorResponse.response.data[errorField];

                      this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                    } else {
                      let fieldName = 'detail';
                      let errorMsg = errorResponse.response.data[fieldName]
                      this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                    }
                  }
                }
              })
        } else {
          this.finApi
              .post(this.url, creationData, {params: paramsQuery})
              .then(response => {
                if (response.status === 201) {
                  this.$bvToast.toast(`${this.entityName} has been created`, {
                    title: 'Success',
                    variant: 'success',
                    solid: false
                  })
                }
              })
              .catch(errorResponse => {
                if (errorResponse["message"] && errorResponse.response.status !== 400) {
                  this.$bvToast.toast(`${errorResponse["message"]}`, this.errorMsgConfig)
                } else {
                  for (const errorField in errorResponse.response.data) {
                    if (errorResponse.response.data.hasOwnProperty(errorField) && this.form.fields[errorField]) {
                      let fieldName = this.form.fields[errorField].label;
                      let errorMsg = errorResponse.response.data[errorField];

                      this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                    } else {
                      let fieldName = 'detail';
                      let errorMsg = errorResponse.response.data[fieldName]
                      this.$bvToast.toast(`${fieldName}: ${errorMsg}`, this.errorMsgConfig)
                    }
                  }
                }
              })
        }
      } else {
        this.$bvToast.toast('Form is invalid')
      }
    },
  }
}
</script>
