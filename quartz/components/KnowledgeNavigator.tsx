import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const isTopicPage = (slug: string) =>
  slug !== "index" && slug !== "404" && !slug.startsWith("tags/") && !slug.endsWith("/index")

const KnowledgeNavigator: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "").toLowerCase()
  if (!isTopicPage(slug)) return null

  return (
    <nav
      class={[displayClass, "knowledge-sequence", "knowledge-sequence--top"]
        .filter(Boolean)
        .join(" ")}
      aria-label="文章翻页"
      data-knowledge-sequence="top"
    />
  )
}

KnowledgeNavigator.beforeDOMLoaded = `
(() => {
  const originalScrollIntoView = Element.prototype.scrollIntoView

  Element.prototype.scrollIntoView = function (...args) {
    if (!(this instanceof Element) || !this.closest(".explorer")) {
      return originalScrollIntoView.apply(this, args)
    }

    const scroller = this.closest(".explorer-content")
    if (!(scroller instanceof HTMLElement)) return

    const itemRect = this.getBoundingClientRect()
    const scrollerRect = scroller.getBoundingClientRect()
    if (itemRect.top < scrollerRect.top || itemRect.bottom > scrollerRect.bottom) {
      scroller.scrollTop += itemRect.top - scrollerRect.top - scroller.clientHeight / 2
    }
  }
})()
`

KnowledgeNavigator.afterDOMLoaded = `
(() => {
  const sequenceRuntimeKey = "__knowledgeSequenceRuntime"
  if (window[sequenceRuntimeKey]) return
  window[sequenceRuntimeKey] = true

  const isTopicSlug = (slug) =>
    Boolean(slug) &&
    slug !== "index" &&
    slug !== "404" &&
    !slug.startsWith("tags/") &&
    !slug.endsWith("/index")

  const moduleForSlug = (slug) => {
    const normalized = slug.toLowerCase()
    if (normalized.startsWith("linux系统编程/")) return "linux"
    if (/^\\d+\\./.test(normalized.split("/")[0] || "")) return "c"
    return undefined
  }

  const moduleRank = (slug) => {
    const module = moduleForSlug(slug)
    if (module === "c") return 0
    if (module === "linux") return 1
    return 2
  }

  let indexPromise
  let activeModuleForExplorer
  const observedExplorers = new WeakSet()

  const getSequenceIndex = async () => {
    if (!indexPromise) {
      const staticRoot = window.quartzStaticUrl
        ? new URL(window.quartzStaticUrl)
        : new URL("static/", window.location.href)
      indexPromise = fetch(new URL("contentIndex.json", staticRoot))
        .then((response) => {
          if (!response.ok) throw new Error("HTTP " + response.status)
          return response.json()
        })
        .then((payload) => {
          if (payload && payload.content && typeof payload.content === "object") {
            return payload.content
          }
          return payload
        })
        .catch(() => ({}))
    }
    return indexPromise
  }

  const getPageSlug = () =>
    (document.body?.dataset.slug || "").toLowerCase()

  const syncActiveModule = () => {
    const slug = getPageSlug()
    const fromSlug = moduleForSlug(slug)
    const decodedHash = decodeURIComponent(window.location.hash).toLowerCase()
    const fromHash = decodedHash.includes("linux")
      ? "linux"
      : decodedHash.includes("c语言")
        ? "c"
        : undefined
    const isHome = slug === "index"
    const activeModule = fromSlug || (isHome ? fromHash : undefined)
    activeModuleForExplorer = activeModule

    document.body.classList.toggle("knowledge-home", isHome)
    if (isHome) syncHomeModule(activeModule)

    document.querySelectorAll("[data-knowledge-module]").forEach((link) => {
      const isActive = link.dataset.knowledgeModule === activeModule
      link.classList.toggle("is-active", isActive)
      if (isActive) {
        link.setAttribute("aria-current", "location")
      } else {
        link.removeAttribute("aria-current")
      }
    })

    filterExplorer()
  }

  const syncHomeModule = (activeModule) => {
    document.body.dataset.homeModule = activeModule || ""

    const picker = document.querySelector(".knowledge-module-picker")
    if (picker instanceof HTMLElement) picker.hidden = Boolean(activeModule)

    const markdown = document.querySelector(".center > article .markdown-rendered")
    if (!(markdown instanceof HTMLElement)) return

    let currentModule
    Array.from(markdown.children).forEach((child) => {
      if (child instanceof HTMLElement && ["c语言", "linux系统编程"].includes(child.id)) {
        currentModule = child.id === "c语言" ? "c" : "linux"
      }

      if (!currentModule) {
        child.hidden = false
        return
      }

      child.hidden = !activeModule || currentModule !== activeModule
    })
  }

  const filterExplorer = () => {
    const list = document.querySelector(".explorer-content #list-0")
    if (!(list instanceof HTMLElement)) return

    Array.from(list.children).forEach((item) => {
      if (!(item instanceof HTMLElement)) return
      const folder = item.querySelector("[data-folderpath]")
      if (!(folder instanceof HTMLElement)) return

      const path = (folder.dataset.folderpath || "").toLowerCase()
      const itemModule = path.startsWith("linux系统编程/")
        ? "linux"
        : /^\\d+\\./.test(path.split("/")[0] || "")
          ? "c"
          : undefined

      item.hidden =
        Boolean(activeModuleForExplorer) &&
        Boolean(itemModule) &&
        itemModule !== activeModuleForExplorer
    })
  }

  const observeExplorer = () => {
    const explorer = document.querySelector(".explorer-content")
    if (!(explorer instanceof HTMLElement) || observedExplorers.has(explorer)) return

    observedExplorers.add(explorer)
    new MutationObserver(filterExplorer).observe(explorer, {
      childList: true,
      subtree: true,
    })
    filterExplorer()
  }

  const markLegacyNavigation = () => {
    document.querySelectorAll("article table").forEach((table) => {
      const text = table.textContent || ""
      if (!text.includes("上一页：") && !text.includes("下一页：")) return
      const wrapper = table.closest(".table-container") || table
      wrapper.classList.add("legacy-sequence-nav")
    })
  }

  const createSide = (direction, page) => {
    const label = direction === "previous" ? "上一页" : "下一页"
    const arrow = direction === "previous" ? "←" : "→"

    if (!page) {
      const empty = document.createElement("span")
      empty.className = "knowledge-sequence__item knowledge-sequence__item--empty"
      empty.setAttribute("aria-disabled", "true")
      empty.textContent =
        direction === "previous" ? "已经是第一篇" : "已经是最后一篇"
      return empty
    }

    const link = document.createElement("a")
    link.className = "knowledge-sequence__item"
    link.dataset.direction = direction

    const labelNode = document.createElement("span")
    labelNode.className = "knowledge-sequence__label"
    labelNode.textContent = direction === "previous" ? arrow + " " + label : label + " " + arrow

    const titleNode = document.createElement("strong")
    titleNode.className = "knowledge-sequence__title"
    titleNode.textContent = page.title || page.slug

    const basePath = (document.body?.dataset.basepath || "").replace(/\\/$/, "")
    link.href = basePath + "/" + page.slug + ".html"
    link.append(labelNode, titleNode)
    return link
  }

  const renderSequence = async () => {
    const top = document.querySelector('[data-knowledge-sequence="top"]')
    const slug = getPageSlug()
    if (!top || !isTopicSlug(slug)) return

    const index = await getSequenceIndex()
    const pages = Object.entries(index)
      .filter(([entrySlug]) => isTopicSlug(entrySlug))
      .map(([entrySlug, page]) => ({
        slug: entrySlug,
        title: page && typeof page.title === "string" ? page.title : entrySlug,
      }))
      .sort((left, right) => {
        const rankDifference = moduleRank(left.slug) - moduleRank(right.slug)
        if (rankDifference !== 0) return rankDifference
        return left.slug.localeCompare(right.slug, "zh-CN", {
          numeric: true,
          sensitivity: "base",
        })
      })

    const currentIndex = pages.findIndex((page) => page.slug === slug)
    if (currentIndex < 0) return

    let bottom = document.querySelector('[data-knowledge-sequence="bottom"]')
    if (!bottom) {
      bottom = document.createElement("nav")
      bottom.className = "knowledge-sequence knowledge-sequence--bottom"
      bottom.setAttribute("aria-label", "文章翻页")
      bottom.dataset.knowledgeSequence = "bottom"
      const footer = document.querySelector(".center > .page-footer")
      if (footer) footer.prepend(bottom)
    }

    const previous = pages[currentIndex - 1]
    const next = pages[currentIndex + 1]
    const update = (nav) => {
      if (!(nav instanceof HTMLElement)) return
      nav.replaceChildren(createSide("previous", previous), createSide("next", next))
    }

    update(top)
    update(bottom)
    markLegacyNavigation()
    document.body.classList.add("knowledge-sequence-ready")
  }

  const run = () => {
    syncActiveModule()
    observeExplorer()
    void renderSequence()
  }

  document.addEventListener("nav", run)
  document.addEventListener("render", run)
  document.addEventListener("click", (event) => {
    const target = event.target
    if (target instanceof Element && target.closest("[data-knowledge-module]")) {
      window.setTimeout(syncActiveModule, 0)
    }
  })
  window.addEventListener("hashchange", syncActiveModule)
  window.addEventListener("popstate", syncActiveModule)
  run()
})()
`

export default (() => KnowledgeNavigator) satisfies QuartzComponentConstructor
