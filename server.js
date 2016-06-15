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

controller.hears(['conges'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `Ok, voila tes congés.`
    })
    app.post('/conges', conges.execute);
});

app.post('/conges', conges.execute);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    //auth.login();
});
