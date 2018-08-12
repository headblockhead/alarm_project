'use strict';

module.exports.detect = detect;

function detect(event, context, callback) {
  console.log(event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Your function executed successfully!',
      input: event, 
    }),
  };

  callback(null, response);
}