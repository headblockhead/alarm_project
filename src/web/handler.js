'use strict';

var AWS = require('aws-sdk');
var moment = require("moment");
var nunjucks = require("nunjucks");

module.exports.detect = detect;
module.exports.display = display;

const tableName = "doorTable";

function display(event, context, callback) {
  const dynamodb = new AWS.DynamoDB();

  const qs = event.queryStringParameters || {};
  let day = qs.day || moment().format('YYYY-MM-DD');

  var params = {
    ExpressionAttributeValues: {
      ":v1": { S: day }
    },
    KeyConditionExpression: "#id = :v1",
    TableName: tableName,
    ExpressionAttributeNames: {
      "#id": "day"
    }
  };
  dynamodb.query(params).promise()
    .catch(function (err) {
      console.log({ err, msg: "error querying database records" });
      callback(err, null);
      return;
    })
    .then(function (data) {
      nunjucks.configure('templates', { autoescape: true });
      const view = nunjucks.render('index.html', { 
        day,
        data: JSON.stringify(data.Items) 
      });
      callback(null, {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
        },
        body: view,
      });
    })
    .catch(function (err) {
      console.log({ err, msg: "error rendering templates" });
      callback(err, null);
    });
}

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
      "TableName": tableName,
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