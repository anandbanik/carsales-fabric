import React from "react";
import { browserHistory, Link } from "react-router";
import Banner from "../banner";
import Transaction from "./transaction-box";
import custom from "../../styles/custom.css";
import "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

import { fetchAllLoans } from "../../helper/nodeservice-helper";

/*
 * Demostrates a simple pure functional component
 */
class Banker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  componentDidMount() {
    return fetchAllLoans().then(loan => {
      this.setState({
        transactions: loan
      });
    });
  }

  render() {
    return (
      <div>
       <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> > Banker </div></div>

  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>Banker</b>
      </div>
      </div>
      <div className={custom.container}>
      <div style={{padding: "30px",  minHeight:"400px", marginTop:"40px",textAlign: "center" , borderRadius: "4px" ,border: "1px dashed #ddd", backgroundColor: "#fff"}} >

{ this.state.transactions.length === 0 ? <span style={{color: "#ddd", lineHeight: "400px",fontSize: "30px"  }}>
No transactions 
</span> :

        <div
          className={`${sectionStyles["cars-list"]} ${
            sectionStyles["flex-item"]
          }`}
        >
          {this.state.transactions.map(v => (
            <Transaction key={v.vin_number} data={v} />
          ))}
        </div>}
         </div>
        </div>
      </div>
    );
  }
}

export default Banker;
