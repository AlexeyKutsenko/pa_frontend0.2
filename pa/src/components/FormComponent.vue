<template>
  <div>
    <b-form
      @reset="onReset"
      @submit="onSubmit"
    >
      <b-form-group
        v-for="(fieldInfo, fieldName) in form.fields"
        :id="'input-group-' + fieldName"
        :key="fieldName"
        :label="fieldInfo.label"
        :label-for="'input-' + fieldName"
      >
        <b-form-input
          v-if="fieldInfo.type !== 'choice'"
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
    </b-form>
  </div>
</template>
<script>
import {Form} from '../utils/form'

export default {
  name: 'FormComponent',
  props: {
    fieldsInfo: {
      type: Object,
      default: () => {}
    },
  },
  data: function () {
    return {
      form: {},
    }
  },
  created() {
    this.form = new Form(this.fieldsInfo);
  },
  methods: {
    onReset: function (event) {
      this.event = event;
    },
    onSubmit: function (event) {
      this.event = event;
    },
  }
}
</script>
