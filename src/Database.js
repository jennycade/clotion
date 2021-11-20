const Database = (props) => {
  // props
  const { page, rows, dbPages } = props;

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
              { dbPages[row.id].title }
            </td>
          }

          { propIDs.map(propID => {
            if (propID !== 'title') {
              return (
                <td key={propID}>
                  { row[propID] }
                </td>
              );
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