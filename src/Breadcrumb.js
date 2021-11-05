import './Breadcrumb.css';

import PageLink from "./PageLink";

const Breadcrumb = (props) => {
  // props
  const { lineage, page } = props;

  return (
    <div className='breadcrumb'>
      { lineage.map((parent) => (
        <div className='wrapper'>
          <PageLink
            id={parent.id}
            title={parent.title}
            icon={parent.icon}
            key={parent.id}
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