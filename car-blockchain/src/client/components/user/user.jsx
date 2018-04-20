import React from "react";
import { browserHistory } from "react-router";

import Banner from "../banner";
import Car from "../car";
import { fetchVehicle } from "../../helper/nodeservice-helper";

import userStyles from "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

/*
 * User Car Inventory View
 */
class UserView extends React.Component {
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
        {/* User Banner Section */}
        <Banner className={"user-banner"} title={"Car Inventory"} />

        {/* User History Button */}
        <button
          onClick={() => {
            browserHistory.push("/history");
          }}
          className={`${userStyles.history}`}
        >
          History
        </button>

        {/* Cars List Section */}
        <div
          className={`${userStyles.userView} ${
            sectionStyles["flex-container"]
          }`}
        >
          <div
            className={`${sectionStyles["cars-list"]} ${
              sectionStyles["flex-item"]
            }`}
          >
            {this.state.cars.map(v => (
              <Car key={v.vin_number} data={v} role={"user"} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default UserView;
