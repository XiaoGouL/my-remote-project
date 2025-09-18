import { i18n } from '@lingui/core';


export async function preloadLocales() {
  const locales = ['en', 'zh'];
  const promises = locales.map(async (locale) => {
    const { messages } = await import(`./locales/${locale}/messages.po`);
    i18n.load(locale, messages);
  });
  await Promise.all(promises);
}

// 动态加载翻译文件的函数
export async function loadLocale(locale:string) {
  try {
    // 动态导入PO文件（路径需匹配实际输出位置）
    const { messages } = await import(
      `./locales/${locale}/messages.po`
    );
    i18n.load(locale, messages);
    i18n.activate(locale);
    localStorage.setItem('userLocale', locale); // 持久化设置
  } catch (error) {
    console.error('语言包加载失败', error);
    // 回退到默认语言
    loadLocale('zh');
  }
}

// 设置默认语言
i18n.activate('zh');
