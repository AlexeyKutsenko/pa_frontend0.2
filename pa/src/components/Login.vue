<template>
    <b-container>
        <b-row class="justify-content-center">
            <b-col cols="4">

            </b-col>
            <b-col cols="4" class="text-center">
                <b-card
                        class="m-4 bg-light"
                        style="max-width: 20rem;"
                >
                    <h3 class="m-5">
                        Login
                    </h3>
                    <div>
                        <b-form @submit.prevent="onSubmit">
                            <label class="sr-only" for="inline-form-input-username">Username</label>
                            <b-input-group class="mb-2 mr-sm-2 mb-sm-0">
                                <b-input-group-prepend>
                                    <span class="input-group-text"><b-icon icon="person-fill"></b-icon></span>
                                </b-input-group-prepend>
                                <b-input id="inline-form-input-username"
                                         placeholder="Username"
                                         v-model="form.username"></b-input>
                            </b-input-group>

                            <b-input-group class="mb-2 mr-sm-2 mb-sm-0 mt-3">
                                <b-input-group-prepend>
                                    <span class="input-group-text"><b-icon icon="lock"></b-icon></span>
                                </b-input-group-prepend>
                                <b-input id="inline-form-input-username"
                                         type="password"
                                         placeholder="Password"
                                         v-model="form.password"></b-input>
                            </b-input-group>

                            <b-button type="submit" class="mt-3" variant="primary">Login</b-button>
                        </b-form>
                    </div>
                </b-card>
            </b-col>
            <b-col cols="4">

            </b-col>
        </b-row>
    </b-container>
</template>

<script>


    export default {
        name: "Login",
        data() {
            return {
                errorMsgConfig: {
                    title: 'Error',
                    variant: 'danger',
                    solid: true
                },
                form: {},
            }
        },
        methods: {
            onSubmit: async function () {
                if (this.form.password.length > 0) {
                    try {
                        let result = await this.$store.dispatch('login', {
                            'username': this.form.username,
                            'password': this.form.password,
                        })
                        if (result.status === 200) {
                            await this.$router.push({name: 'home'})
                        }
                    } catch (errorResponse) {
                        this.$bvToast.toast(
                            `${errorResponse.response.data["non_field_errors"]}`,
                            this.errorMsgConfig
                        )
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>
