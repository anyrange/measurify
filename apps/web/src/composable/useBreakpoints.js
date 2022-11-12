import { useBreakpoints as useVueUseBreakpoints } from "@vueuse/core"
import { BREAKPOINTS } from "@/config"

export function useBreakpoints() {
  const breakpoints = useVueUseBreakpoints(BREAKPOINTS)

  const xlAndLarger = breakpoints.greater("xl")
  const smallerThanMd = breakpoints.smaller("md")

  return { breakpoints, xlAndLarger, smallerThanMd }
}
