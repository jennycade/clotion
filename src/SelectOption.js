import './SelectOption.css';

import { getColorCode } from './helpers';

const SelectOption = (props) => {
  // props
  const { color } = props;

  const style = {
    backgroundColor: getColorCode(color, 'bgColor'),
  }

  return (
    <span className='selectOption' style={style}>
      { props.children }
    </span>
  );
}

export default SelectOption;