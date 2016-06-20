//Hello
/* Le bot repond hello lorsque qu'on lui dit salut ou hello ou bonjour.*/

var org = require('./auth').org,

    CONGES_TOKEN = process.env.SLACK_CONGES_TOKEN;

function hello(req, res) {
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

exports.hello = hello;