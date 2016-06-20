//Hello
/* Le bot repond hello lorsque qu'on lui dit salut ou hello ou bonjour.*/

var org = require('./auth').org,
 var Botkit = require('botkit'),
    //formatter = require('./modules/slack-formatter'),
    //salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
      token: SLACK_BOT_TOKEN
    });

    CONGES_TOKEN = process.env.SLACK_CONGES_TOKEN;

function execute(req, res) {
	if (req.body.token != CONGES_TOKEN) {
         res.send("Invalid token");
         return;
    }

     var limit = req.body.text;
     if (!limit || limit=="") limit = 5;

    //response mockup
	bot.reply(message, {
        text: `Salut`
      });
}

exports.execute = execute;