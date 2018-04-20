/* eslint-disable no-console, no-undef, no-magic-numbers */

/*
* @params: path(string), category(string)
* @return: data(object)
* description: node service fetch transaction handler
*/
const fetchHandler = function(path, category) {
  return fetch(`${path}`)
    .then(response => {
      if (response.status >= 400) {
        throw new Error(`Bad response from server when fetching ${category}.`);
      }
      return response.json().then(data => {
        return data;
      });
    })
    .catch(err => {
      throw new Error(`Error Fetching ${category}`, err);
    });
};

/*
* @params: path(string), postData(object), category(string)
* @return: data(object)
* description: node service wisth bodyData fetch transaction handler
*/
const fetchWithDataHandler = function(path, postData, category) {
  return fetch(path, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(`Bad response from server when creating ${category}.`);
      }
      return response.json().then(data => {
        return data;
      });
    })
    .catch(err => {
      throw new Error(`Error Fetching ${category}`, err);
    });
};

const fetchVehicle = function() {
  return fetchHandler("/vehicles", "Vehicles");
};

const fetchInsurance = function(postData) {
  return fetchWithDataHandler("/get-insurance", postData, "Insurance");
};

const fetchLoan = function(postData) {
  return fetchWithDataHandler("/get-loan", postData, "Loan");
};

const fetchAllLoans = function() {
  return fetchHandler("/get-all-loans", "All Loans");
};

const fetchAllInsurances = function() {
  return fetchHandler("/get-all-insurance", "All Insurances");
};

const fetchNegotiations = function() {
  return fetchHandler("/negotiations", "Negotiations");
};

const fetchRegistrations = function() {
  return fetchHandler("/registrations", "Registrations");
};

const fetchRegistration = function(postData) {
  return fetchWithDataHandler("/get-registration", postData, "Registration");
};

/*
* @params: path(string), payloadData(object), category(string)
* @return: data(object)
* description: node service create transaction handler
*/
const createHandler = function(path, bodyData, category) {
  return fetch(path, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(`Bad response from server when creating ${category}.`);
      }
      return response.json().then(data => {
        return data;
      });
    })
    .catch(err => {
      throw new Error(`Error Updating ${category} ${err}`);
    });
};

const createNegotiation = function(bodyData) {
  return createHandler("/create-negotiation", bodyData, "Negotiation");
};

const createInsurance = function(bodyData) {
  return createHandler("/create-insurance", bodyData, "Insurance");
};

const createLoan = bodyData => {
  return createHandler("/create-loan", bodyData, "Loan");
};

const createRegistration = bodyData => {
  return createHandler("/create-registration", bodyData, "Registration");
};

/*
* @params: path(string), payloadData(object), category(string)
* @return: data(object)
* description: node service update transaction handler
*/
const updateHandler = function(path, bodyData, category) {
  return fetch(path, {
    credentials: "same-origin",
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bodyData)
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(`Bad response from server when updating ${category}.`);
      }
      return response.json().then(data => {
        return data;
      });
    })
    .catch(err => {
      throw new Error(`Error Updating ${category}`, err);
    });
};

const updateNegotiation = function(bodyData) {
  return updateHandler("/update-negotiation", bodyData, "Negotiation");
};

const updateTransaction = bodyData => {
  return updateHandler("/update-transaction", bodyData, "Transaction");
};

module.exports = {
  fetchVehicle,
  fetchLoan,
  fetchAllLoans,
  fetchNegotiations,
  fetchInsurance,
  fetchAllInsurances,
  fetchRegistrations,
  fetchRegistration,

  updateNegotiation,
  updateTransaction,

  createLoan,
  createNegotiation,
  createInsurance,
  createRegistration
};

/* eslint-enable */
