import type { Metadata } from 'next';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
  DocsCategory
} from 'fumadocs-ui/page';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { notFound } from 'next/navigation';
import { createMetadata } from '@/utils/metadata';
import { getDocsPage, getDocsPages, type Page, loaderOutput } from '@/utils/docs-loader';
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { cn } from "@/utils/cn";
import {
  CodeBlock,
  type CodeBlockProps,
  Pre,
} from "fumadocs-ui/components/codeblock";
import { BadgeCheck } from "lucide-react";
import Mermaid from "@/components/mermaid";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = getDocsPage(params.slug);
  if (!page) notFound();

  const path = `content/docs/${page.file.path}`;
  const { body: MDX, toc, lastModified } = await page.data.load();

  return (
    <DocsPage 
      toc={toc}
      lastUpdate={lastModified}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      editOnGithub={{
        repo: 'avalanche-docs',
        owner: 'ava-labs',
        sha: 'main',
        path,
      }}
      article={{
        className: 'max-sm:pb-16',
      }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="text-fd-foreground/80">
        <MDX components={{BadgeCheck, Cards, Card, Accordion, Accordions, Mermaid, Step, Steps, Callout, Tab, Tabs, TypeTable,
              pre: ({ title, className, icon, allowCopy, ...props }: CodeBlockProps) => (
                <CodeBlock title={title} icon={icon} allowCopy={allowCopy}>
                  <Pre className={cn("max-h-[1200px]", className)} {...props} />
                </CodeBlock>
              ),
        }}/>
        {page.data.index ? <DocsCategory page={page} from={loaderOutput} /> : null}
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return getDocsPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getDocsPage(params.slug);

  if (!page) notFound();

  const description =
    page.data.description ?? 'Developer documentation for everything related to the Avalanche ecosystem.';

  const imageParams = new URLSearchParams();
  imageParams.set('title', page.data.title);
  imageParams.set('description', description);

  const image = {
    alt: 'Banner',
    url: `/api/og/${params.slug[0]}?${imageParams.toString()}`,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: image,
    },
    twitter: {
      images: image,
    },
  });
}
