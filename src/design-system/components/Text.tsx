import React from 'react';
import { FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, FONT_FAMILIES } from '../theme/typography';

type TextVariant = 'body' | 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'button';

type ElementType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'label';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
  h1: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    fontFamily: FONT_FAMILIES.heading,
  },
  h2: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.tight,
    fontFamily: FONT_FAMILIES.heading,
  },
  h3: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILIES.heading,
  },
  h4: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILIES.heading,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILIES.body,
  },
  body: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILIES.body,
  },
  caption: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.loose,
    fontFamily: FONT_FAMILIES.body,
  },
  button: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.normal,
    fontFamily: FONT_FAMILIES.body,
    textTransform: 'uppercase',
  },
};

const Text: React.FC<TextProps> = ({ children, variant = 'body', color, as = 'p', style = {} }) => {
  const defaultElementMap: Record<TextVariant, ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    subtitle: 'h5',
    body: 'p',
    caption: 'span',
    button: 'span',
  };

  const Element = as || defaultElementMap[variant];

  return React.createElement(
    Element,
    { style: { ...VARIANT_STYLES[variant], color, ...style } },
    children,
  );
};

export default Text;
