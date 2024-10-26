import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route key={i} path={route.path} element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/login/Login'))
  },
  {
    exact: 'true',
    path: '/register',
    element: lazy(() => import('./views/auth/register/Register'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/dashboard',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'false',
        path: '/departments',
        element: lazy(() => import('./views/department/Departments'))
      },
      {
        exact: 'false',
        path: '/departments/create',
        element: lazy(() => import('./views/department/Create'))
      },
      {
        exact: 'false',
        path: '/departments/:id/edit',
        element: lazy(() => import('./views/department/Edit'))
      },
      {
        exact: 'false',
        path: '/clients',
        element: lazy(() => import('./views/client/Clients'))
      },
      {
        exact: 'false',
        path: '/clients/create',
        element: lazy(() => import('./views/client/Create'))
      },
      {
        exact: 'false',
        path: '/clients/:id/edit',
        element: lazy(() => import('./views/client/Edit'))
      },
      {
        exact: 'false',
        path: '/projects',
        element: lazy(() => import('./views/project/Projects'))
      },
      {
        exact: 'false',
        path: '/projects/create',
        element: lazy(() => import('./views/project/Create'))
      },
      {
        exact: 'false',
        path: '/projects/:id/edit',
        element: lazy(() => import('./views/project/Edit'))
      },
      {
        exact: 'false',
        path: '/projects/:id',
        element: lazy(() => import('./views/project/View'))
      },
      {
        exact: 'false',
        path: '/projects/:id',
        element: lazy(() => import('./views/project/View'))
      },
      {
        exact: 'false',
        path: '/projects/:projectId/tasks/:taskId',
        element: lazy(() => import('./views/project/TaskView'))
      },
      {
        exact: 'false',
        path: '/projects/:projectId/tasks/:taskId/edit',
        element: lazy(() => import('./views/project/EditTask'))
      },
      {
        exact: 'false',
        path: '/tasks',
        element: lazy(() => import('./views/task/Tasks'))
      },
      {
        exact: 'false',
        path: '/status',
        element: lazy(() => import('./views/task/status/Status'))
      },
      {
        exact: 'false',
        path: '/users',
        element: lazy(() => import('./views/user/User'))
      },
      {
        exact: 'false',
        path: '/users/create',
        element: lazy(() => import('./views/user/Create'))
      },
      {
        exact: 'false',
        path: '/users/:id/edit',
        element: lazy(() => import('./views/user/Edit'))
      },
      {
        exact: 'false',
        path: '/users/:id',
        element: lazy(() => import('./views/user/View'))
      },
      {
        exact: 'false',
        path: '/roles',
        element: lazy(() => import('./views/role/Role'))
      },
      {
        exact: 'false',
        path: '/roles/create',
        element: lazy(() => import('./views/role/Create'))
      },
      {
        exact: 'false',
        path: '/roles/:id/edit',
        element: lazy(() => import('./views/role/Edit'))
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
