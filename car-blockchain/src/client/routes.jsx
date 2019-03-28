import React from "react";
import { Router, Route, IndexRoute} from "react-router";
import Home from "./components/home";
import User from "./components/user/user";
import Dealer from "./components/dealer/dealer";
import CarDetails from "./components/car-details";
import Negotiation from "./components/negotiation-box";
import History from "./components/user/history";
import DealerTransactions from "./components/dealer/dealer-transactions";
import Banker from "./components/banker/banker";
import Broker from "./components/broker/broker";
import Registration from "./components/registration/registration";
import Admin from "./components/admin/admin";
import HomePage from "./components/homePage";

export const routes = (
  
    <Route path="/" component={Home}  >
    <IndexRoute component={HomePage} name="Home" crumsPath="home>dashboard" />
    <Route path="/user" component={User} />
    <Route path="/dealer-transactions" component={Dealer} />
    <Route path="/car-details" component={CarDetails} />
    <Route path="/negotiation" component={Negotiation} />
    <Route path="/history" component={History} />
    <Route path="/userHistory" component={History} />
    <Route path="/dealer" component={DealerTransactions} />
    <Route path="/banker" component={Banker} />
    <Route path="/broker" component={Broker} />
    <Route path="/registration" component={Registration} />
    <Route path="/admin" component={Admin} />
 </Route>
);
