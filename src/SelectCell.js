const SelectCell = (props) => {
  // props
  const { display } = props; // display: view or edit

  return (
    <div>
      { props.children }
    </div>
  );
};

export default SelectCell;