import React from "react";
import PropTypes from "prop-types";

import negotiationStyles from "../../styles/negotiation.css";
import "../../styles/skeleton.css";
import "../../styles/custom.css";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

/* eslint-disable complexity */
class AcceptedTabs extends React.Component {
  constructor(props) {
    super(props);

    this.tabListHandler = this.props.tabListHandler.bind(this);
  }

  render() {
    return (
      <Tabs defaultIndex={0} onSelect={this.tabListHandler.bind(this)}>
        <TabList>
          <Tab selectedClassName={negotiationStyles.selectedTab}>
            Basic Info
          </Tab>
          <Tab selectedClassName={negotiationStyles.selectedTab}>Loan</Tab>
          <Tab selectedClassName={negotiationStyles.selectedTab}>Insurance</Tab>
          <Tab selectedClassName={negotiationStyles.selectedTab}>
            Registration
          </Tab>
        </TabList>

        <TabPanel>
          <section className={negotiationStyles["basic-info"]}>
            Transaction ID: {this.props.data.data.id}
            <br />
            VIN: {this.props.data.data.vin_number}
            <br />
            Price: {this.props.data.data.actual_price}
            <br />
            Status: {`Dealer ${this.props.data.data.status}`}
          </section>
        </TabPanel>
        <TabPanel>
          <section className={negotiationStyles["loan-info"]}>
            Loan Status: {this.props.loan ? this.props.loan.status : ""}
            <br />
            APR: {this.props.loan ? this.props.loan.apr : ""}
            <br />
            Monthly Payment:{" "}
            {this.props.loan ? this.props.loan.monthly_payment : ""}
          </section>
        </TabPanel>
        <TabPanel>
          <section className={negotiationStyles["insurance-info"]}>
            Insurance Status:{" "}
            {this.props.insurance ? this.props.insurance.status : ""}
            <br />
            Insurance Start Date:{" "}
            {this.props.insurance ? this.props.insurance.start_date : ""}
            <br />
            Insurance End Date:{" "}
            {this.props.insurance ? this.props.insurance.end_date : ""}
            <br />
            Insurance Cost:{" "}
            {this.props.insurance ? this.props.insurance.monthly_cost : ""}
            <br />
            Insurance Coverage:{" "}
            {this.props.insurance ? this.props.insurance.coverage : ""}
          </section>
        </TabPanel>
        <TabPanel>
          <section className={negotiationStyles["registration-info"]}>
            Registration Status:{" "}
            {this.props.registration ? this.props.registration.status : ""}
            <br />
            Registration Start Date:{" "}
            {this.props.registration ? this.props.registration.startDate : ""}
            <br />
            Registration End Date:{" "}
            {this.props.registration ? this.props.registration.endDate : ""}
          </section>
        </TabPanel>
      </Tabs>
    );
  }
}

AcceptedTabs.propTypes = {
  tabListHandler: PropTypes.func,
  data: PropTypes.object,
  loan: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  insurance: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  registration: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default AcceptedTabs;
/* eslint-enable */
