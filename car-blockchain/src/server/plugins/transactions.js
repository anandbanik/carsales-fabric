"use strict";
/*eslint-env es6*/
const plugin = {};

const http = require("http");
const querystring = require("querystring");

/* eslint-disable no-console */
plugin.register = function(server, options1, next) {
  server.route({
    method: "PUT",
    path: "/update-transaction",
    handler: (request, reply) => {
      const id = request.payload.id;
      const postData = querystring.stringify({
        status: request.payload.loan_status,
        apr: request.payload.loan_apr
      });

      const options = {
        host: "10.117.138.202",
        path: `/api/loan/${id}`,
        port: "8000",
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, res => {
        const bodyChunks = [];
        res
          .on("data", (chunk) => {
            bodyChunks.push(chunk);
          })
          .on("end", () => {
            const body = Buffer.concat(bodyChunks);
            const results = JSON.parse(body);
            return reply(results);
          });
      });

      req.on("error", (e) => {
        console.log(`ERROR: ${e.message}`);
        return reply(`ERROR: ${e.message}`);
      });
      req.write(postData);
      req.end();
    }
  });

  next();
};

plugin.register.attributes = {
  name: "transactionsPlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
