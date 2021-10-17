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
  const { chooseColor, hideToolbar } = props;

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
            { `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)} background` }
          </div>
        );
      }) }
    </div>
  );
}

export default ColorToolbar;