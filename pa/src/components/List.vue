<template>
  <div class="container-fluid">
    <CreateButton
      :api-url="apiUrl"
      :entity-name="entityName"
      @entityCreated="getItems"
    />
    <div
      v-if="items"
      class="row"
    >
      <b-table
        :class="'text-center'"
        :fields="displayedFields"
        :items="items"
        hover
        striped
        @sort-changed="sortingChanged"
      >
        <template v-slot:cell(action)="data">
          <b-button :to="{path: $route.path.concat('/', data.item.id)}">
            View
          </b-button>
        </template>
      </b-table>
    </div>
    <div class="row">
      <div class="col-12">
        <b-button
          v-if="previous"
          :class="'float-right'"
          @click="pageChanged(previous.searchParams)"
        >
          Previous
        </b-button>
        <b-button
          v-if="next"
          :class="'float-right'"
          @click="pageChanged(next.searchParams)"
        >
          Next
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import CreateButton from "./CreateButton";

export default {
    name: "Grid",
    components: {CreateButton},
    props: {
        apiUrl: {type: String, required: true},
        entityName: {type: String, required: true},
        displayedFields: {type: Array, required: true},
        list: {type: Boolean, default: true},
    },
    data: function () {
        return {
            items: undefined,
            next: undefined,
            previous: undefined,
            params: new URLSearchParams()
        }
    },
    computed: {
        fin_api: function () {
            return this.$store.getters.fin_api
        },
    },
    watch: {
        params: function () {
            this.getItems()
        }
    },
    mounted: function () {
        this.getItems();
    },
    methods: {
        getItems: function () {
            this.fin_api
                .get(this.apiUrl, {
                    params: this.params
                })
                .then(response => {


                    this.items = response.data.results;
                    this.next = response.data.next ? new URL(response.data.next) : null;
                    this.previous = response.data.previous ? new URL(response.data.previous) : null;
                })
                .catch(error => {
                    // TODO: handle error
                    this.error = error
                })
        },
        sortingChanged: function (ctx) {
            this.params.set('ordering', ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy);
            this.getItems()
        },
        pageChanged: function (params) {
            if (params.has('page')) {
                this.params.set('page', params.get('page'));
            } else {
                this.params.delete('page');
            }
            this.getItems()
        }
    }
}
</script>

<style scoped>

</style>
