import Content from './Content';

const Database = (props) => {
  // props
  const { page, rows, dbPages, handleDBRowChange, updateDBRow } = props;

  const activeViewID = page.views.activeView;
  const type = page.views[activeViewID].type;
  const propIDs = page.views[activeViewID].visibleProperties;

  if (type === 'table') {
    // table heading
    const topRow = propIDs.map(propID => {
      return (
        <th key={ propID }>
          { page.properties[propID].displayName }
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
              { dbPages[row.id].icon }
              <Content
                handleContentChange={() => null}
                updateContent={() => null}
                content={ dbPages[row.id].title }
                element='span'
              >
                <span>
                  { dbPages[row.id].title }
                </span>
              </Content>
            </td>
          }

          { propIDs.map(propID => {
            if (propID !== 'title') {
              return (
                <td key={propID}>
                  <Content
                    handleContentChange={ (event) => handleDBRowChange(event, row.id, propID)}
                    updateContent={ (event) => updateDBRow(event, row.id, propID)}
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