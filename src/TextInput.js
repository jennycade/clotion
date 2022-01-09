import { useState } from 'react';

import './TextInput.css';

const TextInput = (props) => {
  // props
  const { initialVal, updateVal, liveUpdate } = props;

  // state
  const [currentVal, setCurrentVal ] = useState(initialVal);
  const [showSubmit, setShowSubmit ] = useState(false);

  // handling
  const handleChange = (event) => {
    // liveUpdate -> send through immediately
    if (liveUpdate) {
      updateVal(event.target.value);
    } else if (!showSubmit) {
      setShowSubmit(true);
    }
    // update state
    setCurrentVal(event.target.value);
  }

  const handleSubmit = () => {
    // send it through
    updateVal(currentVal);
    // hide submit instructions
    setShowSubmit(false);
  }

  const handleKeyDown = (event) => {
    // submit on enter
    const key = event.key;
    if (key === 'Enter' || key === 'Return') {
      handleSubmit();
    }
  }

  return (
    <div className='container'>
      <input type='text'
        value={currentVal}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleSubmit}
      />
      { showSubmit &&
        <p className='inputInstructions'>
          Press Enter to update, Escape to cancel
        </p>
      }
    </div>
  )
}

export default TextInput;