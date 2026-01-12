export function createServiceSchema(params: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  providerName?: string;
}) {
  const { name, description, url, image, category = 'MedicalProcedure', providerName = "Dr V Hair Clinic" } = params;
  return {
    '@context': 'https://schema.org',
    '@type': category,
    name,
    description,
    url,
    image,
    provider: {
      '@type': 'MedicalBusiness',
      name: providerName,
      url: new URL('/', url).toString()
    }
  };
}

export function createBreadcrumbList(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: it.name,
      item: it.url
    }))
  };
}
