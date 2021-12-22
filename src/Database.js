import { useState } from 'react';
import { Link } from 'react-router-dom';

// style
import './Database.css';

// my components
import Content from './Content';
import SelectOption from './SelectOption';
import SelectCell from './SelectCell';
import { removeFromArray } from './helpers';
import FieldName from './FieldTitle';
import { renderDate, isBlank} from './databaseFunctions';

const Database = (props) => {
  // props
  const {
    page, rows, dbPages, dbDisplay,
    handleDBRowChange, updateDBRow, handleClickChange,
    addSelectOption, updateSelectOption, deleteSelectOption, 
    handleDBPropNameChange, updateDBPropName, updateDBPropType,
    addProperty,
    handleColumnAction,
    addDBRow,
  } = props;

  // state
  const [draggedRowID, setDraggedRowID] = useState('');

  // some variables to smooth things out
  let type, propIDs, groupBy, groupByIDs, groupBySelectOptions, activeViewID, activeView;

  if (dbDisplay) {
    // override view
    type = dbDisplay;

    // grab db properties from first row
    propIDs = Object.keys(rows[0]);
    // hide system properties
    const hiddenProps = ['id', 'uid', 'title',];
    propIDs = propIDs.filter(propID => !hiddenProps.includes(propID));
  } else {

    activeViewID = page.activeView;
    activeView = page.views[activeViewID];

    type = page.views[activeViewID].type;
    propIDs = page.views[activeViewID].visibleProperties;
  }

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
    const displayInfo = {
      id: selectOptionID,
      ...page.properties[propID].selectOptions[selectOptionID]
    };
    // {color, displayName, sortOrder}
    return displayInfo;
  }
  const getSelectOptions = (propID) => {
    // want [{id, displayName, color, sortOrder}, ...]
    // OR DO I REALLY WANT
    // {displayName: <SelectOption />, ...}
    // OR
    // [{displayName, jsx}, {displayName, jsx}, ...]
    const selectOptionIDs = Object.keys(page.properties[propID].selectOptions);
    const selectOptions = selectOptionIDs.map((x => {
      return {id: x, ...getSelectDisplay(propID, x)};
    }));
    return selectOptions;
  }

  const removeSelectOption = (optionID, rowID, propID) => {
    // remove from array
    const oldArr = rows.find(row => row.id === rowID)[propID];
    const newArr = removeFromArray(optionID, oldArr);

    // send through to page
    handleClickChange(newArr, rowID, propID);
  }

  const chooseSelectOption = (optionID, rowID, propID) => {
    // select: replace
    const type = getType(propID);
    let newArr;
    
    if (type === 'select') {
      newArr = [optionID];
    } else if (type === 'multiselect') {
      // add to array
      const oldArr = rows.find(row => row.id === rowID)[propID];
      newArr = [...oldArr];
      if (!oldArr.includes(optionID)) {
        newArr.push(optionID);
      }
    }

    // send through to page
    handleClickChange(newArr, rowID, propID);
  }

  const handleBoardCardDrop = (event) => {
    // dropped onto column --> id = new selecOption
    const newSelectOptionID = event.currentTarget.id;
    // which row to change?

    handleClickChange([newSelectOptionID], draggedRowID, groupBy);
  }

  // board: groupBy
  if (type === 'board' && activeView) {
    groupBy = activeView.groupBy;
    groupBySelectOptions = getSelectOptions(groupBy);
    groupByIDs = groupBySelectOptions.map(selectOption => selectOption.id);
  }

  ///////////////
  // RENDERING //
  ///////////////

  // the bits of rendering - reusable for different view types

  // action bar
  // views, properties, group, filter, sort, search, …, New button
  const actionBar = (
    <div className='dbActionBar'>
      {/* VIEWS */}
      <button className='viewButton'>
        Default view
      </button>

      <button>
        Properties
      </button>
      <button>
        Group
      </button>
      <button>
        Filter
      </button>
      <button>
        Sort
      </button>
      <button>
        Search
      </button>

      <button className='newButton' onClick={addDBRow}>
        New
      </button>
    </div>
  );
  
  // Property icon/name
  const getColumnNameSpan = (propID) => {
    return (
      <FieldName
        type={ getType(propID) }
        displayName={ getPropName(propID) }
        handleDBPropNameChange={ (newName) => handleDBPropNameChange(newName, propID)}
        updateDBPropName={(newName) => updateDBPropName(newName, propID)}
        updateDBPropType={(newType) => updateDBPropType(newType, propID)}
        handleColumnAction={(action) => handleColumnAction(action, propID)}
      />
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
    if ((type === 'select' || type === 'multiselect')) {
      if (!Array.isArray(row[propID])) {
        // firebase doesn't have array value yet. Replace with empty array while waiting for it to come through
        row[propID] = [];
      }
      // row[propID] is array of selectOption IDs. Look up selectOption
      displayInfo = row[propID].map(selectOption => getSelectDisplay(propID, selectOption));
      // displayInfo = [{id, displayName, color, sortOrder}, {...}, ...]
      
      // no onClick for the whole cell
      handleClick = () => null;
    }
    return (
      <div className='field' key={`${row.id}${propID}`} onClick={ handleClick }>

        {/* CHECKBOX */}
        { type === 'checkbox' &&
          <input
            type='checkbox'
            checked={ row[propID] }
            onChange={ (event) => handleClickChange(event, row.id, propID) }
          />
        }

        {/* SELECT */}
        { (type === 'select' || type === 'multiselect') &&
          <SelectCell
            cellID={ `${row.id}-${propID}` }
            type={ type }
            remove={ (optionID) => removeSelectOption(optionID, row.id, propID) }
            handleClick={ (payload) =>  chooseSelectOption(payload, row.id, propID) }
            allOptions={ getSelectOptions(propID) }
            addSelectOption={ (displayName) => addSelectOption(propID, displayName) }
            updateSelectOption={ (newVal, updateType, selectOptionID) => updateSelectOption(newVal, updateType, selectOptionID, propID) }
            deleteSelectOption={ (selectOptionID) => deleteSelectOption(selectOptionID, propID) }
          >
            { 
              displayInfo.map(selectOption => (
                  <SelectOption
                    key={selectOption.id}
                    id={selectOption.id}
                    color={selectOption.color}
                  >
                    { selectOption.displayName }
                  </SelectOption>
                )
              )
            }
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
            { type === 'url' &&
              <a href={row[propID]}> {row[propID]} </a>
            }
            { type === 'email' &&
              <a href={`mailto:${row[propID]}`}> {row[propID]} </a>
            }
            { type === 'phone' &&
              <a href={`tel:${row[propID]}`}> {row[propID]} </a>
            }
            { type === 'number' &&
              (isNaN(row[propID]) ? '' : row[propID])
            }
            { type === 'date' &&
              renderDate(row[propID])
            }

            { type === 'text' &&
              row[propID]
            }
          </span>
        </Content>
        }
      </div>
    );
  }

  const getCard = (row) => {
    // div with Title on top, prop value per row. skip empty props. Click to open page.
    return (
      <div
        className='card'
        key={row.id}
        onDragStart={ () => setDraggedRowID(row.id) }
      >
        <Link to={ `/${row.id}` }>
          { getIconTitleDiv(row.id) }
          {
            propIDs.map(propID => {
              const type = getType(propID);
              if (type !== 'title' && !isBlank(row[propID], getType(propID))) {
                return (
                  <div className='cardProp' key={propID}>
                    {getCell(propID, row)}
                  </div>
                );
              } else {
                return null;
              }
            })
          }
        </Link>
      </div>
    )
  }

  ////////////////////////////
  // SWITCH BY DISPLAY TYPE //
  ////////////////////////////

  
  switch (type) {
    // TABLE
    case 'table':
      // count columns
      const numColumns = propIDs.length + 1; // +1 for Add property column
      const tableFooter = (
        <tr>
          <td className='addRow' colSpan={numColumns} onClick={addDBRow}>
            + New
          </td>
        </tr>
      );

      // table heading
      const topRow = propIDs.map(propID => {
        return (
          <th key={ propID }>
            { getColumnNameSpan(propID) }
          </th>
        );
      });
      // add property
      topRow.push(
        <th
          key='addProperty'
          className='addProperty'
          onClick={addProperty}>
        +
        </th>
      )

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

            {/* Blank cell */}
            <td></td>
          </tr>
        );
      });

      return (
        <div>
          {actionBar}
          <table>
            <thead>
              <tr>
                {topRow}
              </tr>
            </thead>
            <tbody>
              { tableRows }
              { tableFooter }
            </tbody>
          </table>
        </div>
      );

    // BOARD
    case 'board':
      return (
        <div>
          { actionBar }
          <div className='board'>

            {/* NO VALUE */}
            <div className='boardColumn'
              id=''
              onDragOver={(event) => event.preventDefault()}
              onDrop={ handleBoardCardDrop }
            >
              <header>
                <span>No {getPropName(groupBy)}</span>
                <div className='addRow'
                      onClick={() => addDBRow({[groupBy]: []})}
                    >
                      +
                    </div>
              </header>

              {
                rows.filter(
                  row => row[groupBy].length === 0
                ).map(row => {
                  return getCard(row);
                })
              }

              <div className='addRow'
                onClick={() => addDBRow({[groupBy]: []})}
              >
                + New
              </div>

            </div>

            {/* ONE COLUMN PER SELECTOPTION */}
            { groupBySelectOptions.map(selectOption => {
              return (
                <div
                  className='boardColumn'
                  key={selectOption.id}
                  id={selectOption.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={ handleBoardCardDrop }
                >
                  <header>
                    <SelectOption
                      id={selectOption.id}
                      color={selectOption.color}
                    >
                      {selectOption.displayName}
                    </SelectOption>
                    <div className='addRow'
                      onClick={() => addDBRow({[groupBy]: [selectOption.id]})}
                    >
                      +
                    </div>
                  </header>

                  {
                    rows.filter(
                      row => row[groupBy].includes(selectOption.id)
                    ).map(row => {
                      return getCard(row);
                    })
                  }

                  <div className='addRow'
                    onClick={() => addDBRow({[groupBy]: [selectOption.id]})}
                  >
                    + New
                  </div>

                </div>
              );
            }) }
          </div>
        </div>
      );


    // SINGLE DB PAGE
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

          {/* ADD PROPERTY */}
          <span className='columnName' onClick={ addProperty }>
            <span>+</span>
            <span>Add Property</span>
          </span>

        </div>,
        <hr />
      ]);

    default:
      return null;
  }
  
}

export default Database;