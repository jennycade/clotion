const Block = ( props ) => {
  // props
  const { enterEditingMode } = props;

  return (
    <div className="block" onClick={ enterEditingMode } >{ props.children }</div>
  );
};

export default Block;