<template>
    <b-container fluid>
        <b-row>
            <b-col sm="12">
                <div class="text-center">
                    Goal #{{ this.$route.params.id }}
                </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label :for="`goal-${this.$route.params.id}-name`">Name:</label>
            </b-col>
            <b-col sm="9">
                <b-form-input :id="`goal-${this.$route.params.id}-name`" type="text"
                              v-model="goal.name" :value="goal.name">
                </b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label :for="`goal-${this.$route.params.id}-coefficient`">Coefficient:</label>
            </b-col>
            <b-col sm="9">
                <b-form-input :id="`goal-${this.$route.params.id}-coefficient`" type="text"
                              v-model="goal.coefficient" :value="goal.coefficient">
                </b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label :for="`goal-${this.$route.params.id}-current_money_amount`">
                    Current money amount:
                </label>
            </b-col>
            <b-col sm="9">
                <b-form-input :id="`goal-${this.$route.params.id}-current_money_amount`"
                              type="text" v-model="goal.current_money_amount"
                              :value="goal.current_money_amount">
                </b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label :for="`goal-${this.$route.params.id}-target_money_amount`">
                    Target money amount:
                </label>
            </b-col>
            <b-col sm="9">
                <b-form-input :id="`goal-${this.$route.params.id}-target_money_amount`" type="text"
                              v-model="goal.target_money_amount" :value="goal.target_money_amount">
                </b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm="3">
                <label :for="`goal-${this.$route.params.id}-level`">
                    Level:
                </label>
            </b-col>
            <b-col sm="9">
                <b-form-input :id="`goal-${this.$route.params.id}-level`" type="text"
                              v-model="goal.level" :value="goal.level">

                </b-form-input>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {BASE} from "../vue-axios/axios-conf";

    export default {
        name: "GoalView",
        data: function () {
            return {
                source_url: `/goals/${this.$route.params.id}`,
                goal: {
                    name: '',
                    coefficient: '',
                    current_money_amount: '',
                    target_money_amount: '',
                    level: '',
                },
            }
        },
        mounted() {
            BASE
                .get(this.source_url)
                .then(response => {
                    this.goal.name = response.data.name;
                    this.goal.coefficient = response.data.coefficient;
                    this.goal.current_money_amount = response.data.current_money_amount;
                    this.goal.target_money_amount = response.data.target_money_amount;
                    this.goal.level = response.data.level;
                })
                .catch(error => {
                    this.error = error
                })
        }
    }
</script>

<style scoped>

</style>
