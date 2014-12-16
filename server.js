'use strict';

var CONFIG = require('config');

/**
 * Set up the server:
 */

var flatiron = require('flatiron');
var app = flatiron.app;

app.use(flatiron.plugins.http, {
  headers : {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers' : 'X-Requested-With'
  },
  before: [
    //Cross Origin Plugins to process OPTIONS (preflight) request
    function(req, res, next) {
      if (req.method === 'OPTIONS') {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers':
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
          'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Credentials': false,
          'Access-Control-Max-Age': '86400' // 24 hours
        });
        res.end();
      } else {
        next();
      }
    }
  ]
});


/**
 * Set up the model that this API will manage and wire it to an S3 bucket:
 */

var resourceful = require('resourceful');

app.use(require('resourceful-s3'), resourceful);
app.use(require('resourceful-model-recipe'), {
  'resourceful': resourceful

  , 'storage': 'S3'
  , 'storageOptions': {
      uri: CONFIG.aws.bucket
    , opts: {
        keyid: CONFIG.aws.accessKeyId
      , secret: CONFIG.aws.secretAccessKey
      , region: CONFIG.aws.region
      }
    }
  }
);


/**
 * Set this server up as a RESTful front-end to a model:
 */

app.use(require('restful'));


/**
 * Now launch the server:
 */

app.start(process.env.PORT || 5000);
