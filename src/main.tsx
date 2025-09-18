import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { loadLocale, preloadLocales } from './i18n';
import App from './App.tsx'


// 初始化时加载持久化的语言或默认语言
const savedLocale = localStorage.getItem('userLocale') || navigator.language.split('-')[0] || 'zh';
preloadLocales().then(() => {
    loadLocale(savedLocale).then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <App />
        </I18nProvider>
      </StrictMode>
    )
  })
})
