<template>
    <div class="row">
        <div class="col-12 p-1">
            <b-button v-b-modal="'create' + entityName">
                Create {{ entityName }}
            </b-button>
        </div>
        <b-modal :id="'create' + entityName" @ok="submitForm">
            <FormComponent ref="formComponent" :fields-info="fieldsInfo"/>
        </b-modal>
    </div>
</template>

<script>
    import {BASE} from "../vue-axios/axios-conf";
    import FormComponent from "./FormComponent";

    export default {
        name: "CreateButton",
        components: {FormComponent},
        props: {
            API_URL: {type: String, required: true},
            entityName: {type: String, required: true},
        },
        data: function () {
            return {
                fieldsInfo: {},
                errorMsgConfig: {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                },
            }
        },
        methods: {
            getCreationOptions: function () {
                BASE
                    .options(this.API_URL)
                    .then(response => {
                        if (response.data) {
                            let creationData = response.data['actions']['POST'];
                            for (const field in creationData) {
                                if (creationData.hasOwnProperty(field) &&
                                    !creationData[field]['read_only']) {
                                    this.fieldsInfo[field] = creationData[field];
                                }
                            }
                        }
                    })
                    .catch(errorResponse => {
                        this.$bvToast.toast(`${errorResponse}`,
                            this.errorMsgConfig)
                    })

            },
            submitForm: function (bvModalEvt) {
                bvModalEvt.preventDefault();

                let form = this.$refs.formComponent.form;
                form.validate();

                if (form.valid) {
                    let creationData = {};

                    for (const field in form.fields) {
                        if (form.fields.hasOwnProperty(field)) {
                            creationData[field] = form.fields[field].data
                        }
                    }

                    BASE
                        .post(this.API_URL, creationData)
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
                            if (errorResponse["message"] && errorResponse.status !== 400) {
                                this.$bvToast.toast(`${errorResponse["message"]}`,
                                    this.errorMsgConfig)
                            } else {
                                for (const errorField in errorResponse.response.data) {
                                    if (errorResponse.response.data.hasOwnProperty(errorField)) {
                                        let fieldName = form.fields[errorField].label;
                                        let errorMsg = errorResponse.response.data[errorField];

                                        this.$bvToast.toast(`${fieldName}: ${errorMsg}`,
                                            this.errorMsgConfig)
                                    }
                                }
                            }

                            this.$nextTick(() => {
                                this.$bvModal.hide('create' + this.entityName)
                            });
                        })
                }
            }
        },
        created: function () {
            this.getCreationOptions();
        },
    }
</script>
