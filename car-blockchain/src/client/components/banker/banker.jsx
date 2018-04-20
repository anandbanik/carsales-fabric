import React from "react";

import Banner from "../banner";
import Transaction from "./transaction-box";

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
        <Banner className={"banker-banner"} title={"Banker Transactions"} />
        <div
          className={`${sectionStyles["cars-list"]} ${
            sectionStyles["flex-item"]
          }`}
        >
          {this.state.transactions.map(v => (
            <Transaction key={v.id} data={v} />
          ))}
        </div>
      </div>
    );
  }
}

export default Banker;
