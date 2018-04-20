import React from "react";
import PropTypes from "prop-types";
import { browserHistory } from "react-router";

import "../styles/skeleton.css";
import "../styles/custom.css";
import "../styles/dealer.css";
import sectionStyles from "../styles/section.css";
import carStyles from "../styles/car.css";

import mazdaImg from "../images/car-inventory/mazda.png";
import mazdaRedImg from "../images/car-inventory/mazda-red.png";
import blackMerc from "../images/car-inventory/black-c300.jpg";
import blueMerc from "../images/car-inventory/blue-c300.jpg";
import blueCivic from "../images/car-inventory/hondacivic-blue.jpg";

class Car extends React.Component {
  render() {
    const role = this.props.role;
    this.props = this.props && this.props.data;
    if (!this.props.img) {
      const color = this.props.vehicle_color.toLowerCase();
      const name = this.props.vehicle_make.toLowerCase();
      let img = "";
      switch (name) {
        case "mazda":
          switch (color) {
            case "red":
              img = mazdaRedImg;
              break;
            default:
              img = mazdaImg;
          }
          break;
        case "mercedes":
          switch (color) {
            case "black":
              img = blackMerc;
              break;
            case "blue":
              img = blueMerc;
              break;
            default:
              img = blackMerc;
          }
          break;
        case "honda":
          img = blueCivic;
          break;
        default:
          img = blackMerc;
      }
      this.props.img = img;
    }

    return (
      <section className={`${carStyles.car} ${sectionStyles["flex-container"]}`}>
        {/* Right Car Image */}
        <img className={`${carStyles["car-img"]}`} src={this.props.img} />

        {/* Middle Car Details */}
        <div className={`${carStyles["car-info"]}`}>
          <span className={`${carStyles["car-title"]}`}>
            Used {this.props.vehicle_year} {this.props.vehicle_make} {this.props.vehicle_model}
          </span>
          <br />
          Vehicle Type: {this.props.vehicle_type}
          <br />
          Exterior Color: {this.props.vehicle_color}
          <br />
          VIN: {this.props.vin_number}
        </div>

        {/* Right Car Price */}
        <div className={`${carStyles["car-price"]}`}>
          <span className={`${carStyles["car-price-sale"]}`}>
            Sale Price: {this.props.actual_price}
          </span>
          <br />
          List Price: {this.props.list_price}
          <br />
          <button
            className={ role === "dealer" ? `${carStyles.hide}` : ""}
            onClick={() => {
              browserHistory.push({
                pathname: "/car-details",
                state: this.props
              });
            }}
          >
            Details
          </button>
        </div>
      </section>
    );
  }
}

Car.propTypes = {
  img: PropTypes.string,
  vehicle_make: PropTypes.string,
  vehicle_model: PropTypes.string,
  vehicle_year: PropTypes.string,
  vehicle_color: PropTypes.string,
  actual_price: PropTypes.string,
  list_price: PropTypes.string,
  vin_number: PropTypes.string,
  data: PropTypes.object,
  vehicle_type: PropTypes.string,
  role: PropTypes.string
};

export default Car;
