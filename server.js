var express = require('express'),
    bodyParser = require('body-parser'),
    auth = require('./modules/auth'),
    conges = require('./modules/conges'),
    app = express();

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

var Botkit = require('botkit'),
    formatter = require('./modules/slack-formatter'),
    salesforce = require('./modules/salesforce'),

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
          }
        ]
    }

  bot.reply(message, reply_with_attachments);
});


app.post('/conges', conges.execute);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    //auth.login();
});
