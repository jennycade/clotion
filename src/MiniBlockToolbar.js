import './ColorToolbar.css';

import BLOCKMENU from './blockMenu';

const MiniBlockToolbar = (props) => {
  // props
  const { chooseBlock, hideToolbar } = props;

  // selecting a block type
  const handleClick = (event, blockType) => {
    event.preventDefault();
    chooseBlock(blockType);
    hideToolbar();
  }

  return (
    <div className="colorToolbar">
      <h2>TURN INTO</h2>
      { BLOCKMENU.map((block) => {
        return (
          <div
            key={ block.type }
            className='color'
            onMouseDown={ (event) => handleClick(event, block.type) }
          >
            { block.displayName }
          </div>
        );
      }) }
    </div>
  );
}

export default MiniBlockToolbar;