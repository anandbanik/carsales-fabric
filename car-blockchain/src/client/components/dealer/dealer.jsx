import React from "react";
import { browserHistory } from "react-router";

import Car from "../car";
import Banner from "../banner";

import dealerStyles from "../../styles/dealer.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";
import "../../styles/banner.css";

import { fetchVehicle } from "../../helper/nodeservice-helper";

class Dealer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: []
    };
  }

  componentDidMount() {
    return fetchVehicle().then(cars => {
      this.setState({ cars });
    });
  }

  render() {
    return (
      <div>
        <Banner className={"dealer-banner"} title={"Dealer View"} />
        <div className={`${dealerStyles.dealerView} ${sectionStyles["flex-container"]}`}>
          {/* Filter Section */}
          <div className={`${dealerStyles.tabs} ${sectionStyles["flex-item"]}`}>
            <button
              onClick={() => {
                browserHistory.push("/dealer");
              }}
            >
              Transactions
            </button>
          </div>

          {/* Cars List Section */}
          <div className={`${sectionStyles["cars-list"]} ${sectionStyles["flex-item"]}`}>
            {this.state.cars.map(v => <Car key={v.vin_number} data={v} role={"dealer"} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default Dealer;
