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

  return {
    unwrapParagraphs,
  };
}

export default BlockHandler;