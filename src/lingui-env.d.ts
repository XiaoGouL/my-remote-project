import '@lingui/core';
import '@lingui/react';

declare module '@lingui/core' {
  interface Catalogs {
    zh: { [key: string]: string };
    en: { [key: string]: string };
  }
}