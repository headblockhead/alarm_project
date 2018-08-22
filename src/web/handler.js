'use strict';

var AWS = require('aws-sdk');

module.exports.detect = detect;

const response = {
  statusCode: 200,
  body: JSON.stringify({ ok: true }),
};

function detect(event, context, callback) {
  console.log(event.body);

  var e = JSON.parse(event.body);

  var from = process.env.FROM_EMAIL_ADDRESS;
  var to = process.env.TO_EMAIL_ADDRESS;
  console.log({ "msg": "sending email", from, to });

  sendEmail(from, to, "Door", e.event)
    .then(function (data) {
      console.log({ emailsSent: 1 });
    })
    .catch(function (err) {
      console.log({ msg: "sending email failed", err });
    });

  callback(null, response);
}

function sendEmail(from, to, subject, body) {
  AWS.config.update({ region: 'eu-west-1' });
  var params = {
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: from,
  };

  var ses = new AWS.SES({ apiVersion: '2010-12-01' });
  return ses.sendEmail(params).promise();
}