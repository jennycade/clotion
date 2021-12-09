import './SelectOption.css';

import { getColorCode } from './helpers';

const SelectOption = (props) => {
  // props
  const { id, color } = props;

  const style = {
    backgroundColor: getColorCode(color, 'bgColor'),
  }

  return (
    <span className='selectOption' style={style}>
      { props.children }
      { !!props.remove &&
      <span onClick={ () => props.remove(id) } className='closeX'>
        ×
      </span>
      }
    </span>
  );
}

export default SelectOption;