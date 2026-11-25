import ModuleIcon from "./ModuleIcon"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"

type ModuleSwitcherOptions = {
  compact?: boolean
}

const modules = [
  {
    id: "c",
    index: "01",
    title: "C 语言",
    meta: "10 章 · 30 个主题",
    startSlug: "index",
  },
  {
    id: "linux",
    index: "02",
    title: "Linux",
    meta: "7 章 · 26 个主题",
    startSlug: "linux系统编程/1.linux环境与开发入门/1.1-linux与嵌入式linux",
  },
] as const

const moduleForSlug = (slug: string) => {
  const normalized = slug.toLowerCase()
  if (normalized.startsWith("linux系统编程/")) return "linux"
  if (/^\d+\./.test(normalized.split("/")[0] ?? "")) return "c"
  return undefined
}

export default ((options: ModuleSwitcherOptions = {}) => {
  const ModuleSwitcher: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug ?? ("index" as FullSlug)
    const activeModule = moduleForSlug(slug)
    const root = pathToRoot(slug)
    const classNames = [
      displayClass,
      "knowledge-module-switch",
      options.compact ? "knowledge-module-switch--compact" : "knowledge-module-switch--wide",
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <nav class={classNames} aria-label="知识模块">
        <p class="knowledge-module-switch__eyebrow">{options.compact ? "切换模块" : "知识模块"}</p>
        <div class="knowledge-module-switch__list">
          {modules.map((module) => {
            const href = joinSegments(root, `${module.startSlug}.html`)

            return (
              <a
                class="knowledge-module-switch__item"
                data-knowledge-module={module.id}
                href={href}
                aria-current={activeModule === module.id ? "page" : undefined}
              >
                <span class="knowledge-module-switch__icon">
                  <ModuleIcon module={module.id} />
                  <span class="knowledge-module-switch__index">{module.index}</span>
                </span>
                <span class="knowledge-module-switch__title">{module.title}</span>
                <span class="knowledge-module-switch__meta">{module.meta}</span>
              </a>
            )
          })}
        </div>
        {!options.compact && (
          <p class="knowledge-module-switch__hint">选择模块，直接进入第一章。</p>
        )}
      </nav>
    )
  }

  return ModuleSwitcher
}) satisfies QuartzComponentConstructor<ModuleSwitcherOptions>
