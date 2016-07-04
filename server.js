var express = require('express'),
    bodyParser = require('body-parser'),
    //auth = require('./modules/auth'),
    conges = require('./modules/conges'),
    //hello = require('./modules/hello')
    app = express();
var moment = require('moment');
moment.locale('fr');

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
        var dateDeb;
        var dateFin;
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
            var dateSeule = /([0-3]?[0-9])/; 
            var dateMois = /([0-3]?[0-9]) (janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)/;
            var jourSeul = /(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/;
            var res = response.text;
            var tJS = jourSeul.exec(res);
            var tDM = dateMois.exec(res);
            var tDS = dateSeule.exec(res);
            if ( !(tDM === null)){
              var mois = moment().get('M'); //mois actuel
              var m=moment().month(tDM[2]).date(tDM[1]);
              var m2=moment().month(tDM[2]).date(tDM[1]);
              var moisVoulu = m.get('M');
              if (moisVoulu<mois){
                var m=m.add(1, 'year');
                var m2=m2.add(1, 'year');
              }   
              dateDeb = m;
              dateFin = m2;
              askHeureDebut(response, convo);
              convo.next();
            }
            else {  
              if (!( tDS === null)){
                var ajd = moment().date();
                var jourJ = tDS[1];
                if (jourJ < ajd) {
                  var m = moment().add(1, 'M').date(jourJ);
                  var m2 = moment().add(1, 'M').date(jourJ);
                }
                else{
                  var m = moment().date(jourJ);
                  var m2 = moment().date(jourJ);
                }
                dateDeb = m;
                dateFin =m2;
                askHeureDebut(response, convo);
                convo.next();
              }
              else {
                if (!(tJS === null)){
                  var jour = moment().date();
                  var n;
                  var jourJ=tJS[1];
                  switch (tJS[1]){
                    case 'lundi':
                       n=1;
                      break;
                    case "mardi":
                      n=2;
                      break;
                    case "mercredi":
                      n=3;
                      break;
                    case "jeudi":
                      n=4;
                      break;
                    case "vendredi":                        
                      n=5;
                      break
                    case "samedi":
                      n=6;
                      break;
                    default:
                     n=0;
                  }
                var m = moment().day(n);
                var m2 = moment().day(n);
                var dateVoulue = m.get('date');
                if (dateVoulue<jour) {
                  var m = m.add(7, 'days');
                  var m2 = m2.add(7, 'days');
                }
                dateDeb = m;
                dateFin =m2;
                askHeureDebut(response, convo);
                convo.next();
                }
                else {
                  if (res == "demain"){
                    var m = moment();
                    var m2 = moment();
                    m=m.add(1, 'day');
                    m2=m2.add(1, 'day');
                    dateDeb = m;
                    dateFin =m2;
                    askHeureDebut(response, convo);
                    convo.next();
                  }
                  else{
                    if ((res == "Ajd")|(res == "ajd")|(res == "Aujourd'hui")|(res == "aujourd'hui")|(res == "tout à l'heure")){
                      var m = moment();
                      var m2 = moment();
                      dateDeb = m;
                      dateFin =m2;
                      askHeureDebut(response, convo);
                      convo.next();
                    }
                    else{
                      if (res == "abandon"){
                        convo.say('OK désolé de vous avoir dérangé(e)');
                        convo.next();
                      }
                      else {
                        convo.say("Je n'ai pas compris votre demande. Veuillez réessayer en renvoyant par exemple  \" 12 juin \" ou répondre abandon.")
                        convo.next();
                        askDate(response,convo);
                        convo.next();
                      }
                    }
                  }
                }
              }
            }
          });
        }
      
        askHeureDebut = function(response, convo) {
          convo.ask('Quelle heure de début?', function(response, convo) {
            var hSeule = /([0-2]?[0-9])(?=(h|H))/;
            var hMin = /([0-2]?[0-9])(?:(h|H|:))([0-6]?[0-9])/;
            var res = response.text;
            var tHS = hSeule.exec(res);
            var tHM = hMin.exec(res);
            if (!(tHM === null)) {
              dateDeb.hour(tHM[1]).minute(tHM[3]).seconds(0);
            }
            else{
              dateDeb.hour(tHS[1]).minute(0).seconds(0);
            }
            askHeureFin(response,convo);
            convo.next();
          })
        }
        askHeureFin = function(response, convo) {
          convo.ask('Quelle heure de fin?', function(response, convo) {
            var hSeule = /([0-2]?[0-9])(?=(h|H))/
            var hMin = /([0-2]?[0-9])(?:(h|H|:))([0-6]?[0-9])/
            var res = response.text;
            var tHS = hSeule.exec(res);
            var tHM = hMin.exec(res);
            if (!(tHM === null)) {
              dateFin.hour(tHM[1]).minute(tHM[3]).seconds(0);
            }
            else{
              dateFin.hour(tHS[1]).minute(0).seconds(0);
            }
            askNom(response,convo);
            convo.next();
          });
        }
        askNom = function(response, convo) {
          convo.ask('A quel nom dois-je mettre la réunion?', function(response, convo) {
            value = {"nom": response.text};
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
                 "value": dateDeb.format('dddd D MMMM'),
                 "short":"true"
                },
                { "title": "Organisateur",
                  "value": value.nom,
                  "short": "true"
                },
                { "title": "Début",
                  "value": dateDeb.format('LT'),
                  "short": "true"
                },
                { "title": "Fin",
                  "value": dateFin.format('LT'),
                  "short": "true"
                },
                { "title": "Standard UTC Début",
                  "value": dateDeb.format(),
                  "short": "true"
                },
                { "title": "Standard UTC Début",
                  "value": dateFin.format(),
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
    var m = moment();
    var m2 = moment();
    var ajd = m;
    var hier = m2.subtract(1, 'days');
    var ajdPrint = "Journée du "+ajd.format("dddd D MMMM");
    var hierPrint = "Journée du "+hier.format("dddd D MMMM");
    askTimesheets = function(response, convo) {
      var reply_with_attachments = {
        'text': `Voici, ce que vous avez fait hier.`,
        "attachments": [ {
          "fallback": "Hier",
          "color": "#e8878e",

          "title": hierPrint,

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
              "fallback": "Ajd",
              "color": "#88221e",

              "title": ajdPrint,

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
        convo.next();
        convo.say(attachment_timesheetajd);
        convo.next();
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
      convo.ask('Avez-vous travaillé sur l\'un de ces sujets cet après-midi? (Si oui répondre avec le numéro)' , [
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
          "fallback": "Ajd",
          "color": "#88221e",
          "title": ajdPrint,
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

  controller.hears(['jour'], 'direct_message', (bot, message) => {
    askJour = function(response, convo){
      var dateSeule = /([0-3]?[0-9])/; 
      var dateMois = /([0-3]?[0-9]) (janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)/;
      var jourSeul = /(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/;
      convo.ask('Donne moi une date ?', function(response, convo) {
        convo.next();
        var res = response.text;
        var tJS = jourSeul.exec(res);
        var tDM = dateMois.exec(res);
        var tDS = dateSeule.exec(res);
        if ( !(tDM === null)){
          var mois = moment().get('M'); //mois actuel
          var m=moment().month(tDM[2]).date(tDM[1]);
          var moisVoulu = m.get('M');
          if (moisVoulu<mois){
            var m=m.add(1, 'year');
          }   
          convo.say(m.format('LLLL'));
          convo.next();
          
        }
        else {
          if (!( tDS === null)){
            var ajd = moment().date();
            var jourJ = tDS[1];
            if (jourJ < ajd) {
              var m = moment().add(1, 'M').date(jourJ);
              convo.say(m.format('LLLL'));
              convo.next();
            }
            else{
              var m = moment().date(jourJ);
              convo.say(m.format('LLLL'));
              convo.next();
            }
          }
          else {
            if (!(tJS === null)){
              var jour = moment().date();
              var n;
              var jourJ=tJS[1];
              switch (tJS[1]){
                case 'lundi':
                  n=1;
                  break;
                case "mardi":
                  n=2;
                  break;
                case "mercredi":
                  n=3;
                  break;
                case "jeudi":
                  n=4;
                  break;
                case "vendredi":
                  n=5;
                  break;
                case "samedi":
                  n=6;
                  break;
                default:
                  n=0;
              }
              var m = moment().day(n);
              var dateVoulue = m.get('date');
              if (dateVoulue<jour) {
                var m = m.add(7, 'days');
              }
              convo.say(m.format('LLLL'));
              convo.next();
            }
            else {
              if (res = "demain"){
                var m = moment();
                m=m.add(1, 'day');
                convo.say(m.format('LLLL'));
                convo.next();
              }
            }
          }
        }
      });   
    }
    bot.startConversation(message, askJour);
  });

// Récupération nom utilisateur et oAuth
/*

-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------


                  ///     ///////    
                 ///     ///   ///             
                ///     ///    ///   
               ///     ///    ///    /////// 
              ///     ///   ///     ///////       
             ///     ///////   


-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------*/
var https = require('https');
 
function getCall() {
    //initialize options values, the value of the method can be changed to POST to make https post calls
    var userAccessToken = 'xoxp-48833382512-48837226343-56636563042-e67f96d742';
    var options = {
        host :  'https://slack.com/api/users.list',
        port : 443,
        path : '/debug_token?input_token=' + userAccessToken,
        method : 'GET'
    }
 
    //making the https get call
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
            console.log( JSON.parse(data) );
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 
}
 
getCall();



app.post('/conges', conges.execute);
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  //////auth.login();
});
