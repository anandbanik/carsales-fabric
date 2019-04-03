import React from "react";
import PropTypes from "prop-types";
import "../../styles/skeleton.css";
import { browserHistory, Link } from "react-router";
import "../../styles/custom.css";
import user from "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import Negotiation from "../negotiation-box";
import Banner from "../banner";
import "../../styles/dealer.css";
import AcceptedNegotiation from "./accepted-negotiation";

import custom from "../../styles/custom.css";
import { fetchNegotiations } from "../../helper/nodeservice-helper";

/* eslint-disable no-magic-numbers */
const NegotiationFilter = props => {
  const data = props && props.data;
  console.log(data);
  if (data.status === "approved") {
    return <AcceptedNegotiation key={data.id} data={data} role={"user"} />;
  } else {
    console.log(data);
    return <Negotiation key={data.id} data={data} role={"user"} />;
  }
};

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      negotiations: []
    };

    console.log("props -->", props);
  }

  componentDidMount() {
    return fetchNegotiations().then(negotiations => {
      console.log(negotiations);
      this.setState({ negotiations });
    });
  }

  render() {
    return (
      <div>
      
       <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> >  <Link style={{textDecoration: "none", color: "white"}} to="/user">Car list </Link> > My History </div>
  </div>

  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>My History</b></div>
      </div>
      <div className={custom.container}> 
      <div style={{padding: "30px",  minHeight:"400px", marginTop:"40px",textAlign: "center" , borderRadius: "4px" ,border: "1px dashed #ddd", backgroundColor: "#fff"}} >


       {
         this.state.negotiations.length === 0 ? 
         <span style={{color: "#ddd", lineHeight: "400px",fontSize: "30px"  }}>
        No History 
        </span>
        : <div
        className={`${sectionStyles["cars-list"]} ${
          sectionStyles["flex-item"]
        }`}
      >
        {this.state.negotiations.map(v => {
          
          const type = this.props.location.pathname === "/userHistory" ? "Customer" : v.dealer_name;
          v.userType = type;
          return <NegotiationFilter key={v.id} data={v} role={"user"}  />;
        })}
      </div>
       }

</div>
         </div>
       
      </div>
    );
  }
}

NegotiationFilter.propTypes = {
  data: PropTypes.object
};

export default History;
/* eslint-enable */
