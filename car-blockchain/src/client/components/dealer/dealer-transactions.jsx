import React from "react";

import { browserHistory } from "react-router";
import Negotiation from "../negotiation-box";
import Banner from "../banner";

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
        <Banner className={"dealer-banner"} title={"Dealer Negotiations"} />
        <div className={`${dealerStyles.dealerView} ${sectionStyles["flex-container"]}`}>
          {/* Filter Section */}
          <div className={`${dealerStyles.tabs} ${sectionStyles["flex-item"]}`}>
            <button
              onClick={() => {
                browserHistory.push("/dealer-transactions");
              }}
            >
              Inventory
            </button>
          </div>

          {/* Transactions List Section */}
          <div className={`${sectionStyles["cars-list"]} ${sectionStyles["flex-item"]}`}>
            {this.state.negotiations.map(v => <Negotiation key={v.id} data={v} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default DealerTransactions;
