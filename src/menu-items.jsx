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
        {
          id: 'project_view',
          title: 'View Project',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/projects/:id',
          display:false
        },
        {
          id: 'task_view',
          title: 'Task Project',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/projects/:projectId/tasks/:taskId',
          display:false
        },
        {
          id: 'task_edit',
          title: 'Edit Task',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/projects/:projectId/tasks/:taskId/edit',
          display:false
        },
      ]
    },
    {
      id: 'status-tasks',
      title: 'STATUS & TASKS',
      type: 'group',
      icon: 'icon-group',
      children: [
        {
          id: 'tasks-header',
          title: 'Tasks',
          type: 'collapse',
          icon: 'feather icon-list',
          children: [
            {
              id: 'tasks',
              title: 'Tasks',
              type: 'item',
              url: '/tasks',
              display:true
            },
            {
              id: 'status',
              title: 'Status',
              type: 'item',
              url: '/status',
              display:true
            },
          ]
        }
      ]
    },
    // {
    //   id: 'ui-element',
    //   title: 'UI ELEMENT',
    //   type: 'group',
    //   icon: 'icon-ui',
    //   children: [
    //     {
    //       id: 'component',
    //       title: 'Component',
    //       type: 'collapse',
    //       icon: 'feather icon-box',
    //       children: [
    //         {
    //           id: 'button',
    //           title: 'Button',
    //           type: 'item',
    //           url: '/basic/button',
    //           display:true
    //         },
    //         {
    //           id: 'badges',
    //           title: 'Badges',
    //           type: 'item',
    //           url: '/basic/badges',
    //           display:true
    //         },
    //         {
    //           id: 'breadcrumb',
    //           title: 'Breadcrumb & Pagination',
    //           type: 'item',
    //           url: '/basic/breadcrumb-paging',
    //           display:true
    //         },
    //         {
    //           id: 'collapse',
    //           title: 'Collapse',
    //           type: 'item',
    //           url: '/basic/collapse',
    //           display:true
    //         },
    //         {
    //           id: 'tabs-pills',
    //           title: 'Tabs & Pills',
    //           type: 'item',
    //           url: '/basic/tabs-pills',
    //           display:true
    //         },
    //         {
    //           id: 'typography',
    //           title: 'Typography',
    //           type: 'item',
    //           url: '/basic/typography',
    //           display:true
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'ui-forms',
    //   title: 'FORMS & TABLES',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'forms',
    //       title: 'Form Elements',
    //       type: 'item',
    //       icon: 'feather icon-file-text',
    //       url: '/forms/form-basic',
    //       display:true
    //     },
    //     {
    //       id: 'table',
    //       title: 'Table',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/tables/bootstrap',
    //       display:true
    //     }
    //   ]
    // },
        {
      id: 'other',
      title: 'Other Details',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'users',
          title: 'Users',
          type: 'item',
          icon: 'feather icon-users',
          url: '/users',
          display:true
        },
        {
          id: 'user_create',
          title: 'Create User',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/users/create',
          display:false
        },
        {
          id: 'user_edit',
          title: 'Edit User',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/users/:id/edit',
          display:false
        },
        {
          id: 'user_view',
          title: 'View User',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/users/:id',
          display:false
        },
        {
          id: 'roles',
          title: 'Roles',
          type: 'item',
          icon: 'feather icon-user',
          url: '/roles',
          display:true
        },
        {
          id: 'roles_create',
          title: 'Create Role',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/roles/create',
          display:false
        },
        {
          id: 'roles_edit',
          title: 'Edit Role',
          type: 'item',
          icon: 'feather icon-grid',
          url: '/roles/:id/edit',
          display:false
        }
      ]
    },
  ]
};

export default menuItems;
