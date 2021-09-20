import BlockHandler from './BlockHandler';

test(`Unwraps a single paragraph`, () => {
  const bh = BlockHandler();

  const html = '<p>Paragraph</p>';
  const unwrapped = bh.unwrapParagraphs(html);

  expect(unwrapped).toEqual(['Paragraph']);
});

test(`Unwraps two paragraphs`, () => {
  const bh = BlockHandler();

  const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
  const unwrapped = bh.unwrapParagraphs(html);

  expect(unwrapped).toEqual(['Paragraph 1', 'Paragraph 2']);
});