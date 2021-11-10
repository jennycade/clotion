import './Breadcrumb.css';

import PageLink from "./PageLink";

const Breadcrumb = (props) => {
  // props
  const { lineage, page } = props;

  return (
    <div className='breadcrumb'>
      { lineage.map((parent) => (
        <div className='wrapper' key={parent.id}>
          <PageLink
            id={parent.id}
            title={parent.title}
            icon={parent.icon}
          />
          <span className='spacer'>
            /
          </span>
        </div>
      )) }

      <PageLink
        id={page.id}
        title={page.title}
        icon={page.icon}
      />
    </div>
  );
}

export default Breadcrumb