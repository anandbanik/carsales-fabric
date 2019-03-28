import React from "react";

import { browserHistory, Link } from "react-router";
import Negotiation from "../negotiation-box";
import Banner from "../banner";
import custom from "../../styles/custom.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";
import sectionStyles from "../../styles/section.css";
import dealerStyles from "../../styles/dealer.css";

import { fetchNegotiations } from "../../helper/nodeservice-helper";

class DealerTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      negotiations: []
    };
  }

  componentDidMount() {
    return fetchNegotiations().then(negotiations => {
      this.setState({ negotiations });
    });
  }

  render() {
    return (
      <div>
 <div className={custom.breadCrums}>
  <div className={custom.container}>
  <Link style={{textDecoration: "none", color: "white"}} to="/">Home</Link> >  <Link style={{textDecoration: "none", color: "white"}} to="/dealer-transactions">Car list </Link> > My History </div>
  </div>

  <div style={{ backgroundColor: "#fff",fontWeight: "800", fontSize: "1.3em", border: "1px solid #eee", paddingTop: "20px", paddingBottom: "20px"}}> 
      <div className={custom.container}>
      <b>Dealer Negotiation</b>
      <span style={{float: "right", lineHeight: "20px",color: "#009933" ,verticalAlign:"top"}}>
        <Link style={{textDecoration: "none", color: "#009933" }} to="/dealer-transactions"> Inventory </Link>
      </span></div>
      </div>
      
      <div className={custom.container}> 
      <div style={{padding: "30px",  minHeight:"400px", marginTop:"40px",textAlign: "center" , borderRadius: "4px" ,border: "1px dashed #ddd", backgroundColor: "#fff"}} >

        <div className={`${dealerStyles.dealerView} ${sectionStyles["flex-container"]}`}>
          {/* Filter Section */}
          
    { this.state.negotiations.length === 0 ? <span style={{color: "#ddd", lineHeight: "400px",fontSize: "30px"  }}>
No transactions 
</span> :
          
          <div className={`${sectionStyles["cars-list"]} ${sectionStyles["flex-item"]}`}>
            {this.state.negotiations.map(v => {
               const type = this.props.location.pathname === "/userHistory" ? "Customer" : v.dealer_name;
               v.userType = type;
              return (<Negotiation key={v.id} data={v}/>);
            }
            )}
          </div>}
        </div>
      </div>
      </div>
      </div>
    );
  }
}

export default DealerTransactions;
