<template>
  <b-row
    class="align-items-center text-center m-1"
  >
    <b-col>
      <div>
        Status:
      </div>
      <b-badge
        v-if="dynamicStatus === updatingStatuses.successfully_updated"
        class="d-inline"
        variant="success"
      >
        {{ dynamicStatus }}
      </b-badge>
      <b-badge
        v-else-if="dynamicStatus === updatingStatuses.updating"
        class="d-inline"
        variant="warning"
      >
        {{ dynamicStatus }}
      </b-badge>
      <b-badge
        v-else
        class="d-inline"
        variant="danger"
      >
        {{ dynamicStatus }}
      </b-badge>
    </b-col>
    <b-col>
      Last Updated:
      <div
        v-if="dynamicTickersLastUpdated"
      >
        <div
          id="portfolio-tickers-last-updated-date"
        >
          <!-- More than a week -->
          <div v-if="(dynamicTickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) > 1">
            {{ Math.floor(dynamicTickersTimeDelta / (1000 * 60 * 60 * 24 * 7)) }} weeks ago
          </div>
          <!-- More than a day -->
          <div v-else-if=" (dynamicTickersTimeDelta / (1000 * 60 * 60 * 24)) % 7 > 1 ">
            {{ Math.floor((dynamicTickersTimeDelta / (1000 * 60 * 60 * 24)) % 7) }} days ago
          </div>
          <!-- More than an hour -->
          <div v-else-if="(dynamicTickersTimeDelta / (1000 * 60 * 60)) % 24 > 1 ">
            {{ Math.floor((dynamicTickersTimeDelta / (1000 * 60 * 60)) % 24) }} hours ago
          </div>
          <!-- More than a minute -->
          <div v-else-if="(dynamicTickersTimeDelta / (1000 * 60)) % 60 > 1">
            {{ Math.floor((dynamicTickersTimeDelta / (1000 * 60)) % 60) }} minutes ago
          </div>
          <div v-else>
            Less than minute ago
          </div>
        </div>
        <b-tooltip
          target="portfolio-tickers-last-updated-date"
        >
          {{ dynamicTickersLastUpdated }}
        </b-tooltip>
      </div>
    </b-col>
    <b-col>
      <span
        id="reloadPortfolioTickers"
      >
        <b-button
          variant="outline-secondary"
          :disabled="!isPortfolioUpdatable"
          @click="reloadPortfolioTickersInformation"
        >
          Reload Tickers Information
        </b-button>
      </span>
      <b-tooltip
        v-if="!isPortfolioUpdatable"
        target="reloadPortfolioTickers"
      >
        Updated less than an hour ago or currently is updating
      </b-tooltip>
    </b-col>
  </b-row>
</template>

<script>
import {updatingStatuses} from "../../utils/updatingStatuses";
import {getFinApi} from "../../api/api";

export default {
  name: "PortfolioStatus",
  props: {
    portfolioUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    tickersLastUpdated: {
      type: Date,
      required: true
    },
    tickersTimeDelta: {
      type: Number,
      required: true
    },
  },
  data: function () {
    return {
      dynamicStatus: undefined,
      dynamicTickersLastUpdated: undefined,
      dynamicTickersTimeDelta: undefined,
      finApi: getFinApi(),
      updatingStatuses: undefined
    }
  },
  computed: {
    isPortfolioUpdatable: function () {
      let updatedMoreThanHourAgo = this.dynamicTickersTimeDelta / (1000 * 60 * 60) > 1;
      return (this.dynamicStatus !== this.updatingStatuses.updating && updatedMoreThanHourAgo);
    },
  },
  created: function () {
    this.updatingStatuses = updatingStatuses;
    this.dynamicStatus = this.status;
    this.dynamicTickersLastUpdated = this.tickersLastUpdated;
    this.dynamicTickersTimeDelta = this.tickersTimeDelta;
  },
  methods: {
    reloadPortfolioTickersInformation: function () {
      let reloadUrl = `${this.portfolioUrl}/tickers/`;
      this.finApi.put(reloadUrl).then((response) => {
        let responseStatuses = [200, 202];
        if (responseStatuses.includes(response.status)) {
          this.dynamicStatus = this.updatingStatuses.updating;
          this.dynamicTickersLastUpdated = new Date();
          this.dynamicTickersTimeDelta = 0;
        }
      }).catch((response) => {
        if (response.status === 406) {
          this.dynamicStatus = this.updatingStatuses.updating;
          this.dynamicTickersLastUpdated = new Date();
          this.dynamicTickersTimeDelta = 0;
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
