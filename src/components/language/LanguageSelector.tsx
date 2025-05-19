
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select, { Option } from '@/design-system/components/Select';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const options: Option[] = languages.map((lang) => ({
    value: lang.code,
    label: `${lang.flag} ${lang.name}`,
  }));

  return (
    <Select
      options={options}
      value={i18n.language}
      onChange={(value) => i18n.changeLanguage(value)}
      placeholder="Language"
    />
  );
};

export default LanguageSelector;