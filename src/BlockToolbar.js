import './BlockToolbar.css';

const blockMenu = [
  {
    displayName: 'Text',
    type: 'paragraph',
    description: 'Just start writing with plain text.',
  },
  {
    displayName: 'Page', ////////////////////////////////////// TODO
    type: 'page',
    description: 'Embed a sub-page inside this page.',
  },
  {
    displayName: 'Heading 1',
    type: 'h1',
    description: 'Big section heading.',
  },
  {
    displayName: 'Heading 2',
    type: 'h2',
    description: 'Medium section heading.',
  },
  {
    displayName: 'Heading 3',
    type: 'h3',
    description: 'Small section heading.',
  },
  {
    displayName: 'Bulleted list',
    type: 'bulletList',
    description: 'Create a simple bulleted list.',
  },
  {
    displayName: 'Numbered list',
    type: 'orderedList',
    description: 'Create a list with numbering.',
  },
  {
    displayName: 'Divider', ////////////////////////////////////// TODO
    type: 'divider',
    description: 'Visually divide blocks',
  },
  {
    displayName: 'Callout', ////////////////////////////////////// TODO
    type: 'callout',
    description: 'Make writing stand out.',
  },
];

const BlockToolbar = (props) => {
  // props
  const { chooseBlock } = props;

  // click
  const handleClick = (event, blockType) => {
    event.preventDefault();
    chooseBlock(blockType);
  }

  return (
    <div className="blockToolbar">
      { blockMenu.map((block) => {
        return (
          <div className="blockType"
            onMouseDown={ (event) => handleClick(event, block.type) }
          >
            <h2>{ block.displayName }</h2>
            <p>{ block.description }</p>
          </div>
        );
      }) }
    </div>
  );
}

export default BlockToolbar;