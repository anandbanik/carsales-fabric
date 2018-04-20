"use strict";

const http = require("http");
const plugin = {};

/* eslint-disable no-console*/

/*
* @params: reply(function), data(object), options(object)
* @return: results(object)
* description: server route handler
*/
const serverRouteHander = function(reply, data, options) {
  const postData = JSON.stringify(data);
  const req = http.request(options, res => {
    const bodyChunks = [];
    res
      .on("data", chunk => {
        bodyChunks.push(chunk);
      })
      .on("end", () => {
        const body = Buffer.concat(bodyChunks);
        const results = JSON.parse(body);
        return reply(results);
      });
  });

  req.on("error", e => {
    console.log(`ERROR: ${e.message}`);
    return reply(`ERROR: ${e.message}`);
  });
  req.write(postData);
  req.end();
};

plugin.register = (server, options1, next) => {
  /**
   * Dealer to User
   */
  server.route({
    method: "POST",
    path: "/blockchain-dealer-user",
    handler: (request, reply) => {
      const data = {
        peers: [request.payload.peers],
        fcn: request.payload.action,
        args:
          request.payload.action === "approve"
            ? [request.payload.ssn, request.payload.vin]
            : [
                request.payload.ssn,
                request.payload.vin,
                request.payload.comment
              ]
      };

      const options = {
        host: "10.117.163.109",
        path: "/channels/dmv-dealer/chaincodes/dealer",
        port: "4001",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.payload.bearToken}`
        }
      };

      return serverRouteHander(reply, data, options);
    }
  });

  /**
   * User to Dealer
   */
  server.route({
    method: "POST",
    path: "/blockchain-user-dealer",
    handler: (request, reply) => {
      const data = {
        peers: [request.payload.peers],
        fcn: "negotiate",
        args: [
          request.payload.vin,
          request.payload.request_price,
          request.payload.comment
        ]
      };

      const options = {
        host: "10.117.163.109",
        path: "/channels/dmv-dealer/chaincodes/dealer",
        port: "4000",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.payload.bearToken}`
        }
      };

      return serverRouteHander(reply, data, options);
    }
  });

  /**
   * User to Banker
   */
  server.route({
    method: "POST",
    path: "/blockchain-user-banker",
    handler: (request, reply) => {
      const data = {
        peers: [request.payload.peers],
        fcn: "loan",
        args: [
          request.payload.vin,
          request.payload.month.toString(),
          request.payload.price.toString()
        ]
      };

      const options = {
        host: "10.117.163.109",
        path: "/channels/dmv-banker/chaincodes/banker",
        port: "4000",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.payload.bearToken}`
        }
      };

      return serverRouteHander(reply, data, options);
    }
  });

  /**
   * User to Insurance
   */
  server.route({
    method: "POST",
    path: "/blockchain-user-insurance",
    handler: (request, reply) => {
      const data = {
        peers: [request.payload.peers],
        fcn: "apply",
        args: [
          request.payload.vin,
          "comprehensive",
          "12"
        ]
      };

      const options = {
        host: "10.117.163.109",
        path: "/channels/dmv-insurance/chaincodes/insurace",
        port: "4000",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${request.payload.bearToken}`
        }
      };

      return serverRouteHander(reply, data, options);
    }
  });

  next();
};

plugin.register.attributes = {
  name: "blockchainPlugin",
  version: "0.0.1"
};

module.exports = plugin;

/* eslint-enable */
