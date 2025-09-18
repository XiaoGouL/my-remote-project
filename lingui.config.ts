import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en', // 源语言
  locales: ['zh', 'en'], // 支持语言列表
  catalogs: [
    {
      path: 'src/locales/{locale}/messages', // 翻译文件路径
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: 'po', // 使用PO格式
  compileNamespace: 'es'
});