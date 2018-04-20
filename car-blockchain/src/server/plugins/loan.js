"use strict";

const http = require("http");
const querystring = require("querystring");

const plugin = {};
const HOST = "10.117.138.202";
const PORT = "8000";

/* eslint-disable no-console */
plugin.register = (server, options1, next) => {
  server.route({
    method: "POST",
    path: "/get-loan",
    handler: (request, reply) => {
      const postData = querystring.stringify(request.payload);
      const options = {
        host: HOST,
        path: "/api/get/loan",
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
    path: "/get-all-loans",
    handler: (request, reply) => {
      const options = {
        host: HOST,
        path: "/api/loan",
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
    path: "/create-loan",
    handler: (request, reply) => {
      const postData = querystring.stringify(request.payload);
      const options = {
        host: HOST,
        path: "/api/loan",
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

  next();
};

plugin.register.attributes = {
  name: "loanPlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
