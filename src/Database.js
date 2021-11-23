import { Link } from 'react-router-dom';

// style
import './Database.css';

// my components
import Content from './Content';

const Database = (props) => {
  // props
  const { page, rows, dbPages, handleDBRowChange, updateDBRow } = props;

  const activeViewID = page.views.activeView;
  const type = page.views[activeViewID].type;
  const propIDs = page.views[activeViewID].visibleProperties;

  // property type icons
  const icons = {
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
  }

  if (type === 'table') {
    // table heading
    const topRow = propIDs.map(propID => {
      return (
        <th key={ propID }>
          <span className='columnName'>
            <span>{ icons[page.properties[propID].type] }</span>

            <span>{ page.properties[propID].displayName }</span>
          </span>
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
              <div className='iconTitle'>
              { dbPages[row.id].icon }
                <Content
                  handleContentChange={(event) => handleDBRowChange(event, row.id, 'title')}
                  updateContent={() => updateDBRow(row.id, 'title')}
                  content={ dbPages[row.id].title }
                  element='span'
                >
                  <span>
                    { dbPages[row.id].title }
                  </span>
                </Content>
              </div>

              <span className='openLinkContainer'>
                <Link to={ `/${row.id}` } className="openLink" >⤢ OPEN</Link>
              </span>
            </td>
          }

          { propIDs.map(propID => {
            if (propID !== 'title') {
              return (
                <td key={propID}>
                  <Content
                    handleContentChange={ (event) => handleDBRowChange(event, row.id, propID)}
                    updateContent={ () => updateDBRow(row.id, propID)}
                    content={ row[propID] }
                    element='span'
                  >
                    <span>
                      { row[propID] }
                    </span>
                  </Content>
                </td>
              );
            } else {
              return null;
            }
          }) }
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
  }
  
}

export default Database;