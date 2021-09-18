let showdown = require('showdown');
const converter = new showdown.Converter();

const Block = ( props ) => {
  // props
  const { content, updateContent } = props;

  // convert to and from md
  const displayAsHtml = () => {
    return converter.makeHtml(content);
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
    >
      { displayAsHtml() }
    </div>
  );
};

export default Block;