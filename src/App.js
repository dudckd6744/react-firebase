import {
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { useEffect } from 'react';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  clearUser
} from "./redux/actions/user_action"

function App(props) {

  const isLoading = useSelector(state => state.user.isLoading)
  const dispatch = useDispatch()

  var history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user)
      if(user){
          history.push("/")
          dispatch(setUser(user))
      }else{
          history.push("/login")
          dispatch(clearUser(user))
      }
    })
  }, [])

  if(isLoading ){
    return(
      <div>
        loaing ...
      </div>
    )
  }

  return (
        <Switch>
          <Route exact path="/" component={ChatPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch>
  );
}

export default App;
