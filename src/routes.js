import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  Prompt,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import './style2.css';

const Header = ({isAdmin}) => {
  return(
    <>  
    <ul className="header">
        <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
        <li><NavLink activeClassName="active" to="/weather">Weather</NavLink></li>
        {isAdmin && (
        <>
        <li><NavLink activeClassName="active" to="/add-me">Add Me</NavLink></li>
        <li><NavLink activeClassName="active" to="/find-me">Find Me</NavLink></li>
        </>
        )}
        <li><NavLink activeClassName="selected" to="/aktivitet">Aktiviteter</NavLink></li>     
    </ul>

        <hr />
        </>
  );
} 


const Content = (props) => {
  return (
    <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/weather">
            <Weather renameMeFacade={props.renameMeFacade}/>
          </Route>
          <Route path="/add-me">
            <AddMe renameMeFacade={props.renameMeFacade}/>
          </Route>
          <Route path="/find-me">
            <FindMe renameMeFacade={props.renameMeFacade}/>
          </Route>
          <Route path="/aktivitet">
                <Aktiviteter aktivtet={props.aktivtet}/>
              </Route>
          <Route>
            <NoMatch path="*" />
          </Route>
        </Switch>
      </div>
  );
}
export default function BasicRoute(props) {
  return (
    <Router>
      <div>
        <Header isAdmin={props.isAdmin} />
        <Content renameMeFacade={props.renameMeFacade} jokes={props.jokes}/>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <h4>Welcome to the site! Here you can find activities under Aktiviteter</h4>
    </div>
  );
}

function Weather(props) {
  let { path, url } = useRouteMatch();
  let mes = props.renameMeFacade.getMes();
  let meList = mes.map((me) => 
  <li key={me.id}>{me.title} <Link to={`${url}/${me.id}`}>Details</Link></li>)
  return (
    <div>
      <h2>{meList}</h2>
      <Switch>
        <Route exact path={path}>
          <h3>Weather should be here soon</h3>
        </Route>
          <Route path={`${path}/:meId`}>
            <Details renameMeFacade={props.renameMeFacade} />
          </Route>
      </Switch>
    </div>
  );
}

function Details(props) {
  let { meId } = useParams();
  const me = props.renameMeFacade.findMe(meId);
  return (
    <div>
      <h2>Nothing here</h2>
    </div>
  );
  
}

function FindMe(props) {
  const [me, setMe] = useState(0);
  
  const handleChange = event => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setMe({id: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setMe(props.renameMeFacade.findMe(me.id));
  }
  
  const handleDelete = event => {
    event.preventDefault();
    props.renameMeFacade.deleteMe(me.id);
  }

  return (
    <div>
      <form onSubmit = {handleSubmit}>
        <input
          id="id"
          value ={me.id}
          placeholder="Enter a me id"
          type="text"
          onChange={handleChange}
        />
        <button>Search</button>
        <h2>Book details:</h2>
        <p>ID: {me.id}</p>
        <p>Title: {me.title}</p>
        <p>Info: {me.info}</p>
        <button onClick ={handleDelete}>Delete me</button>
      </form>
    </div>
  );
} 

function AddMe(props) {
  let [isBlocking, setIsBlocking] = useState(false);
  const emptyMe = {id: "", title: "", info:""};
  const [me,addMe] = useState(emptyMe);

  const handleChange = event => {
    setIsBlocking(event.target.value.length > 0);
    const target = event.target;
    const id = target.id;
    const value = target.value;
    addMe({ ...me, [id]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    event.target.reset();
        setIsBlocking(false);
    props.renameMeFacade.addMe(me);
    alert("The me you entered: " + me.info + " " + me.title);
  }


  return (
    <div>
      <Prompt
        when={isBlocking}
        message={location => "Are you sure you want to go to ${location.pathname}"
        }
      />
      <h3> Add me </h3>
      <form onSubmit = {handleSubmit}>
        <input
          id="title"
          value ={me.title}
          placeholder="add title"
          type="text"
          onChange={handleChange}
        />
        <br />
        <input
          id="info"
          value ={me.info}
          placeholder="add info"
          type="text"
          onChange={handleChange}
        />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}

function Aktiviteter(props) {
  return (
    <div>
    <h2>Aktiviteter:</h2>
    <ul>
      <li>{props.aktivtet}</li>
    </ul>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>No match for that URL</h2>
    </div>
  );
}