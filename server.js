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


// Congés Restants

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


// Salle de Réunion

    controller.hears(['salle','reunion'], 'direct_message,direct_mention', (bot, message) => {
        var value ;
        askReserver = function(response1, convo) {
          convo.ask('Voulez vous réservez la salle de réunion de chez Twelve Consulting? (oui/non)', function(response, convo){
            if (response.text == 'non') {
              convo.say('OK désolé de vous avoir dérangé(e)');
              convo.next();
            }
            else {
              askDate(response, convo);
              convo.next();
           }
          });
        }
        askDate = function(response, convo) {
          convo.ask('A quelle date?', function(response, convo) {
            value = { 'date' : response.text };
            //convo.say('Ok. La reunion aura lieu le ' + value.date)
            askHeureDebut(response, convo);
            convo.next();
          });
        }
      
        askHeureDebut = function(response, convo) {
          convo.ask('Quelle heure de début?', function(response, convo) {
            value.hDeb = response.text;
            //convo.say('Ok.' + value.hDeb);
            askHeureFin(response,convo);
            convo.next();
          });
        }
        askHeureFin = function(response, convo) {
          convo.ask('Quelle heure de fin?', function(response, convo) {
            value.hFin = response.text;
            //convo.say('Ok.');
            askNom(response,convo);
            convo.next();
          });
        }
        askNom = function(response, convo) {
          convo.ask('A quel nom dois-je mettre la réunion?', function(response, convo) {
            value.nom = response.text;
            //convo.say('Ok.');
            printReunion(response,convo);
            convo.next();
          });
        }
        printReunion = function(response, convo) {
          var reply_with_attachments = {
            'text': `Ok, voici le rendez vous pris.`,
            "attachments": [ {
              "fallback": "RDV",
              "color": "#f7cac9",
              "title": "Rendez-vous Salle Twelve",
              "fields": [
                { "title": "Jour",
                 "value": value.date,
                 "short":"true"
                },
                { "title": "Début",
                  "value": value.hDeb,
                  "short": "true"
                },
                { "title": "Fin",
                  "value": value.hFin,
                  "short": "true"
                },
                { "title": "Organisateur",
                  "value": value.nom,
                  "short": "true"
                }
              ],
              "footer": "Twelve consulting",
              "footer_icon": "https://pbs.twimg.com/profile_images/603464163701166080/SItfdpqV.jpg",
            }]
         };
        convo.say(reply_with_attachments);
      }
      bot.startConversation(message, askReserver);
    });

// Time sheets ( test d'arbre de conversation )

  controller.hears(['timesheets'], 'direct_message', (bot, message) => {
    askTimesheets = function(response, convo) {
      var reply_with_attachments = {
        "attachements": [{
          "fallback": "Time Sheets",
          "color": "#e8878e",
          "title": 'Time Sheets du 16 juin',
          "fields": [
            { "title": "Matin",
              "value": "Mission - BPI cadrage CRM",
              "short": "true"
            },
            { "title": "Après-Midi",
              "value": "Développement Offre - Acculturation Digitale",
              "short": "true"
            }
          ]
          ,
          "footer": "Twelve consulting",
          "footer_icon": "https://pbs.twimg.com/profile_images/603464163701166080/SItfdpqV.jpg",
        }]
      };
      convo.ask(reply_with_attachments + 'Remplissons vos timesheets : Avez-vous fait la même chose qu\'hier ? oui/non' , function(response, convo){
        var timesheet;
        if (response.text == 'oui') {
          var attachment_timesheetajd = {
            "attachements": [{
              "fallback": "Time Sheets",
              "color": "#e8878e",
              "title": 'Time Sheets du 17 juin',
              "fields": [
                { "title": "Matin",
                  "value": "Mission - BPI cadrage CRM",
                  "short": "true"
                },
                { "title": "Après-Midi",
                  "value": "Développement Offre - Acculturation Digitale",
                  "short": "true"
                }
              ]
            }]
          }
          convo.say('Ok je remplis vos timesheets d\'aujourd\'hui'+ attachment_timesheetajd);
          convo.next();
        }
        else {
          convo.ask('D\'accord, qu\'avez vous fait ce matin ? (Répondez par 1, 2, 3 ... en fonction)'
            +'\n'+'1 - Mission'
            +'\n'+'2 - Développement Commercial'
            /*+'\n'+'3 - Développement Partenariat'
            +'\n'+'4 - Développement Offre'
            +'\n'+'5 - Administratif'
            +'\n'+'6 - Absence',*/
            [{
              pattern: '1',
              callback: function(response,convo) {
              convo.ask('D\'accord, sur laquelle ?'
                +'\n'+'1 - Mission - BPI Cadrage CRM'
                +'\n'+'2 - Mission - IPSEN CI News');
              switch(response.text) {
                case '1':
                  timesheet.matin = "Mission - BPI Cadrage CRM"
                  break;
                default:
                  timesheet.matin = "Mission - IPSEN CI News"
              };
              convo.next();
              }
            },
            {
              pattern: '2',
              callback: function(response,convo) {
              convo.ask('D\'accord, sur laquelle ?'
                +'\n'+'1 - Développement Commercial - DEVIALET'
                +'\n'+'2 - Développement Commercial - ABENEX'
                +'\n'+'2 - Développement Commercial - KLEPIERRE');
              switch(response.text) {
                case '1':
                  timesheet.matin = "Développement Commercial - DEVIALET"
                  break;
                case '2':
                  timesheet.matin = "Développement Commercial - ABENEX"
                  break;
                default:
                  timesheet.matin = "Développement Commercial - KLEPIERRE"
              };
              convo.next();
              }
            }]);
            convo.ask('D\'accord, qu\'avez vous fait cet après-midi ? (Répondez par 1, 2, 3 ... en fonction)'
            +'\n'+'1 - Mission'
            +'\n'+'2 - Développement Commercial'
            /*+'\n'+'3 - Développement Partenariat'
            +'\n'+'4 - Développement Offre'
            +'\n'+'5 - Administratif'
            +'\n'+'6 - Absence',*/
            [{
              pattern: '1',
              callback: function(response,convo) {
              convo.ask('D\'accord, sur laquelle ?'
                +'\n'+'1 - Mission - BPI Cadrage CRM'
                +'\n'+'2 - Mission - IPSEN CI News');
              switch(response.text) {
                case '1':
                  timesheet.apresmidi = "Mission - BPI Cadrage CRM"
                  break;
                default:
                  timesheet.apresmidi = "Mission - IPSEN CI News"
              };
              convo.next();
              }
            },
            {
              pattern: '2',
              callback: function(response,convo) {
              convo.ask('D\'accord, sur laquelle ?'
                +'\n'+'1 - Développement Commercial - DEVIALET'
                +'\n'+'2 - Développement Commercial - ABENEX'
                +'\n'+'2 - Développement Commercial - KLEPIERRE');
              switch(response.text) {
                case '1':
                  timesheet.apresmidi = "Développement Commercial - DEVIALET"
                  break;
                case '2':
                  timesheet.apresmidi = "Développement Commercial - ABENEX"
                  break;
                default:
                  timesheet.apresmidi = "Développement Commercial - KLEPIERRE"
              };
              convo.next();
              }
            }]
          );
        }
        var attachment_timesheetajd = {
          "attachements": [{
            "fallback": "Time Sheets",
            "color": "#e8878e",
            "title": 'Time Sheets du 16 juin',
            "fields": [
              { "title": "Matin",
                "value": timesheet.matin,
                "short": "true"
              },
              { "title": "Après-Midi",
                "value": timesheet.apresmidi,
                "short": "true"
              }
            ]
          }]
        };
        convo.say('Ok je remplis vos timesheets d\'aujourd\'hui'+ attachment_timesheetajd);
        convo.next();    
      };
    bot.startConversation(message, askTimesheets);
  });

    app.post('/conges', conges.execute);

    app.listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port'));
    //auth.login();
    });
