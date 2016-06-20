var express = require('express'),
bodyParser = require('body-parser'),
    //auth = require('./modules/auth'),
    conges = require('./modules/conges'),
    //hello = require('./modules/hello')
    app = express();
var moment = require('moment');
moment().format();

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

// Fonction HELLO
/*

-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------


                  ///     ///      ///////////     ///         ///          ///////////
                 ///     ///      ///             ///         ///          ///     ///
                ///     ///      ///             ///         ///          ///     ///
               ///////////      ////////        ///         ///          ///     ///
              ///     ///      ///             ///         ///          ///     ///
             ///     ///      ///////////     ////////    ////////     ///////////


-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------*/

             


    controller.hears(['hello','salut','bonjour'], 'direct_message,direct_mention,mention', (bot,message) => {
      bot.reply(message, {
        text: `Salut`
      });
    });


// Congés Restants
/*

-----------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------


                  ///////////     ///////////     ///     ///     ///////////     ///////////     ///////////
                 ///     ///     ///     ///     /////   ///     ///     ///     ///             ///          
                ///             ///     ///     /// //  ///     ///             ///             ///
               ///             ///     ///     ///  // ///     ///   /////     ////////        ///////////
              ///     ///     ///     ///     ///   /////     ///     ///     ///                     ///
             ///////////     ///////////     ///     ///     ///////////     ///////////     ///////////     


----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------*/
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
        "footer_icon": "http://www.twelve-consulting.com/wp-content/uploads/2015/02/logo-TWELVE-small.png",
        }]
      }

      bot.reply(message, reply_with_attachments);
    });


// Salle de Réunion
/*

-----------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------


                  ///////////     ///////////     ///     ///     ///     ///     ///     ///////////     ///     ///     
                 ///     ///     ///             ///     ///     /////   ///     ///     ///     ///     /////   ///                
                ///   ///       ///             ///     ///     /// //  ///     ///     ///     ///     /// //  ///     
               ///  ///        ////////        ///     ///     ///  // ///     ///     ///     ///     ///  // ///             
              ///    ///      ///             ///     ///     ///   /////     ///     ///     ///     ///   /////                       
             ///      ///    ///////////     ///////////     ///     ///     ///     ///////////     ///     ///             


----------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------*/

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
              "footer_icon": "http://www.twelve-consulting.com/wp-content/uploads/2015/02/logo-TWELVE-small.png",
            }]
         };
        convo.say(reply_with_attachments);
      }
      bot.startConversation(message, askReserver);
    });

// Time sheets ( test d'arbre de conversation )
/*------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------


      ///////////     ///     ///       ///     ///////////     ///////////     ///     ///     ///////////     ///////////     ///////////     ///////////     
         ///         ///     /////   /////     ///             ///             ///     ///     ///             ///                 ///         ///            
        ///         ///     /// ///// ///     ///             ///             ///     ///     ///             ///                 ///         /// 
       ///         ///     ///  ///  ///     ////////        ///////////     ///////////     ////////        ////////            ///         ////////////        
      ///         ///     ///       ///     ///                     ///     ///     ///     ///             ///                 ///                  ///                     
     ///         ///     ///       ///     ///////////     ///////////     ///     ///     ///////////     ///////////         ///         ////////////


-------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/

  controller.hears(['timesheets','timesheet','TS','Timesheet','Timesheets','ts'], 'direct_message', (bot, message) => {
    var timesheet = { 
      "am": "",
      "pm": "" 
    };
    askTimesheets = function(response, convo) {
      var reply_with_attachments = {
        'text': `Voici, ce que vous avez fait hier.`,
        "attachments": [ {
          "fallback": "Journée du 19 juin",
          "color": "#e8878e",

          "title": "Journée du 19 juin",

          "fields": [
            {  "title": "Matin",
               "value": "Mission - BPI cadrage CRM",
               "short": "true"
            },
            {  "title": "Après-Midi",
               "value": "Développement Offre - Acculturation Digitale",
               "short": "true"
            }
          ],
        "footer": "Twelve consulting",
        "footer_icon": "http://www.twelve-consulting.com/wp-content/uploads/2015/02/logo-TWELVE-small.png",
        }]
      }
      convo.say(reply_with_attachments);
      convo.next();
      convo.ask('Remplissons vos timesheets : Avez-vous fait la même chose qu\'hier ? oui/non' , function(response, convo){
        if (response.text == 'oui') {
          var attachment_timesheetajd = {
            'text': `D\'accord. Je rentre ca dans le CRM.`,
            "attachments": [ {
              "fallback": "Journée du 20 juin",
              "color": "#88221e",

              "title": "Journée du 20 juin",

              "fields": [
                {  "title": "Matin",
                  "value": "Mission - BPI cadrage CRM",
                  "short": "true"
                },
                {  "title": "Après-Midi",
                  "value": "Développement Offre - Acculturation Digitale",
                  "short": "true"
                }
              ],
            "footer": "Twelve consulting",
            "footer_icon": "http://www.twelve-consulting.com/wp-content/uploads/2015/02/logo-TWELVE-small.png",
            }]
          }
        convo.say(attachment_timesheetajd);
        }
        else{
          askMatin(response,convo);
        }
      });
    }
    askMatin = function(response,convo){
      convo.say('Voici les 4 sujets sur lesquels vous avez travaillé récemment'
                +'\n'+ "1 - Mission - BPI Cadrage CRM"
                +'\n'+ "2 - Mission - IPSEN CI News"
                +'\n'+ "3 - Developpement Offre - Acculturation Digitale"
                +'\n'+ "4 - Mission - BPI Hub"
                +'\n'+ "Autre")
      convo.next();
      convo.ask('Avez-vous travaillé sur l\'un de ces sujets ce matin? (Si oui répondre avec le numéro)' , [
        {
        pattern: '1',
        callback: function(response,convo) {
          timesheet.am = "Mission - BPI Cadrage CRM";
          convo.next();
          askApresMidi(response,convo);
          convo.next();
          }
        },
        {
        pattern: '2',
        callback: function(response,convo) {
          timesheet.am = "Mission - IPSEN CI News";
          convo.next();
          askApresMidi(response,convo);
          convo.next();
          }
        },
        {
        pattern: '3',
        callback: function(response,convo) {
          timesheet.am = "Developpement Offre - Acculturation Digitale";
          convo.next();
          askApresMidi(response,convo);
          convo.next();
          }
        },
        {
        pattern: '4',
        callback: function(response,convo) {
          timesheet.am = "Mission - BPI Hub";
          convo.next();
          askApresMidi(response,convo);
          convo.next();
          }
        },
        {
        default: true,
        callback: function(response,convo) {
          convo.say('Je suis désolé, je ne peux répondre à votre requête. Je vous propose d\'aller directement sur le CRM pour remplir vos timesheets'
                    +'\n'+ 'Voici le lien :'
                    +'\n'+ 'https://twelve.my.salesforce.com/home/home.jsp');
          convo.next();
          }
        }
      ]);
    }
    askApresMidi = function(response,convo){
      convo.ask('Avez-vous travaillé sur l\'un de ces sujets ce matin? (Si oui répondre avec le numéro)' , [
        {
        pattern: '1',
        callback: function(response,convo) {
          timesheet.pm = "Mission - BPI Cadrage CRM";
          convo.next();
          printTS(response,convo);
          convo.next();
          }
        },
        {
        pattern: '2',
        callback: function(response,convo) {
          timesheet.pm = "Mission - IPSEN CI News";
          convo.next();
          printTS(response,convo);
          convo.next();
          }
        },
        {
        pattern: '3',
        callback: function(response,convo) {
          timesheet.pm = "Developpement Offre - Acculturation Digitale";
          convo.next();
          printTS(response,convo);
          convo.next();
          }
        },
        {
        pattern: '4',
        callback: function(response,convo) {
          timesheet.pm = "Mission - BPI Hub";
          convo.next();
          printTS(response,convo);
          convo.next();
          }
        },
        {
        default: true,
        callback: function(response,convo) {
          convo.say('Je suis désolé, je ne peux répondre à votre requête. Je vous propose d\'aller directement sur le CRM pour remplir vos timesheets'
                    +'\n'+ 'Voici le lien :'
                    +'\n'+ 'https://twelve.my.salesforce.com/home/home.jsp');
          convo.next();
          }
        }
      ]);
    }
    printTS = function(response,convo){
      var attachment_timesheetajd = {
        'text': `D\'accord. Je rentre ca dans le CRM.`,
        "attachments": [ {
          "fallback": "Journée du 20 juin",
          "color": "#88221e",
          "title": "Journée du 20 juin",
          "fields": [
            {  "title": "Matin",
               "value": timesheet.am,
               "short": "true"
            },
            {  "title": "Après-Midi",
               "value": timesheet.pm,
               "short": "true"
            }
          ],
          "footer": "Twelve consulting",
          "footer_icon": "http://www.twelve-consulting.com/wp-content/uploads/2015/02/logo-TWELVE-small.png",
        }]
      }
        convo.say(attachment_timesheetajd);
        convo.next();
    }
   bot.startConversation(message, askTimesheets);
  });

// Fonction HELLO
/*

-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------


                  ////////         ///////////     ///////////     ///////////     ///////////
                 ///    ///       ///     ///         ///         ///             ///       
                ///     ///      ///     ///         ///         ///             ///   
               ///     ///      ///////////         ///         ////////        /////////// 
              ///    ///       ///     ///         ///         ///                     ///          
             /////////        ///     ///         ///         ///////////     /////////// 


-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------*/

  controller.hears(['date'], 'direct_message', (bot, message) => {
    var now = newDate();
    bot.say(message,now);
  })





app.post('/conges', conges.execute);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  //auth.login();
});
