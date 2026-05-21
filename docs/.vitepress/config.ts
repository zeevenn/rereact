import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ReReact',
  description: '从零实现 React — 学习笔记',
  lang: 'zh-CN',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '笔记', link: '/notes/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
          ],
        },
        {
          text: '架构',
          items: [
            { text: 'Fiber', link: '/guide/fiber' },
          ],
        },
      ],
      '/notes/': [
        {
          text: '笔记',
          items: [
            { text: '概览', link: '/notes/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zeevenn/rereact' },
    ],

    outline: {
      label: '目录',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
})
