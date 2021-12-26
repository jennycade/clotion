import './Menu.css';

const Menu = (props) => {
  // props
  const { menuItems, choose } = props;

  // arr menuItems = [
  // 	{
  //    id,
  // 		displayText,
  // 		onChoose, // or use choose(id) if not defined
  // 		category // optional (currently not used)
  // 	},
  // 	...
  // ]

  // categories?
  // let categories;

  // if (menuItems.length > 0 && Object.keys(menuItems[0]).includes('category')) {
  //   // get all categories
  //   categories = menuItems.map(item => item.category);
  //   // remove duplicates
  //   categories = [...new Set(categories)];
  // }

  return (
    <ul className='menu'>
      {
        menuItems.map(item => (
          <li
            key={item.id}
            className={ !!item.displayIcon ? 'grid' : ''}
            onClick={ !!item.onChoose ? item.onChoose : () => choose(item.id)}
          >
            {!! item.displayIcon && 
              <span className='icon'>
                {item.displayIcon}
              </span>
            }
            {
              <span>
                {item.displayText}
              </span>
            }
          </li>
        ))
      }
    </ul>
  )
}

export default Menu;