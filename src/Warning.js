import './Warning.css';

const Warning = (props) => {
  // props
  const { text, continueText, continueFunction, cancelText, cancelFunction } = props;

  return (
    <div className='warningWrapper'
    >
      <div className='warningDialog'>
        { text }
        <button onClick={ continueFunction }>{ continueText }</button>
        <button onClick={ cancelFunction }>{ cancelText }</button>
      </div>
    </div>
  );
}

export default Warning;