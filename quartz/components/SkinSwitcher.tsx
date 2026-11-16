import { QuartzComponent, QuartzComponentConstructor } from "./types"

const skins = [
  { value: "notebook", label: "笔记本" },
  { value: "ink", label: "青墨" },
  { value: "slate", label: "黛蓝" },
]

const SkinSwitcher: QuartzComponent = ({ displayClass }) => {
  const className = [displayClass, "skin-switcher"].filter(Boolean).join(" ")

  return (
    <div class={className}>
      <label class="skin-switcher-label" for="knowledge-skin">
        皮肤
      </label>
      <select
        id="knowledge-skin"
        name="knowledge-skin"
        aria-label="选择阅读皮肤"
        autocomplete="off"
      >
        {skins.map((skin) => (
          <option value={skin.value}>{skin.label}</option>
        ))}
      </select>
    </div>
  )
}

SkinSwitcher.beforeDOMLoaded = `
(() => {
  const allowed = new Set(["notebook", "ink", "slate"])
  let skin = "notebook"

  try {
    const saved = localStorage.getItem("knowledge-skin")
    if (saved && allowed.has(saved)) skin = saved
  } catch {}

  document.documentElement.dataset.skin = skin
})()
`

SkinSwitcher.afterDOMLoaded = `
const skinStorageKey = "knowledge-skin"
const allowedSkins = new Set(["notebook", "ink", "slate"])

const applySkin = (skin) => {
  const next = allowedSkins.has(skin) ? skin : "notebook"
  document.documentElement.dataset.skin = next
  return next
}

const syncSkinControl = () => {
  const select = document.querySelector("#knowledge-skin")
  if (!select) return

  select.value = applySkin(document.documentElement.dataset.skin)
  if (select.dataset.bound === "true") return

  select.dataset.bound = "true"
  const onChange = () => {
    const next = applySkin(select.value)
    try {
      localStorage.setItem(skinStorageKey, next)
    } catch {}
  }

  select.addEventListener("change", onChange)
  window.addCleanup?.(() => {
    select.removeEventListener("change", onChange)
    delete select.dataset.bound
  })
}

document.addEventListener("nav", syncSkinControl)
document.addEventListener("render", syncSkinControl)

window.addEventListener("storage", (event) => {
  if (event.key !== skinStorageKey) return
  const next = applySkin(event.newValue)
  const select = document.querySelector("#knowledge-skin")
  if (select) select.value = next
})
`

export default (() => SkinSwitcher) satisfies QuartzComponentConstructor
