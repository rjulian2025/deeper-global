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

/** QAPage wrapper for single-question answer pages. */
export function qaPageNode({
  pageUrl,
  pageId,
  question,
  answer,
  questionId,
  answerId,
}: {
  pageUrl: string;
  pageId: string;
  question: string;
  answer: string;
  questionId: string;
  answerId: string;
}) {
  return {
    '@type': 'QAPage',
    '@id': pageId,
    url: pageUrl,
    mainEntity: {
      '@type': 'Question',
      '@id': questionId,
      name: question,
      text: question,
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': answerId,
        text: answer,
      },
    },
  };
}
