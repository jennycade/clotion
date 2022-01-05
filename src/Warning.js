import './Warning.css';

const Warning = (props) => {
  // props
  const { text, continueText, continueFunction, cancelText, cancelFunction } = props;

  return (
    <div className='warningWrapper'
    >
      <div className='warningDialog'>
        <p>{ text }</p>
        <button onClick={ continueFunction }>{ continueText }</button>
        <button onClick={ cancelFunction } className='cancelButton'>{ cancelText }</button>
      </div>
    </div>
  );
}

export default Warning;