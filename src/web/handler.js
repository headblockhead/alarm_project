'use strict';

var AWS = require('aws-sdk');
var moment = require("moment");

module.exports.detect = detect;

const response = {
  statusCode: 200,
  body: JSON.stringify({ ok: true }),
};

function detect(event, context, callback) {
  console.log(event.body);

  var e = JSON.parse(event.body);

  console.log({ "msg": "writing to dynamodb" });

  var dynamodb = new AWS.DynamoDB();
  dynamodb.putItem(
    {
      "TableName": "doorTable",
      "Item": {
        "day": { "S": moment().format('YYYY-MM-DD') },
        "time": { "S": moment().format() },
        "week": { "S": moment().format('YYYY w') },
        "year": { "S": moment().format('YYYY') },
        "event": { "S": e.event },
      }
    }).promise()
    .then(function (result) {
      console.log({ recordsWritten: 1 });
    })
    .catch(function (err) {
      console.log({ err, msg: "error writing database records" });
    })
    .then(function () {
      callback(null, response)
    });
}