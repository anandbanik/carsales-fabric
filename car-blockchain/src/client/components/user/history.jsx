import React from "react";
import PropTypes from "prop-types";
import "../../styles/skeleton.css";
import "../../styles/custom.css";
import user from "../../styles/user.css";
import sectionStyles from "../../styles/section.css";
import Negotiation from "../negotiation-box";
import Banner from "../banner";
import { browserHistory } from "react-router";
import "../../styles/dealer.css";
import AcceptedNegotiation from "./accepted-negotiation";

import { fetchNegotiations } from "../../helper/nodeservice-helper";

/* eslint-disable no-magic-numbers */
const NegotiationFilter = props => {
  const data = props && props.data;

  if (data.status === "approved") {
    return <AcceptedNegotiation key={data.id} data={data} role={"user"} />;
  } else {
    return <Negotiation key={data.id} data={data} role={"user"} />;
  }
};

class History extends React.Component {
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
        <Banner className={"user-banner"} title={"User Transactions"} />
        <button
          onClick={() => {
            browserHistory.push("/user");
          }}
          className={`${user.listings}`}
        >
          Listings
        </button>
        <div className={`${user.userView} ${sectionStyles["flex-container"]}`}>
          {/* Transactions List Section */}
          <div
            className={`${sectionStyles["cars-list"]} ${
              sectionStyles["flex-item"]
            }`}
          >
            {this.state.negotiations.map(v => {
              return <NegotiationFilter key={v.id} data={v} role={"user"} />;
            })}
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
