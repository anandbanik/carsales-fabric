
module.exports = function (require) {

  let logger = require('log4js').getLogger('orchestrator');

  const ORG = process.env.ORG || null;
  if (ORG !== 'insurance') {
    logger.info('enabled for gateway only');
    return;
  }

  let invoke = require('../lib-fabric/invoke-transaction.js');
  let peerListener = require('../lib-fabric/peer-listener.js');

  logger.info('registering for block events');

  peerListener.registerBlockEvent(block => {
    try {
      block.data.data.forEach(blockData => {

        logger.info(`got block no. ${block.header.number}`);

        blockData.payload.data.actions.forEach(action => {
          let extension = action.payload.action.proposal_response_payload.extension;

          let event = extension.events;
          if(!event.event_name) {
            return;
          }

          logger.trace(`event ${event.event_name}`);

          if(event.event_name === 'registration') {
            //let payload = JSON.parse(event.payload.toString());
            let payload = event.payload.toString();
            //logger.trace('registration', JSON.stringify(payload));
            logger.trace('registration', payload)
            moveByEvent(payload);
          }
        }); // thru action elements
      }); // thru block data elements
    }
    catch(e) {
      logger.error('caught while processing block event', e);
    }
  });

  peerListener.eventHub.on('connected', function() {
    logger.info('connected');
  });

  function moveByEvent(payload) {
    
    let args = payload.split("@");
    logger.debug('invoking register of %s for %s', args[1], args[0]);
    
    return invoke.invokeChaincode(['peer0.dmv.walmartlabs.com:7051'], 'register',
      'register', 'register', args, 'orchestrator', ORG)
      .then(transactionId => {
        logger.info('applied success', transactionId);
        updateNodeService(payload)
      })
      .catch(e => {
        logger.error('application error', e);
      });
  }
  var http = require("http");
  function updateNodeService(payload) {

    let args = payload.split("@");
    var start_date = new Date();
    var end_date = new Date();
    start_date.setMinutes(start_date.getMinutes() - start_date.getTimezoneOffset())
    end_date.setMinutes(start_date.getMinutes() - start_date.getTimezoneOffset())
    end_date.setFullYear(start_date.getFullYear()+1)
    var post_req  = null,
    post_data = '{ "vin_number":"'+args[1]+'","status":"Apply","start_date":"'+start_date+'","end_date":"'+end_date+'","ssn_number":"'+args[0]+'"}';

    var post_options = {
    hostname: '10.117.138.202',
    port    : '8000',
    path    : '/api/registration',
    method  : 'POST',
    headers : {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Length': post_data.length
      }
    };

    post_req = http.request(post_options, function (res) {
      logger.info('STATUS: ' + res.statusCode);
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        logger.info('Response: ', chunk);
      });
    });

    post_req.on('error', function(e) {
      logger.info('problem with request: ' + e.message);
    });

    post_req.write(post_data);
    post_req.end();

}

};
