"use strict";

const http = require("http");
const querystring = require("querystring");
const plugin = {};
const HOST = "codechix-service.blockchain.uofa.edu";
const PORT = "8000";

/* eslint-disable no-console */
plugin.register = function(server, option1, next) {
  server.route({
    method: "GET",
    path: "/vehicles",
    handler: (request, reply) => {
      const options = {
        host: HOST,
        path: "/api/vehicle",
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
    method: "GET",
    path: "/addvehicle",
    handler: (request, reply) => {
      //get postData from request
      const postData = querystring.stringify({
        vin_number: "123123",
        vehicle_type: "Sedan",
        vehicle_make: "Mercedes Benz",
        vehicle_model: "C300",
        vehicle_year: "2015",
        vehicle_color: "Blue",
        list_price: "30000",
        actual_price: "26000"
      });

      const options = {
        host: HOST,
        path: "/api/vehicle",
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
    path: "/editvehicle",
    handler: (request, reply) => {
      //get from id and postData from request
      const id = "123456";
      const postData = querystring.stringify({
        actual_price: "21000"
      });

      const options = {
        host: HOST,
        path: `/api/vehicle/${id}`,
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
  name: "vehiclesPlugin",
  version: "0.0.1"
};

module.exports = plugin;
/* eslint-enable */
