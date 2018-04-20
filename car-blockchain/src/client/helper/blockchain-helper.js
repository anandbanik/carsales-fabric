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

const getHandler = function(path, payloadData) {
  return fetch(path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${payloadData.bearToken}`
    }
  }).then(response => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json().then(data => {
      return data;
    });
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
* description: blockchain service banker to user
*/
const bankerUser = function(payloadData) {
  return postHandler("/blockchain-banker-user", {
    bearToken: payloadData.bearToken,
    peers: payloadData.peers,
    vin: payloadData.vin,
    apr: payloadData.apr
  });
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service broker to user
*/
const brokerUser = function(payloadData) {
  return postHandler("/blockchain-broker-user", {
    bearToken: payloadData.bearToken,
    peers: payloadData.peers,
    vin: payloadData.vin,
    ssn: payloadData.ssn
  });
};

/*
* @params: payloadData(object)
* @return: data(object)
* description: blockchain service dmv to user
*/
const registrationUser = function(payloadData) {
  return postHandler("/blockchain-registration-user", {
    bearToken: payloadData.bearToken,
    peers: payloadData.peers,
    vin: payloadData.vin,
    ssn: payloadData.ssn
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

const queryDMVDealer = function(payloadData) {
  return getHandler(`/blockchain-query-dmv-dealer?vin=${payloadData.vin}`, {
    bearToken: payloadData.bearToken
  });
};

const queryDMVRegistration = function(payloadData) {
  return getHandler(
    `/blockchain-query-dmv-registration?vin=${payloadData.vin}`,
    {
      bearToken: payloadData.bearToken
    }
  );
};

const queryDMVBanker = function(payloadData) {
  return getHandler(`/blockchain-query-dmv-banker?vin=${payloadData.vin}`, {
    bearToken: payloadData.bearToken
  });
};

const queryDMVInsurance = function(payloadData) {
  return getHandler(`/blockchain-query-dmv-insurance?vin=${payloadData.vin}`, {
    bearToken: payloadData.bearToken
  });
};

module.exports = {
  userDealer,
  userBanker,
  userInsurance,

  dealerUser,
  bankerUser,
  brokerUser,
  registrationUser,

  queryDMVDealer,
  queryDMVRegistration,
  queryDMVInsurance,
  queryDMVBanker
};

/* eslint-enable */
