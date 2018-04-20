import React from "react";
import { browserHistory } from "react-router";
import "../styles/normalize.css";
import "../styles/raleway.css";
import skeleton from "../styles/skeleton.css";
import custom from "../styles/custom.css";

export default () => (
  <div className={custom.container}>
    <section className={custom.header}>
    <h2>Weclome to DevPulseCon</h2>
      <h4 className={skeleton.title}>Please select your role:</h4>

      <div className={custom.buttonsList}>
        <button
          className={`${custom.user} ${custom.roleButton}`}
          onClick={() => {
            browserHistory.push("/user");
          }}
        >
          Buyer
        </button>
        <button
          className={`${custom.dealer} ${custom.roleButton}`}
          onClick={() => {
            browserHistory.push("/dealer");
          }}
        >
          Dealer
        </button>
        <button
          className={`${custom.banker} ${custom.roleButton}`}
          onClick={() => {
            browserHistory.push("/banker");
          }}
        >
          Banker
        </button>
        <button
          className={`${custom.broker} ${custom.roleButton}`}
          onClick={() => {
            browserHistory.push("/broker");
          }}
        >
          Insurance Broker
        </button>
        <button
          className={`${custom.dmv} ${custom.roleButton}`}
          onClick={() => {
            browserHistory.push("/registration");
          }}
        >
          DMV Registration
        </button>
      </div>
    </section>
  </div>
);
