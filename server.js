var express = require('express'),
bodyParser = require('body-parser'),
    //auth = require('./modules/auth'),
    conges = require('./modules/conges'),
    app = express();

    const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

    var Botkit = require('botkit'),
    formatter = require('./modules/slack-formatter'),
    //salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
      token: SLACK_BOT_TOKEN
    });


    app.set('port', process.env.PORT || 5000);

    app.use(bodyParser.urlencoded({extended: true}));

    bot.startRTM(err => {
      if (err) {
        throw new Error('Could not connect to Slack');
      }
    });

    controller.hears(['hello'], 'direct_message,direct_mention,mention', (bot,message) => {
      bot.reply(message, {
        text: `Salut`
      })
    });

    controller.hears(['conges'], 'direct_message', (bot, message) => {
      var reply_with_attachments = {
        'text': `Ok, voila tes congés.`,
        "attachments": [ {
          "fallback": "Jours de congés restants",
          "color": "#dd4124",

          "title": "Congés",
          "title_link": "https://twelve.my.salesforce.com/?ec=302&startURL=%2Fhome%2Fhome.jsp",

          "text": "Voici votre solde de congés : 11",

          "fields": [
            {   "title": "CP N",
              "value": "9",
              "short":"true"
            },
            {   "title": "RTT",
              "value": "1",
              "short": "true"
            },
            {   "title": "RTT E",
              "value": "1",
              "short": "true"
            }
          ],
        "footer": "Twelve consulting",
        "footer_icon": "https://pbs.twimg.com/profile_images/603464163701166080/SItfdpqV.jpg",
        }]
      }

      bot.reply(message, reply_with_attachments);
    });


    controller.hears(['question me'], 'message_received,direct_message,direct_mention', function(bot,message) {

       // start a conversation to handle this response.
      bot.startConversation(message,function(err,convo) {

        convo.ask('How are you?',function(response,convo) {

          convo.say('Cool, you said: ' + response.text);
          convo.next();

        });

      })

    });

    controller.hears(['salle','reunion'], 'direct_message,direct_mention', (bot, message) => {
        askReserver = function(response1, convo) {
          convo.ask('Voulez vous réservez la salle de réunion de chez Twelve Consulting? (oui/non)', function(response, convo){

           if (response.text == 'non') {
             convo.say('OK désolé de vous avoir dérangé(e)');
             convo.stop();
           }
           else {
             var value = { 'text' : response.text };
             askDate(response, convo);
             convo.next();
           }
        });
      askDate = function(response, convo) {
        convo.ask('A quelle date?', function(response, convo) {
          convo.say('Ok. La reunion aura lieu le ' + value)
          //askHeureDebut(response3, convo);
          convo.next();
      });
    /*
      askHeureDebut = function(response, convo) {
        convo.ask('Quelle heure de début?', function(response, convo) {
          convo.say('Ok.');
          askHeureFin(reponse,convo);
          convo.next();
        });
      }
      askHeureFin = function(response, convo) {
        convo.ask('Quelle heure de fin?', function(response, convo) {
          convo.say('Ok.');
          askNom(reponse,convo);
          convo.next();
        });
      }
      askNom = function(response, convo) {
        convo.ask('A quel nom dois-je mettre la réunion?', function(response, convo) {
          convo.say('Ok.');
          printReunion(reponse,convo);
          convo.next();
        });
      }
      printReunion = function(response, convo) {
        var jour = convo.extractResponse('1');
        var hDeb = convo.extractResponse('2');
        var hFin = convo.extractResponse('3');
        var nom = convo.extractResponse('4');
        var reply_with_attachments = {
          'text': `Ok, voici le rendez vous pris.`,
          "attachments": [ {
            "fallback": "RDV",
            "color": "#f7cac9",
            "title": "Rendez-vous Salle Twelve",
            "fields": [
              { "title": "Jour",
                "value": jour,
                "short":"true"
              },
              { "title": "Début",
                "value": hDeb,
                "short": "true"
              },
              { "title": "Fin",
                "value": hFin,
                "short": "true"
              },
              { "title": "Organisateur",
                "value": nom,
                "short": "true"
              }
            ],
            "footer": "Twelve consulting",
            "footer_icon": "https://pbs.twimg.com/profile_images/603464163701166080/SItfdpqV.jpg",
          }]
        };
        convo.say(message,reply_with_attachments);*/
      }
      bot.startConversation(message, askReserver);
    });

    app.post('/conges', conges.execute);

    app.listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port'));
    //auth.login();
    });
