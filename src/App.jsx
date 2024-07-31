import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">{renderRoutes(routes)}</div>
    </BrowserRouter>
  );
};

export default App;
