import BlockHandler from './BlockHandler';

// unwrapParagraphs()
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

// concatenate()
test(`Concatenates multiple paragraphs`, () => {
  const bh = BlockHandler();

  const html = '<p>Paragraph 1</p><p>Paragraph 2</p>';
  const unwrapped = bh.unwrapParagraphs(html);
  const block = bh.concatenate(unwrapped);

  expect(block).toEqual('Paragraph 1\nParagraph 2'); 
});

// htmlToHtml()
test(`Converts typed list (one element) into an html list`, () => {
  const bh = BlockHandler();

  const html = '<p>1. list item 1</p>';
  const processed = bh.htmlToHtml(html);

  expect(processed).toEqual('<ol>\n<li>list item 1</li>\n</ol>');
});

test(`Converts typed list (two elements) into an html list`, () => {
  const bh = BlockHandler();

  const html = '<p>1. list item 1</p>\n<p>2. list item 2</p>';
  const processed = bh.htmlToHtml(html);

  expect(processed).toEqual('<ol>\n<li>list item 1</li>\n<li>list item 2</li>\n</ol>');
});

test(`Converts mixed processed + unprocessed html to final html`, () => {
  const bh = BlockHandler();

  const html = '<ol>\n<li>list item 1</li>\n<li>list item 2</li>\n</ol><p>3. list item 3</p>';
  const processed = bh.htmlToHtml(html);

  expect(processed).toEqual('<ol>\n<li>list item 1</li>\n<li>list item 2</li>\n<li>list item 3</li>\n</ol>');
});