var org = require('./auth').org,

    CONGES_TOKEN = process.env.SLACK_CONGES_TOKEN;

function execute(req, res) {

    if (req.body.token != CONGES_TOKEN) {
         res.send("Invalid token");
         return;
    }

     var limit = req.body.text;
     if (!limit || limit=="") limit = 5;

    //response mockup
    var fields = [];
    var attachments = [];
    fields.push({title: "CP N", value: 9, short:true});
    fields.push({title: "RTT", value: 1, short:true});
    fields.push({title: "RTT E", value: 1, short:true});
    attachments.push({color: "#FCB95B", fields: fields});
    res.json({
        response_type: "in_channel",
        text: "Solde : 11 jours",
        attachments: attachments
    });

}

exports.execute = execute;
