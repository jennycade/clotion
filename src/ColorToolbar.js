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
      { COLORNAMES.map((colorName) => {
        return (
          <div
            className="color"
            onMouseDown={ (event) => handleClick(event, 'color', colorName) }
          >
            <p>{ `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)}` }</p>
          </div>
        );
      }) }
      { COLORNAMES.map((colorName) => {
        return (
          <div
            className="color"
            onMouseDown={ (event) => handleClick(event, 'bgColor', colorName) }
          >
            <p>{ `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)} background` }</p>
          </div>
        );
      }) }
    </div>
  );
}

export default ColorToolbar;