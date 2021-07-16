<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <div>
          Index Status:
          <b-button
            id="importIndex"
            variant="light"
            @click="importIndex"
          >
            <b-icon
              icon="arrow-repeat"
            />
          </b-button>
          <b-tooltip
            target="importIndex"
          >
            Import index from the data source
          </b-tooltip>
          <FormComponent
            :key="selectedIndex"
            ref="importIndexForm"
            :embedded="true"
            :entity-name="'Index'"
            :entity="indices[selectedIndex]"
            :method="'PUT'"
            :request-url="`${indexUrl}/${selectedIndex}/`"
          />
        </div>
        <b-badge
          class="d-inline"
          :variant="badgeVariant"
        >
          {{ dynamicIndices[selectedIndex].status }}
        </b-badge>
      </b-col>
      <b-col>
        Last Updated
        <div
          id="index-tickers-last-updated-date"
        >
          <!-- More than a week -->
          <div v-if="(dynamicIndices[selectedIndex].tickersTimeDelta / (1000*60*60*24*7)) > 1">
            {{ Math.floor(dynamicIndices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) }} weeks ago
          </div>
          <!-- More than a day -->
          <div v-else-if="((dynamicIndices[selectedIndex].tickersTimeDelta / (1000*60*60*24)) % 7) > 1">
            {{ Math.floor(((dynamicIndices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60 * 24)) % 7)) }} days ago
          </div>
          <!-- More than an hour -->
          <div v-else-if="((dynamicIndices[selectedIndex].tickersTimeDelta / (1000*60*60)) % 24) > 1">
            {{ Math.floor(((dynamicIndices[selectedIndex].tickersTimeDelta / (1000 * 60 * 60)) % 24)) }} hours ago
          </div>
          <!-- More than a minute -->
          <div v-else-if="((dynamicIndices[selectedIndex].tickersTimeDelta / (1000*60)) % 60) > 1">
            {{ Math.floor(((dynamicIndices[selectedIndex].tickersTimeDelta / (1000 * 60)) % 60)) }} minutes ago
          </div>
          <div v-else>
            Less than minute ago
          </div>
        </div>
        <b-tooltip
          target="index-tickers-last-updated-date"
        >
          {{ dynamicIndices[selectedIndex].tickersLastUpdated }}
        </b-tooltip>
      </b-col>
      <b-col>
        <span
          id="reloadIndexTickers"
        >
          <b-button
            variant="outline-secondary"
            :disabled="!isIndexUpdatable"
            @click="reloadIndexTickers"
          >
            Reload Tickers Information
          </b-button>
        </span>
        <b-tooltip
          v-if="!isIndexUpdatable"
          target="reloadIndexTickers"
        >
          Updated less than an hour ago or currently is updating
        </b-tooltip>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import {updatingStatuses} from "../../../../utils/updatingStatuses";
import FormComponent from "../../../utils/FormComponent/FormComponent";
import {getFinApi} from "../../../../api/api";

export default {
  name: 'IndexStatus',
  components: {FormComponent},
  props: {
    indices: {
      type: Array,
      required: true
    },
    selectedIndex: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      badgeVariant: undefined,
      dynamicIndices: undefined,
      finApi: getFinApi(),
      indexUrl: '/indices',
      updatingStatuses: undefined
    }
  },
  computed: {
    isIndexUpdatable: function () {
      if (this.selectedIndex && this.dynamicIndices[this.selectedIndex]) {
        let index = this.dynamicIndices[this.selectedIndex];
        let updatedMoreThatHourAgo = index.tickersTimeDelta / (1000 * 60 * 60) > 1;
        return index.status !== this.updatingStatuses.updating && updatedMoreThatHourAgo;
      }
      return false
    },
  },
  created() {
    this.updatingStatuses = updatingStatuses
    this.dynamicIndices = this.indices

    this.selectBadgeVariant()
  },
  updated() {
    this.selectBadgeVariant();
  },
  methods: {
    importIndex: function () {
      this.$refs.importIndexForm.onSubmitFunction()
    },
    reloadIndexTickers: function () {
      let reloadUrl = `${this.indexUrl}/${this.selectedIndex}/tickers/`
      let that = this

      this.finApi.put(reloadUrl).then((response) => {
        let responseStatuses = [200, 202];
        if (responseStatuses.includes(response.status)) {
          that.dynamicIndices[that.selectedIndex].status = that.updatingStatuses.updating;
          that.dynamicIndices[that.selectedIndex].tickersLastUpdated = new Date();
          that.dynamicIndices[that.selectedIndex].tickersTimeDelta = 0;
        }
      }).catch((response) => {
        if (response.status === 406) {
          that.dynamicIndices[that.selectedIndex].status = that.updatingStatuses.updating;
          that.dynamicIndices[that.selectedIndex].tickersLastUpdated = new Date();
          that.dynamicIndices[that.selectedIndex].tickersTimeDelta = 0;
        }
      })
    },
    selectBadgeVariant: function () {
      if (this.dynamicIndices[this.selectedIndex].status === this.updatingStatuses.successfully_updated) {
        this.badgeVariant = 'success'
      } else if (this.dynamicIndices[this.selectedIndex].status === this.updatingStatuses.updating) {
        this.badgeVariant = 'warning'
      } else {
        this.badgeVariant = 'danger'
      }
    },
  }
}
</script>
