module.exports = (uname, role) => {
  let portNumber = "";
  let hostName = "";
  switch (role) {
    case "user":
      hostName = "api.dmv.blockchain.uofa.edu";
      portNumber = "4000";
      break;
    case "dealer":
      hostName = "api.dealer.blockchain.uofa.edu";
      portNumber = "4000";
      break;
    case "banker":
      hostName = "api.banker.blockchain.uofa.edu";
      portNumber = "4000";
      break;
    case "insurance":
      hostName = "api.insurance.blockchain.uofa.edu";
      portNumber = "4000";
      break;
    case "registration":
      hostName = "api.dmv.blockchain.uofa.edu";
      portNumber = "4000";
      break;
    default:
      hostName = "api.dmv.blockchain.uofa.edu";
      portNumber = "4000";
      break;
  }

  return fetch("/create-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: uname,
      portNumber,
      hostName
    })
  })
    .then(response => {
      // eslint-disable-next-line no-magic-numbers
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }

      return response.json().then(data => {
        return data.token;
      });
    })
    .catch(err => {
      console.log(`Error Fetching create-login plugin, ${err}`); // eslint-disable-line
    });
};
