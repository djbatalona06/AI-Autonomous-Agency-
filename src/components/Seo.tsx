import { Helmet } from "react-helmet-async";
import { BRAND, DEFAULT_OG_IMAGE } from "@/data/brand";

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/catalog/sal" — combined with BRAND.url. */
  path: string;
  /** Additional JSON-LD objects (Organization is always included). */
  jsonLd?: Record<string, unknown>[];
  ogImage?: string;
  noindex?: boolean;
}

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: BRAND.legalName,
  alternateName: BRAND.name,
  description: BRAND.description,
  url: BRAND.url,
  logo: DEFAULT_OG_IMAGE,
  ...(BRAND.sameAs.length ? { sameAs: BRAND.sameAs } : {}),
};

export function Seo({ title, description, path, jsonLd = [], ogImage, noindex }: SeoProps) {
  const canonical = `${BRAND.url}${path}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;
  const fullTitle = title.includes(BRAND.name) ? title : `${title} — ${BRAND.name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{JSON.stringify(ORG_JSON_LD)}</script>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
