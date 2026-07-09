export type QaSchemaItem = { question: string; answer: string };

export function questionEntity(item: QaSchemaItem) {
  return {
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  };
}

/**
 * QAPage wrapper for single-question answer pages. References the standalone
 * Question/Answer nodes by @id rather than re-inlining their content, so the
 * same @id is never defined twice with divergent properties in one @graph.
 */
export function qaPageNode({
  pageUrl,
  pageId,
  questionId,
  answerId,
}: {
  pageUrl: string;
  pageId: string;
  questionId: string;
  answerId: string;
}) {
  return {
    '@type': 'QAPage',
    '@id': pageId,
    url: pageUrl,
    mainEntity: {
      '@id': questionId,
    },
  };
}
