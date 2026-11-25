# 知识库

按课程顺序整理的 C 语言与 Linux 系统编程公开知识库，使用 Quartz 生成静态网站，并通过 GitHub Pages 发布。

简短网址：<https://CreativeJayden.github.io/>

原发布地址：<https://CreativeJayden.github.io/c-language-notes/>

## 内容

- C 语言：10 章、30 个主题页
- Linux 系统编程：7 章、26 个主题页
- 课件中的核心知识与示例
- 学习过程中补充的 C 语言问题“注意点”
- 7 个示例代码和 1 份学生信息 CSV

首页先选择学习模块。进入模块后，左侧显示当前模块目录，右侧可切换模块，正文顶部和底部都提供上一页、下一页。

课程 PDF、Word 参考文档和本地文件路径不会进入网站或公开仓库。

## 本地构建

```bash
npm ci
npx quartz plugin install
npx quartz build
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布网站。
