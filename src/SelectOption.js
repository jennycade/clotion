import './SelectOption.css';

import { getColorCode } from './helpers';

const SelectOption = (props) => {
  // props
  const { color } = props;

  if (props.remove) {

  }

  const style = {
    backgroundColor: getColorCode(color, 'bgColor'),
  }

  return (
    <span className='selectOption' style={style}>
      { props.children }
      { !!props.remove &&
      <span onClick={ props.remove } className='closeX'>
        ×
      </span>
      }
    </span>
  );
}

export default SelectOption;