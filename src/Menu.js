import Popup from './Popup';

const Menu = (props) => {
  // props
  const { menuItems, exit } = props;

  // arr menuItems = [
  // 	{
  //    id,
  // 		displayText,
  // 		onChoose,
  // 		category // optional
  // 	},
  // 	...
  // ]

  // categories?
  let categories;

  if (menuItems.length > 0 && Object.keys(menuItems[0]).includes('category')) {
    // get all categories
    categories = menuItems.map(item => item.category);
    // remove duplicates
    categories = [...new Set(categories)];
  }

  return (
    <Popup exit={exit}>
      {
        menuItems.map(item => (
          <ul onClick={item.choose}>
            {item.displayText}
          </ul>
        ))
      }
    </Popup>
  )
}

export default Menu;