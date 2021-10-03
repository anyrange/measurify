<template>
  <loading-spinner v-if="loading" />

  <container v-else>
    <container-item>
      <container-item-label> Hourly activity </container-item-label>
      <tabs v-if="isMobile" v-model="timePeriod">
        <tab name="am">AM</tab>
        <tab name="pm">PM</tab>
      </tabs>
      <div
        class="
          flex flex-col
          lg:flex-row
          text-center text-base text-gray-400-spotify
          font-medium
          -mx-12
          -mb-4
          -mt-2
        "
      >
        <div
          v-if="!isMobile || (isMobile && timePeriod === 'am')"
          class="flex-shrink-0"
        >
          <span v-show="!isMobile">AM</span>
          <apexchart
            type="polarArea"
            :options="chartOptions"
            :series="activityHours.AM"
          ></apexchart>
        </div>
        <div
          v-if="!isMobile || (isMobile && timePeriod === 'pm')"
          class="flex-shrink-0"
        >
          <span v-show="!isMobile">PM</span>
          <apexchart
            type="polarArea"
            :options="chartOptions"
            :series="activityHours.PM"
          ></apexchart>
        </div>
      </div>
    </container-item>
  </container>
</template>

<script>
import activityHoursChart from "@/mixins/activityHoursChart";
import { mapState, mapActions } from "vuex";
import Container from "@/components/Container.vue";
import ContainerItem from "@/components/ContainerItem.vue";
import ContainerItemLabel from "@/components/ContainerItemLabel.vue";
import VueApexCharts from "vue3-apexcharts";
import Tabs from "@/components/Tabs.vue";
import Tab from "@/components/Tab.vue";

export default {
  components: {
    Container,
    ContainerItem,
    ContainerItemLabel,
    Tabs,
    Tab,
    apexchart: VueApexCharts,
  },
  mixins: [activityHoursChart],
  data() {
    return {
      timePeriod: "am",
      loading: true,
    };
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile.profile,
      reports: (state) => state.profile.reports,
    }),
    activityHours() {
      const activity = this.reports.hourlyActivity.map((item) => item.plays);
      const hourOffset = new Date().getTimezoneOffset() / 60;
      if (hourOffset < 0) {
        const shift = activity.splice(hourOffset, Math.abs(hourOffset));
        activity.unshift(...shift);
      } else {
        const shift = activity.splice(0, hourOffset);
        activity.push(...shift);
      }
      return {
        AM: activity.slice(0, 12),
        PM: activity.slice(12),
      };
    },
  },
  async mounted() {
    try {
      this.loading = true;
      await this.getReports();
    } catch (error) {
      console.log(error);
      this.$router.push({ name: "home" });
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions({
      getReports: "profile/getReports",
    }),
  },
};
</script>
