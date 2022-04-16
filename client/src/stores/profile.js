import { defineStore } from "pinia";
import { ref, computed } from "vue";
import dayjs from "@/dayjs";

const defaultRange = {
  week: {
    firstDate: dayjs().weekday(-6).format("YYYY-MM-DD"),
    lastDate: dayjs().weekday(0).format("YYYY-MM-DD"),
  },
  month: {
    firstDate: dayjs()
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD"),
    lastDate: dayjs().subtract(1, "months").endOf("month").format("YYYY-MM-DD"),
  },
  year: {
    firstDate: dayjs()
      .subtract(1, "years")
      .startOf("year")
      .format("YYYY-MM-DD"),
    lastDate: dayjs().subtract(1, "years").endOf("year").format("YYYY-MM-DD"),
  },
};

export const useProfileStore = defineStore("profile", () => {
  const profile = ref(null);

  const dateRanges = computed(() => ({
    ...defaultRange,
    overall: {
      firstDate: dayjs(profile.value?.user?.registrationDate).format(
        "YYYY-MM-DD"
      ),
      lastDate: dayjs().format("YYYY-MM-DD"),
    },
  }));

  return {
    profile,
    dateRanges,
  };
});
