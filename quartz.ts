import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import Flex from "./quartz/components/Flex"
import KnowledgeNavigator from "./quartz/components/KnowledgeNavigator"
import ModulePicker from "./quartz/components/ModulePicker"
import ModuleSwitcher from "./quartz/components/ModuleSwitcher"
import SkinSwitcher from "./quartz/components/SkinSwitcher"

const config = await loadQuartzConfig()
export default config

const baseLayout = await loadQuartzLayout()
const defaults = baseLayout.defaults
const left = [...(defaults.left ?? [])]
const right = [...(defaults.right ?? [])]
const header = [...(defaults.header ?? [])]
const beforeBody = [...(defaults.beforeBody ?? [])]
const resourceText = (resource: unknown) =>
  Array.isArray(resource) ? resource.join("\n") : typeof resource === "string" ? resource : ""
const toolbarIndex = header.findIndex((component) =>
  resourceText(component.beforeDOMLoaded).includes("darkmode"),
)

if (toolbarIndex >= 0) {
  const toolbar = header[toolbarIndex]
  header[toolbarIndex] = Flex({
    components: [
      { Component: toolbar, grow: true, shrink: true, basis: "auto" },
      { Component: SkinSwitcher(), grow: false, shrink: false, basis: "auto" },
    ],
    direction: "row",
    wrap: "wrap",
    gap: "0.5rem",
  }) as typeof toolbar
}

header.push(ModuleSwitcher({ compact: true }))
right.unshift(ModuleSwitcher({ compact: false }))
beforeBody.unshift(ModulePicker())
beforeBody.unshift(KnowledgeNavigator())

export const layout = await loadQuartzLayout({
  defaults: {
    ...defaults,
    header,
    left,
    right,
    beforeBody,
  },
})
