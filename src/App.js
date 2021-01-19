import React, { useState,useEffect } from "react"
import facade from "./apiFacade";
import BasicRoute from './routes';

function LogIn({ login}) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
 
  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }
 
  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange} >
        Du skal være medlem for at se indholdet på vores side.
        <br></br>
        Kontakt en admin hvis du oprette dig som bruger.
        <br></br>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  )
 
}
function LoggedIn() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")

  useEffect(() => {
    facade.fetchData().then(data=> setDataFromServer(data.msg));
  }, [])

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  )
 
} 

function App(props) {
  const [isAdmin, setAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const emptyAktivitet = {LocationName: "", aktivitetsType: "", tidpådagen:"",tid: "", distance: "",kommentar: ""};
  const [aktivitet, setAktivitet] = useState(emptyAktivitet);

  

  useEffect(() => {
    facade.fetchAktivitet().then(aktivitet=> setAktivitet(aktivitet));

  }, [])

  const logout = () => {facade.logout()
    setLoggedIn(false)} 
  const login = (user, pass) => {facade.login(user,pass)
    .then(res => {
      setLoggedIn(true)
      const decodedToken = JSON.parse(atob(facade.getToken().split('.')[1]));
      const role = decodedToken.roles;
      role === "admin" ? setAdmin(true) : setAdmin(false);
      }
    );
   } 

  return (
    <div>
      {!loggedIn ? (<LogIn login={login}/>) :
        (<div>
          <LoggedIn />
          <BasicRoute renameMeFacade={props.renameMeFacade} isAdmin={isAdmin} aktivitet={aktivitet}/>
          <button onClick={logout}>Logout</button>
        </div>)}
    </div>
  )
 
}
export default App;
 
