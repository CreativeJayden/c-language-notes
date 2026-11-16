import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import Flex from "./quartz/components/Flex"
import SkinSwitcher from "./quartz/components/SkinSwitcher"

const config = await loadQuartzConfig()
export default config

const baseLayout = await loadQuartzLayout()
const left = [...(baseLayout.defaults.left ?? [])]
const resourceText = (resource: unknown) =>
  Array.isArray(resource) ? resource.join("\n") : typeof resource === "string" ? resource : ""
const toolbarIndex = left.findIndex((component) =>
  resourceText(component.beforeDOMLoaded).includes("darkmode"),
)

if (toolbarIndex >= 0) {
  const toolbar = left[toolbarIndex]
  left[toolbarIndex] = Flex({
    components: [
      { Component: toolbar, grow: true, shrink: true, basis: "auto" },
      { Component: SkinSwitcher(), grow: false, shrink: false, basis: "auto" },
    ],
    direction: "row",
    wrap: "wrap",
    gap: "0.5rem",
  }) as typeof toolbar
}

export const layout = await loadQuartzLayout({
  defaults: {
    left,
  },
})
