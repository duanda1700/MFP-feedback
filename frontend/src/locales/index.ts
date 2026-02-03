import { createI18n } from 'vue-i18n';
import enUS from './langs/en-US';
import zhCN from './langs/zh-CN';

// 语言资源
const messages = {
  'en-US': enUS,
  'zh-CN': zhCN
};

// 获取当前语言
const getCurrentLanguage = (): string => {
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage) {
    return storedLanguage;
  }
  
  // 从浏览器获取语言
  const browserLanguage = navigator.language;
  const supportedLanguages = Object.keys(messages);
  
  for (const lang of supportedLanguages) {
    if (browserLanguage.includes(lang.split('-')[0])) {
      return lang;
    }
  }
  
  // 默认语言
  return 'zh-CN';
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: getCurrentLanguage(),
  fallbackLocale: 'zh-CN',
  messages
});

export default i18n;
export { getCurrentLanguage };
