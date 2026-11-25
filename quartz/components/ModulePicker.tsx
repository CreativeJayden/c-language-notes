import ModuleIcon from "./ModuleIcon"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"

const choices = [
  {
    id: "c",
    title: "C 语言",
    description: "从基础语法到指针、函数、链表与文件操作。",
    meta: "10 章 · 30 个主题",
    startSlug: "1.c语言基础/1.1-基本概念",
  },
  {
    id: "linux",
    title: "Linux 系统编程",
    description: "从常用工具到进程、信号和 LVGL 图形界面。",
    meta: "7 章 · 26 个主题",
    startSlug: "linux系统编程/1.linux环境与开发入门/1.1-linux与嵌入式linux",
  },
] as const

const ModulePicker: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null
  const root = pathToRoot(fileData.slug ?? ("index" as FullSlug))

  return (
    <nav
      class={[displayClass, "knowledge-module-picker"].filter(Boolean).join(" ")}
      aria-label="选择学习模块"
    >
      <p class="knowledge-module-picker__eyebrow">选择学习方向</p>
      <div class="knowledge-module-picker__grid">
        {choices.map((choice) => (
          <a
            class="knowledge-module-picker__item"
            data-knowledge-module={choice.id}
            href={joinSegments(root, `${choice.startSlug}.html`)}
          >
            <span class={`knowledge-module-picker__icon is-${choice.id}`}>
              <ModuleIcon module={choice.id} />
            </span>
            <span class="knowledge-module-picker__copy">
              <strong>{choice.title}</strong>
              <span>{choice.description}</span>
              <small>{choice.meta} · 开始学习 →</small>
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}

export default (() => ModulePicker) satisfies QuartzComponentConstructor
