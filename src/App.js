import './App.css';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import Index from './component/Index/Index'
import Index1 from './component/Index1/Index1';
import Index2 from './component/Index2/Index2';
const history = createBrowserHistory();

function App() {
  return (
    <Provider>
      <Router history={history}>
          <Route path={'/'} component={Index}>
              <Route path={'/index1'} component={Index1}/>
              <Route path={'/index2'} component={Index2}/>
          </Route>
      </Router>
    </Provider>
  );
}

export default App;
