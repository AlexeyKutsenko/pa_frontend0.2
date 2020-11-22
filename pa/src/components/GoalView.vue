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
        <b-form-input
          :id="`goal-${this.$route.params.id}-name`"
          v-model="goal.name"
          :value="goal.name"
          type="text"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
        <label :for="`goal-${this.$route.params.id}-coefficient`">Coefficient:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input
          :id="`goal-${this.$route.params.id}-coefficient`"
          v-model="goal.coefficient"
          :value="goal.coefficient"
          type="text"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
        <label :for="`goal-${this.$route.params.id}-current_money_amount`">
          Current money amount:
        </label>
      </b-col>
      <b-col sm="9">
        <b-form-input
          :id="`goal-${this.$route.params.id}-current_money_amount`"
          v-model="goal.current_money_amount"
          :value="goal.current_money_amount"
          type="text"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
        <label :for="`goal-${this.$route.params.id}-target_money_amount`">
          Target money amount:
        </label>
      </b-col>
      <b-col sm="9">
        <b-form-input
          :id="`goal-${this.$route.params.id}-target_money_amount`"
          v-model="goal.target_money_amount"
          :value="goal.target_money_amount"
          type="text"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="3">
        <label :for="`goal-${this.$route.params.id}-level`">
          Level:
        </label>
      </b-col>
      <b-col sm="9">
        <b-form-input
          :id="`goal-${this.$route.params.id}-level`"
          v-model="goal.level"
          :value="goal.level"
          type="text"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

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
    computed: {
        fin_api: function () {
            return this.$store.getters.finApi
        },
    },
    mounted() {
        this.fin_api
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
