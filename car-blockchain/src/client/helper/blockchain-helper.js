/* eslint-disable no-console, no-undef, no-magic-numbers */

/*
* @params: path(string), payloadData(object), category(string)
* @return: data(object)
* description: blockchain service post handler
*/
const postHandler = function(path, payloadData, category) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payloadData.bearToken}`
    },
    body: JSON.stringify(payloadData)
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json().then(data => {
        if (category) {
          return data[category];
        } else {
          return data;
        }
      });
    })
    .catch(err => {
      throw new Error(`Error Updating ${category} ${err},`);
    });
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service dealer to user
*/
const dealerUser = function(payloadData) {
  return postHandler(
    "/blockchain-dealer-user",
    {
      bearToken: payloadData.bearToken,
      peers: payloadData.peers,
      ssn: payloadData.ssn,
      vin: payloadData.vin,
      comment: payloadData.comment,
      action: payloadData.action
    },
    "transaction"
  );
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service user to dealer
*/
const userDealer = function(payloadData) {
  return postHandler(
    "/blockchain-user-dealer",
    {
      bearToken: payloadData.bearToken,
      peers: payloadData.peers,
      vin: payloadData.vin,
      request_price: payloadData.request_price,
      comment: payloadData.comment
    },
    "transaction"
  );
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service user to banker
*/
const userBanker = function(payloadData) {
  return postHandler("/blockchain-user-banker", {
    bearToken: payloadData.bearToken,
    peers: payloadData.peers,
    vin: payloadData.vin,
    month: payloadData.month,
    price: payloadData.price,
    comment: payloadData.comment
  });
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service user to banker
*/
const userInsurance = function(payloadData) {
  return postHandler("/blockchain-user-insurance", {
    bearToken: payloadData.bearToken,
    peers: payloadData.peers,
    vin: payloadData.vin
  });
};

const queryRegistration = function() {
  /* Waiting for regsitration blockchain query url */
};

module.exports = {
  userDealer,
  userBanker,
  userInsurance,
  dealerUser,
  queryRegistration
};

/* eslint-enable */
