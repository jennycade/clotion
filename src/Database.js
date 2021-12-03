import { Link } from 'react-router-dom';

// style
import './Database.css';

// my components
import Content from './Content';
import SelectOption from './SelectOption';
import SelectCell from './SelectCell';

const Database = (props) => {
  // props
  const { page, rows, dbPages, handleDBRowChange, updateDBRow, handleClickChange, dbDisplay } = props;

  let type, propIDs

  if (dbDisplay) {
    // override view
    type = dbDisplay;

    // grab db properties from first row
    propIDs = Object.keys(rows[0]);
    // hide system properties
    const hiddenProps = ['id', 'uid', 'title',];
    propIDs = propIDs.filter(propID => !hiddenProps.includes(propID));
  } else {

    const activeViewID = page.views.activeView;
    type = page.views[activeViewID].type;
    propIDs = page.views[activeViewID].visibleProperties;
  }

  // property type icons
  const ICONS = {
    title: '🆔', 
    text: '🔤',
    number: '#️⃣',
    select: '▾',
    multiselect: '≔',
    date: '🗓',
    checkbox: '☑︎',
    url: '🔗',
    email: '✉️',
    phone: '📞',
  };

  const SPECIALTYPES = [
    'title', 'checkbox', 'select', 'multiselect',
  ];

  // get property info
  const getType = (propID) => {
    return page.properties[propID].type;
  }
  const getPropName = (propID) => {
    return page.properties[propID].displayName;
  }
  const getSelectDisplay = (propID, selectOptionID) => {
    const displayInfo = page.properties[propID].selectOptions[selectOptionID];
    // {color, displayName, sortOrder}
    return displayInfo;
  }

  

  ///////////////
  // RENDERING //
  ///////////////

  // the bits of rendering - reusable for different view types
  
  // Property icon/name
  const getColumnNameSpan = (propID) => {
    return (
      <span key={propID} className='columnName'>
        <span>{ ICONS[getType(propID)] }</span>
        <span>{ getPropName(propID) }</span>
      </span>
    );
  }

  // title
  const getIconTitleDiv = (rowID) => {
    return (
      <div className='iconTitle' key={rowID}>
        { dbPages[rowID].icon }
          <Content
            handleContentChange={(event) => handleDBRowChange(event, rowID, 'title')}
            updateContent={() => updateDBRow(rowID, 'title')}
            content={ dbPages[rowID].title }
            element='span'
          >
            <span>
              { dbPages[rowID].title }
            </span>
          </Content>
        </div>
    );
  }

  const getCell = (propID, row) => {
    const type = getType(propID);
    let displayInfo;
    let handleClick;
    if (type === 'select') {
      displayInfo = getSelectDisplay(propID, row[propID]);
      handleClick = () => null;
    }
    return (
      <div key={`${row.id}${propID}`} onClick={ handleClick }>

        {/* CHECKBOX */}
        { type === 'checkbox' &&
          <input
            type='checkbox'
            checked={ row[propID] }
            onChange={ (event) => handleClickChange(event, row.id, propID) }
          />
        }

        {/* SELECT */}
        { type === 'select' &&
          <SelectCell>
            <SelectOption color={displayInfo.color}>
            { displayInfo.displayName }
            </SelectOption>
          </SelectCell>
        }

        { !SPECIALTYPES.includes(type) && // all other types
        <Content
          handleContentChange={ (event) => handleDBRowChange(event, row.id, propID)}
          updateContent={ () => updateDBRow(row.id, propID)}
          content={ row[propID] }
          element={type}
        >
          <span className='field'>
            { row[propID] }
          </span>
        </Content>
        }
      </div>
    );
  }

  ////////////////////////////
  // SWITCH BY DISPLAY TYPE //
  ////////////////////////////

  switch (type) {
    case 'table':
      // table heading
      const topRow = propIDs.map(propID => {
        return (
          <th key={ propID }>
            { getColumnNameSpan(propID) }
          </th>
        );
      });

      // rows
      const tableRows = rows.map(row => {
        return (
          <tr key={row.id}>
            {/* icon & title */}
            {
              <td className='title'>
                {
                  getIconTitleDiv(row.id)
                }

                <span className='openLinkContainer'>
                  <Link to={ `/${row.id}` } className="openLink" >⤢ OPEN</Link>
                </span>
              </td>
            }

            {/* PROPERTY VALUES */}
            { propIDs.map(propID => {
              if (propID !== 'title') {
              return (
                <td key={propID}>{ getCell(propID, row) }</td>
              )} else {
                return null
              }
            }
            )}
          </tr>
        );
      });

      return (
        <table>
          <thead>
            <tr>
              {topRow}
            </tr>
          </thead>
          <tbody>
            { tableRows }
          </tbody>
        </table>
      );
    case 'header':
      return ([
        <div className='pageDbInfo'>
          {/* map over properties in single row */}
          { propIDs.map(propID => {
            return ([
              getColumnNameSpan(propID), // property name
              rows.map(row => { // field value; only one row but that's fine
                return getCell(propID, row);
              })
            ]);
          }) }
        </div>,
        <hr />
      ]);

    default:
      return null;
  }
  
}

export default Database;