module.exports = (uname, role) => {
  let portNumber = "";

  switch (role) {
    case "user":
      portNumber = "4000";
      break;
    case "dealer":
      portNumber = "4001";
      break;
    case "banker":
      portNumber = "4002";
      break;
    case "insurance":
      portNumber = "4003";
      break;
    case "registration":
      portNumber = "4004";
      break;
    default:
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
      portNumber
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
