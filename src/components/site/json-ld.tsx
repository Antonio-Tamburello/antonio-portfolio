/**
 * Structured data (schema.org JSON-LD) for search engines.
 *
 * `<` is escaped so that a value containing "</script>" cannot close the tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
