const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/dashboard',
          display:true
        },
        {
          id: 'departments',
          title: 'Departments',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/departments',
          display:true
        },
        {
          id: 'departments_create',
          title: 'Create Department',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/departments/create',
          display:false
        },
        {
          id: 'departments_edit',
          title: 'Edit Department',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/departments/:id/edit',
          display:false
        },
        {
          id: 'clients',
          title: 'Clients',
          type: 'item',
          icon: 'feather icon-users',
          url: '/clients',
          display:true
        },
        {
          id: 'clients_create',
          title: 'Create Client',
          type: 'item',
          icon: 'feather icon-users',
          url: '/clients/create',
          display:false
        },
        {
          id: 'client_edit',
          title: 'Edit Client',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/clients/:id/edit',
          display:false
        },
        {
          id: 'projects',
          title: 'Projects',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/projects',
          display:true
        },
        {
          id: 'projects_create',
          title: 'Create Project',
          type: 'item',
          icon: 'feather icon-users',
          url: '/projects/create',
          display:false
        },
        {
          id: 'project_edit',
          title: 'Edit Project',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/projects/:id/edit',
          display:false
        },
      ]
    },
    {
      id: 'ui-element',
      title: 'UI ELEMENT',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'component',
          title: 'Component',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button',
              display:true
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges',
              display:true
            },
            {
              id: 'breadcrumb',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-paging',
              display:true
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse',
              display:true
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/basic/tabs-pills',
              display:true
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography',
              display:true
            }
          ]
        }
      ]
    },
    {
      id: 'ui-forms',
      title: 'FORMS & TABLES',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'forms',
          title: 'Form Elements',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/forms/form-basic',
          display:true
        },
        {
          id: 'table',
          title: 'Table',
          type: 'item',
          icon: 'feather icon-server',
          url: '/tables/bootstrap',
          display:true
        }
      ]
    },
    {
      id: 'chart-maps',
      title: 'Chart & Maps',
      type: 'group',
      icon: 'icon-charts',
      children: [
        {
          id: 'charts',
          title: 'Charts',
          type: 'item',
          icon: 'feather icon-pie-chart',
          url: '/charts/nvd3',
          display:true
        },
        {
          id: 'maps',
          title: 'Maps',
          type: 'item',
          icon: 'feather icon-map',
          url: '/maps/google-map',
          display:true
        }
      ]
    },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          classes: 'nav-item',
          icon: 'feather icon-sidebar',
          display:true
        },
        {
          id: 'disabled-menu',
          title: 'Disabled Menu',
          type: 'item',
          url: '#',
          classes: 'nav-item disabled',
          icon: 'feather icon-power',
          display:true
        }
      ]
    }
  ]
};

export default menuItems;
