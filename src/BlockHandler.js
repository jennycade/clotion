let showdown = require('showdown');
const converter = new showdown.Converter();

const BlockHandler = () => {
  
  const unwrapParagraphs = ( html ) => {
    const dummy = document.createElement( 'html' );
    dummy.innerHTML = `<html><head><title>titleTest</title></head><body>${html}</body></html>`;

    const pNodes = dummy.getElementsByTagName( 'p' ); // Live NodeList of your anchor elements

    const paragraphs = [];
    for (let i = 0; i < pNodes.length; i++) {
      paragraphs.push(pNodes[i].innerHTML);
    }

    return paragraphs;
  }

  const concatenate = ( textArr ) => {
    return textArr.join('\n');
  }


  const htmlToHtml = ( html ) => {
    // html -> text
    const unwrapped = unwrapParagraphs(html);

    // text array -> text block
    const block = concatenate(unwrapped);

    // // text -> markdown
    // const md = converter.makeMarkdown(block);

    // md -> html
    const finalHtml = converter.makeHtml(block);

    return finalHtml;
  }

  return {
    unwrapParagraphs,
    concatenate,
    htmlToHtml,
  };
}

export default BlockHandler;