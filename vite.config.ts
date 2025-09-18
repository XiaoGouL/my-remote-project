import { defineConfig } from 'vite';
import { ProxyAgent } from 'proxy-agent';
import type { ProxyAgentOptions } from 'proxy-agent';
import react from '@vitejs/plugin-react'; // 确保使用Babel版插件
import {lingui} from '@lingui/vite-plugin'
import path from 'path'

export default defineConfig({
  server: {
    proxy: {
      '/binance': {
        target: 'https://api.binance.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/binance/, ''),
        agent: new ProxyAgent((process.env.HTTP_PROXY || process.env.HTTPS_PROXY) as ProxyAgentOptions)
      }
    }
  },
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro']
      }
    }),
    lingui()
  ], // 仅保留标准插件
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.versions': {
      node: '22.18.0' // 替换为您的实际Node.js版本
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      path: 'path-browserify'
    }
  }
});