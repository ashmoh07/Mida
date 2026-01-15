
export enum Language {
  EN = 'en',
  AR = 'ar'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum View {
  HOME = 'home',
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
  SETTINGS = 'settings',
  ABOUT = 'about'
}

export interface TranslationStrings {
  appName: string;
  encrypt: string;
  decrypt: string;
  settings: string;
  carrierImage: string;
  secretFile: string;
  password: string;
  passwordHint: string;
  process: string;
  selectImage: string;
  selectFile: string;
  language: string;
  theme: string;
  errorInvalidPassword: string;
  errorNoImage: string;
  errorNoFile: string;
  success: string;
  download: string;
  back: string;
  aboutUs: string;
  finish: string;
  midaHukTitle: string;
  midaHukDescription: string;
  trainingTitle: string;
  trainingDesc: string;
  expertiseTitle: string;
  expertiseDesc: string;
  innovationTitle: string;
  innovationDesc: string;
}
