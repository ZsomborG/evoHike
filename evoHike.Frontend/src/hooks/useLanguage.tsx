import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import huFlag from '../assets/flags/hu-HU.svg';
import ukFlag from '../assets/flags/en-GB.svg';

export const LANGUAGE_OPTIONS = [
  {
    code: 'hu-HU',
    label: 'Hungarian',
    short: 'HU',
    flagSource: huFlag,
  },
  {
    code: 'en-GB',
    label: 'English',
    short: 'EN',
    flagSource: ukFlag,
  },
];

export type LanguageOptions = (typeof LANGUAGE_OPTIONS)[number];
export type LanguageCode = LanguageOptions['code'];

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentOption =
    LANGUAGE_OPTIONS.find((option) => option.code === i18n.language) ??
    LANGUAGE_OPTIONS[0];

  const changeLanguage = useCallback(
    (language: LanguageCode) => i18n.changeLanguage(language),
    [i18n],
  );

  return {
    options: LANGUAGE_OPTIONS,
    currentOption,
    changeLanguage,
  };
}
