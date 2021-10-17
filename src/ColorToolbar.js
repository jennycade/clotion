import './ColorToolbar.css';

const COLORNAMES = [
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
];

const ColorToolbar = (props) => {
  // props
  const { chooseColor, hideToolbar, getColorCode } = props;

  // click
  const handleClick = (event, type, colorName) => {
    event.preventDefault();
    chooseColor(type, colorName); // TODO: Hook this up!
    hideToolbar();
  }

  return (
    <div className="colorToolbar"
    >
      <h2>COLOR</h2>
      { COLORNAMES.map((colorName) => {
        return (
          <div
            key={colorName}
            className="color"
            onMouseDown={ (event) => handleClick(event, 'color', colorName) }
          >
            { <ColorThumbnail color={ getColorCode(colorName, 'color') } backgroundColor='inherit' /> }
            { `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)}` }
          </div>
        );
      }) }

      <h2>BACKGROUND</h2>
      { COLORNAMES.map((colorName) => {
        return (
          <div
            key={colorName + 'background'}
            className="color"
            onMouseDown={ (event) => handleClick(event, 'bgColor', colorName) }
          >
            { <ColorThumbnail color='inherit' backgroundColor={ getColorCode(colorName, 'bgColor') } /> }
            { `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)} background` }
          </div>
        );
      }) }
    </div>
  );
}

const ColorThumbnail = (props) => {
  // props
  const { color, backgroundColor } = props;

  // style
  const style = {
    
    color: color,
    backgroundColor: backgroundColor,
  }

  return (
    <div className='colorThumbnail' style={style}>
      A
    </div>
  );
}

export default ColorToolbar;