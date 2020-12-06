import { createRequire } from "module";

const require = createRequire(import.meta.url);

const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-2" });

const sqs = new AWS.SQS({apiVersion: '2020-12-05'});

const checkMessages = () => {

  var queueURL = "https://sqs.us-east-2.amazonaws.com/726994880768/AprilEngine-ResultQueue";

  var params = {
      AttributeNames: [
          "SentTimestamp"
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
          "All"
      ],
      QueueUrl: queueURL,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 3
  };

  try {
    // Create an SQS service object
    sqs.receiveMessage(params, function(err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        // code here

        var deleteParams = {
          QueueUrl: queueURL,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    });
  } catch(err) {
    return "Error in SQS monitor"
  }
}

function start() {
  
};

export default checkMessages;