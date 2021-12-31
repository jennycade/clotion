import { useState } from 'react';

const TextInput = (props) => {
  // props
  const { initialVal, updateVal } = props;

  // state
  const [currentVal, setCurrentVal ] = useState(initialVal);

  // handling
  const handleChange = (event) => {
    // update state
    setCurrentVal(event.target.value);
  }

  const handleSubmit = () => {
    // send it through
    updateVal(currentVal);
  }

  const handleKeyDown = (event) => {
    // submit on enter
    const key = event.key;
    if (key === 'Enter' || key === 'Return') {
      handleSubmit();
    }
  }

  return (
    <input type='text'
      value={currentVal}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
    />
  )
}

export default TextInput;