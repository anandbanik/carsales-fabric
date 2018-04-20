import React from "react";
import PropTypes from "prop-types";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";

import cardStyles from "../../styles/card.css";

class CardComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card expanded={this.props.expanded} className={cardStyles.card}>
        <CardHeader
          title={this.props.title}
          subtitle={this.props.subtitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {this.props.details.map(item => {
            return Object.keys(item).map(key => {
              return <div key={key}><p>{`${key}: ${item[key]}`}</p><hr /></div>;
            });
          })}
        </CardText>
        <CardActions>
          <FlatButton label="View" onClick={this.props.handleToggle} />
        </CardActions>
      </Card>
    );
  }
}

CardComponent.propTypes = {
  expanded: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  details: PropTypes.array,
  handleToggle: PropTypes.func
};

export default CardComponent;
