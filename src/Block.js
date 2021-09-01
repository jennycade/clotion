const Block = ( props ) => {
  // props
  const { enterEditingMode, content } = props;

  return (
    <div className="block" onClick={ enterEditingMode } >{ content }</div>
  );
};

export default Block;