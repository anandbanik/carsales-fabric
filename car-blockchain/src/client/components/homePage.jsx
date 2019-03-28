import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import "../styles/normalize.css";
import "../styles/raleway.css";
import skeleton from "../styles/skeleton.css";
import custom from "../styles/custom.css";
import { MuiThemeProvider } from "material-ui/styles";
import AppBar from 'material-ui/AppBar';

import Slider from 'react-animated-slider';
import '../styles/horizonatal.css';
import m from '../images/car-inventory/black-c300.jpg';
const content  = [
    {title: "Select Car", description:"Select the car of your choice, negotiate with the dealer."},
    {title: "Apply Loan", description:"Apply for loan for the car."},
    {title: "Get Insurance", description:"Get you car insured right away."},
    {title: "Get Car registration", description:"Get you car registration done."},
  ];
  export default () => (
 <div>
<div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> </div></div>

     <div className={custom.imageM}>

<div className={custom.container}>

<Slider>
{content.map((article, index) => 
<div key={index} >
 <div className={custom.carouselText}>
  <div className={custom.carouselTextInner}>
  <h2>{article.title}</h2>
  <div>{article.description}</div>
  </div>
 </div>
</div>)}
</Slider></div></div>
<div className={custom.container}>

  <div className={custom.header}>
  <div className={custom.textDiv}>
  <h2 >Car buying made simple</h2>
  <h4>Drive your car home!</h4>
  
  </div>
<br></br>
   
  <div style={{width:"100%", textAlign:"center", marginLeft:"100px", marginTop: "30px", marginBottom: "100px"}}>
  <Link to="/user"> <div style={{width:"27%", fontSize: "30px", lineHeight: "200px", 
   backgroundColor: "#ddd", height: "200px",float: "left", marginRight: "3.5%" , backgroundColor: "#008744", color: "#fff"}} >
     BUYER
      </div></Link> 
      <Link to="/dealer">   <div style={{width:"27%", fontSize: "30px", lineHeight: "200px",
   backgroundColor: "#ddd", height: "200px",display: "inline-block", marginRight: "3.5%",float: "left", backgroundColor: "#ffa700", color: "#fff" }} >
       DEALER
        </div></Link> 
        <Link to="/banker">     <div style={{width:"27%", fontSize: "30px", lineHeight: "200px",
   backgroundColor: "#ddd", height: "200px",display: "inline-block", marginRight: "3.5%",float: "left", backgroundColor: "#0057e7", color: "#fff"}} >
         BANKER
        </div></Link> 
        <Link to="/broker">      <div style={{width:"27%", fontSize: "30px", lineHeight: "200px",marginTop:"40px",
   backgroundColor: "#ddd", height: "200px",display: "inline-block", marginRight: "3.5%",float: "left", backgroundColor: "#9C27B0", color: "#fff", marginBottom: "100px" }} >
        INSURANCE BROKER
        </div></Link> 
        <Link to="/registration">      <div style={{width:"27%", fontSize: "30px", lineHeight: "200px",marginTop:"40px",
   backgroundColor: "#ddd", height: "200px",display: "inline-block", marginRight: "3.5%",float: "left", backgroundColor: "#ff5252", color: "#fff", marginBottom: "100px"}} >
        DMV REGISTRATION
        </div></Link> 
       
  </div>

  </div>
</div>
<hr></hr>
 </div>
);

