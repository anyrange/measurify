import { inject } from "vue"

export const useContentWindow = () => {
  const contentWindow = inject("contentWindow")

  const scrollToTop = () => {
    contentWindow.value.scroll({ top: 0, left: 0 })
  }

  return {
    scrollToTop,
  }
}
