import { createMDXSource } from 'fumadocs-mdx';
import type { InferMetaType, InferPageType } from 'fumadocs-core/source';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { IconContainer } from '@/components/ui/icon';
import { createElement } from 'react';
import { meta, docs } from '@/.source';

export const loaderOutput = loader({
  baseUrl: '/docs',
  icon(icon) {
    if (icon && icon in icons)
      return createElement('div', {}, createElement(IconContainer, {
        icon: icons[icon as keyof typeof icons],
      }));
  },
  source: createMDXSource(docs, meta),
});

export type Page = InferPageType<typeof loaderOutput>;
export type Meta = InferMetaType<typeof loaderOutput>;
export const { getPage: getDocsPage, getPages: getDocsPages, pageTree: docsPageTree } = loaderOutput;