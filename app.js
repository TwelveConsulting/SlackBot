var express = require('express'),
    bodyParser = require('body-parser'),
    conges = require('./modules/conges'),
    app = express();
var moment = require('moment');
moment.locale('fr');


var Botkit = require('botkit');
var controller = Botkit.slackbot();controller.configureSlackApp({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: 'http://localhost:3002',
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
});

controller.setupWebserver(process.env.port,function(err,webserver) {

  // set up web endpoints for oauth, receiving webhooks, etc.
  controller
    .createHomepageEndpoint(controller.webserver)
    .createOauthEndpoints(controller.webserver,function(err,req,res) { 
      if (err) {
        res.status(500).send('ERROR: ' + err);
      } else {
        res.send('Success!');
      } 
    })
    .createWebhookEndpoints(controller.webserver);

});