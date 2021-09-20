import { createMarkup } from './helpers';

let showdown = require('showdown');
const converter = new showdown.Converter();

const Block = ( props ) => {
  // props
  const { content, updateContent } = props;

  // convert to and from md
  const displayAsHtml = () => {
    const html = converter.makeHtml( content );
    return html;
  }

  // convert to md
  const saveAsMd = ( html ) => {
    const md = converter.makeMarkdown( html );
    updateContent(md);
  }

  const handleBlur = (e) => {
    saveAsMd(e.target.innerHTML);
  }

  return (
    <div
      className="block"
      contentEditable={ true }
      onBlur={ handleBlur }
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={ createMarkup(displayAsHtml())}
    >
    </div>
  );
};

export default Block;