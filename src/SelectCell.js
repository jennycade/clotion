const SelectCell = (props) => {
  // props
  const { display } = props;

  return (
    <div>
      { props.children }
    </div>
  );
};

export default SelectCell;