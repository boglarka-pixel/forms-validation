import './App.scss';
import db from './firebase/db';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Submit from './Submit';
import Home from './Home';
import EditPerson from './EditPerson';
import AddNewPerson from './AddNewPerson';

function App() {
  return (
    
     <Router>
       
       <Switch>
           <Route exact path="/">
               <Home/>  
           </Route>
           <Route path={'/submit'}>
           <Submit/>
           </Route>
           <Route path={'/edit/:id'}>
            <EditPerson/>
            </Route>
            <Route path={'/add'}>
            <AddNewPerson/>
            </Route>
         
       </Switch>
   </Router>
    
  );
}

export default App;
