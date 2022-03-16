import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import * as Comp from "./components";
import { PrivateRoute, PublicRoute } from "./components";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

axios.defaults.baseURL = process.env.PIAR_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

toast.configure();

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute restricted={true} component={Comp.SignIn} path="/" exact />
        {/* <PublicRoute
          restricted={false}
          component={Comp.Home}
          path="/home"
          exact
        /> */}
        <PublicRoute
          restricted={true}
          component={Comp.SignIn}
          path="/sign-in"
          exact
        />
        <PublicRoute
          restricted={true}
          component={Comp.SignUp}
          path="/sign-up"
          exact
        />
        <PrivateRoute component={Comp.Stations} path="/stations" exact />
        <PrivateRoute component={Comp.Users} path="/users" exact />
        <Redirect to="/stations" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
