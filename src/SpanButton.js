const SpanButton = (props) => {
  // props
  const { mark, isMarkActive, handleMouseDown } = props;

  return (
    <button
      className={ `${mark}Button${ isMarkActive(mark) ? ' activeMark' : '' }` }
      onMouseDown={ (event) => handleMouseDown(event, mark) }
    >
      {props.children}
    </button>
  );
}

export default SpanButton;