import React from "react";
import PropTypes from "prop-types";

import "../styles/skeleton.css";
import "../styles/custom.css";
import "../styles/user.css";
import bannerStyles from "../styles/banner.css";

class Banner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`${bannerStyles["anim-banner"]} ${bannerStyles[this.props.className]}`}>
        <div className={bannerStyles.title}>
          <h2>{this.props.title}</h2>
        </div>
        <div className={`${bannerStyles["anim-1"]} ${bannerStyles.slide}`} />
        <div className={`${bannerStyles["anim-2"]} ${bannerStyles.slide3}`} />
        <div className={`${bannerStyles["anim-3"]} ${bannerStyles.slide2}`} />
      </div>
    );
  }
}

Banner.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string
};

export default Banner;
