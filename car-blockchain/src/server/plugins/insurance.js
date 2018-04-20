"use strict";

const http = require("http");
const querystring = require("querystring");

const plugin = {};

/* eslint-disable no-console */
plugin.register = (server, options1, next) => {
  server.route({
    method: "POST",
    path: "/get-insurance",
    handler: (request, reply) => {
      const postData = querystring.stringify(request.payload);

      const options = {
        host: "10.117.138.202",
        path: "/api/get/insurance",
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
    method: "GET",
    path: "/get-all-insurance",
    handler: (request, reply) => {
      const options = {
        host: "10.117.138.202",
        path: "/api/insurance",
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
    path: "/create-insurance",
    handler: (request, reply) => {
      const postData = querystring.stringify(request.payload);

      const options = {
        host: "10.117.138.202",
        path: "/api/insurance",
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
    method: "POST",
    path: "/update-insurance",
    handler: (request, reply) => {
      //get from id and postData from request
      const id = "3";
      const postData = querystring.stringify({
        monthly_cost: "100"
      });

      const options = {
        host: "10.117.138.202",
        path: `/api/insurance/${id}`,
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
  name: "insurancePlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
