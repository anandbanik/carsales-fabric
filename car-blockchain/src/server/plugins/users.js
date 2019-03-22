"use strict";

const http = require("http");
const querystring = require("querystring");

const plugin = {};
const HOST = "codechix-service.blockchain.uofa.edu";
const PORT = "8000";

/* eslint-disable no-console */
plugin.register = (server, options1, next) => {
  server.route({
    method: "GET",
    path: "/users",
    handler: (request, reply) => {
      const options = {
        host: HOST,
        path: "/api/customer",
        port: PORT
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
    path: "/adduser",
    handler: (request, reply) => {
      const postData = querystring.stringify({
        name: request.payload.name,
        phone: request.payload.phone,
        ssn_number: request.payload.ssn_number,
        address: request.payload.address
      });

      const options = {
        host: HOST,
        path: "/api/customer",
        port: PORT,
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
    method: "GET",
    path: "/edituser",
    handler: (request, reply) => {
      //get from id and postData from request
      const id = "9";
      const postData = querystring.stringify({
        address: "860 W California"
      });

      const options = {
        host: HOST,
        path: `/api/customer/${id}`,
        port: PORT,
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
  name: "usersPlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
