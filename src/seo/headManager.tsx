import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface HeadTagsProps {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogImage?: string;
  url?: string;
  jsonLd?: object | object[];
}

const HeadTags: React.FC<HeadTagsProps> = ({ title, description, canonical, robots = 'index,follow', ogImage, url, jsonLd }) => {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots && <meta name="robots" content={robots} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD */}
      {jsonLdString && (
        <script type="application/ld+json">{jsonLdString}</script>
      )}
    </Helmet>
  );
};

export default HeadTags;
