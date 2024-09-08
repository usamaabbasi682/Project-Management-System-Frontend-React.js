import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes, { renderRoutes } from './routes';

const App = () => {
    React.useEffect(() => {
    const bootstrapScript = document.createElement('script');
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js';
    bootstrapScript.async = true;
    document.body.appendChild(bootstrapScript);

    return () => {
      document.body.removeChild(bootstrapScript);
    };
      
  }, []);
  return (
    <BrowserRouter>
      <div className="app-container">{renderRoutes(routes)}</div>
    </BrowserRouter>
  );
};

export default App;
