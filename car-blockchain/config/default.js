"use strict";

const defaultListenPort = 3000;

const portFromEnv = () => {
  const x = parseInt(process.env.PORT, 10);
  /* istanbul ignore next */
  return x !== null && !isNaN(x) ? x : defaultListenPort;
};

module.exports = {
  plugins: {
    inert: {
      enable: true
    },
    electrodeStaticPaths: {
      enable: true,
      options: {
        pathPrefix: "dist"
      }
    },
    "server/plugins/pwa": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/pwa"
    },
    "./server/plugins/users": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/users"
    },
    "./server/plugins/vehicles": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/vehicles"
    },
    "./server/plugins/transactions": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/transactions"
    },
    "./server/plugins/negotiations": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/negotiations"
    },
    "./server/plugins/loan": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/loan"
    },
    "./server/plugins/insurance": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/insurance"
    },
    "./server/plugins/registration": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/registration"
    },
    "./server/plugins/login": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/login"
    },
    "./server/plugins/blockchain": {
      module: "./{{env.APP_SRC_DIR}}server/plugins/blockchain"
    },
    webapp: {
      module: "electrode-react-webapp/lib/hapi",
      options: {
        pageTitle: "car-blockchain",
        paths: {
          "/{args*}": {
            content: {
              module: "./{{env.APP_SRC_DIR}}/server/views/index-view"
            }
          }
        }
      }
    }
  },
  connections: {
    default: {
      host: process.env.HOST,
      address: process.env.HOST_IP || "0.0.0.0",
      port: portFromEnv(),
      routes: {
        cors: true
      },
      state: {
        ignoreErrors: true
      }
    }
  }
};
