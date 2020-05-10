<template>
    <div>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group
                    v-for="(fieldInfo, fieldName) in this.form.fields"
                    v-bind:key="fieldName"
                    :id="'input-group-' + fieldName"
                    :label="fieldInfo.label"
                    :label-for="'input-' + fieldName"
            >
                <b-form-input
                        v-bind:required="fieldInfo.required"
                        v-if="fieldInfo.type !== 'choice'"
                        v-model="fieldInfo.data"
                        :id="'input-' + fieldName"
                        :state="fieldInfo.valid"
                        :placeholder="'Enter ' + fieldInfo.label"
                        :type="fieldInfo.type"
                >
                </b-form-input>
                <b-form-select
                    v-bind:required="fieldInfo.required"
                    v-if="fieldInfo.type === 'choice'"
                    v-model="fieldInfo.data"
                    :id="'input' + fieldName"
                    :state="fieldInfo.valid"
                    :placeholder="'Enter' + fieldInfo.label"
                    :options="fieldInfo.choices"
                >

                </b-form-select>

                <b-form-invalid-feedback
                        v-for="error in fieldInfo.errors"
                        v-bind:key="error"
                        :id="'input-' + fieldName">
                    {{ error }}
                </b-form-invalid-feedback>
            </b-form-group>
        </b-form>

    </div>
</template>
<script>
    /* eslint-disable no-console */
    import {Form} from '../utils/form'

    export default {
        name: 'formComponent',
        props: {
            fieldsInfo: {},
        },
        data: function () {
            return {
                form: {},
            }
        },
        methods: {
            onReset: function (event) {
                this.event = event;
            },
            onSubmit: function (event) {
                this.event = event;
                alert(event);
                for (const field in this.form) {
                    console.log(field)
                }
            },
        },
        created() {
            this.form = new Form(this.fieldsInfo);
        }
    }
</script>
