import { I18n } from '@lingui/core';

declare global {
  interface Window {
    __lingui__: {
      i18n: I18n;
    };
  }
}

export {};