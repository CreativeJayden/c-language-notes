# C语言知识库

按课程顺序整理的 C 语言公开笔记与示例代码，使用 Quartz 生成静态网站，并通过 GitHub Pages 发布。

在线访问：<https://CreativeJayden.github.io/c-language-notes/>

## 内容

- 10 章、30 个主题页
- 课件中的核心知识与示例
- 学习过程中补充的 C 语言问题“注意点”
- 7 个示例代码和 1 份学生信息 CSV

课程 PDF、Word 参考文档和本地文件路径不会进入网站或公开仓库。

## 本地构建

```bash
npm ci
npx quartz plugin install
npx quartz build
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布网站。
