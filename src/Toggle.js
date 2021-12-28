import './Toggle.css';

const Toggle = (props) => {
  // props
  const { checked, onCallback, offCallback } = props;

  // handling
  const handleClick = () => {
    if (checked) {
      // toggle off
      offCallback();
    } else {
      // toggle on
      onCallback();
    }
  }

  return (
    <div className='switch' onClick={handleClick}>
      <input type='checkbox' checked={checked} readonly={true} />
      <span className='slider'></span>
    </div>
  );
}

export default Toggle;