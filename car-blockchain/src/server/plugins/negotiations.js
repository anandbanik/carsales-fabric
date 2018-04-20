"use strict";

const http = require("http");
const querystring = require("querystring");
const plugin = {};

/* eslint-disable no-console */
plugin.register = (server, options1, next) => {
  server.route({
    method: "GET",
    path: "/negotiations",
    handler: (request, reply) => {
      const options = {
        host: "10.117.138.202",
        path: "/api/negotiation",
        port: "8000"
      };

      const req = http.get(options, (res) => {
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
    }
  });

  server.route({
    method: "POST",
    path: "/create-negotiation",
    handler: (request, reply) => {
      const postData = querystring.stringify({
        ssn_number: request.payload.ssn_number,
        vin_number: request.payload.vin_number,
        actual_price: request.payload.actual_price,
        status: request.payload.status,
        comments: request.payload.comments
      });

      const options = {
        host: "10.117.138.202",
        path: "/api/negotiation",
        port: "8000",
        method: "POST",
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

  server.route({
    method: "PUT",
    path: "/update-negotiation",
    handler: (request, reply) => {
      const postData = querystring.stringify({
        ssn_number: request.payload.ssn_number,
        vin_number: request.payload.vin_number,
        actual_price: request.payload.actual_price,
        status: request.payload.status,
        comments: request.payload.comments
      });

      const options = {
        host: "10.117.138.202",
        path: "/api/negotiation/update",
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
  name: "negotiationsPlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
