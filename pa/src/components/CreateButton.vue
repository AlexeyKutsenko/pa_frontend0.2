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
    import FormComponent from "./FormComponent";

    export default {
        name: "CreateButton",
        components: {FormComponent},
        props: {
            API_URL: {type: String, required: true},
            entityName: {type: String, required: true},
        },
        computed: {
            fin_api: function () {
                return this.$store.getters.fin_api
            },
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
                this.fin_api
                    .options(this.API_URL)
                    .then(response => {
                        if (response.data) {
                            let creationData = response.data['actions']['POST'];

                            if (creationData['query_params']) {
                                let query_params = creationData['query_params'];
                                delete creationData['query_params'];
                                for (const query_param in query_params) {
                                    if (query_params.hasOwnProperty(query_param) &&
                                        !query_params[query_param]['read_only']) {
                                        this.fieldsInfo[query_param] = query_params[query_param];
                                        this.fieldsInfo[query_param]['query_param'] = true;
                                    }
                                }
                            }

                            for (let field of Object.keys(creationData)) {
                                if (creationData.hasOwnProperty(field) &&
                                    !creationData[field]['read_only']) {
                                    this.fieldsInfo[field] = creationData[field];
                                }
                            }
                        }
                    })
                    .catch(errorResponse => {
                        this.$bvToast.toast(`${errorResponse}`, this.errorMsgConfig)
                    })

            },
            submitForm: function (bvModalEvt) {
                bvModalEvt.preventDefault();

                let form = this.$refs.formComponent.form;
                form.validate();

                if (form.valid) {
                    let creationData = {};
                    let paramsQuery = {};

                    for (let field of Object.keys(form.fields)) {
                        if (form.fields.hasOwnProperty(field)) {
                            if (form.fields[field]['query_param']) {
                                paramsQuery[field] = form.fields[field].data;
                            } else {
                                creationData[field] = form.fields[field].data
                            }
                        }
                    }

                    this.fin_api
                        .post(this.API_URL, creationData, {params: paramsQuery})
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
        created: function () {
            this.getCreationOptions();
        },
    }
</script>
