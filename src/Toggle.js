import './Toggle.css';

const Toggle = (props) => {
  // props
  const { checked, onCallback, offCallback, disabled } = props;

  // handling
  const handleClick = () => {
    if (!disabled) {
      if (checked) {
        // toggle off
        offCallback();
      } else {
        // toggle on
        onCallback();
      }
    }
  }

  return (
    <div className='switch' onClick={handleClick}>
      <input
        className={disabled ? 'disabled' : ''}
        type='checkbox'
        checked={checked}
        readOnly={true}
      />
      <span className='slider'></span>
    </div>
  );
}

export default Toggle;