import { createRequire } from "module";
import agingDocModel from '../models/agingDocument.model.js'
import imageModel from '../models/images.model.js'
import agingSeqModel from '../models/agingSequence.model.js'
import agingResultModel from '../models/agingResult.model.js'
import agedImageModel from '../models/agedImage.model.js'

const require = createRequire(import.meta.url);

const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-2" });

const sqs = new AWS.SQS({apiVersion: '2020-12-05'});

const checkMessages = async () => {

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
    sqs.receiveMessage(params, async function(err, data) {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {

        const message = JSON.parse(data.Messages[0].Body)

        if (message.success != true) {
          const failed = await agingDocModel.updateById(parseInt(message.doc_id), {'status': 'aging_failed'});
          console.log("Aging failed");
        }
        else {
          // save aging results to agingResults
          const success = await agingDocModel.updateById(parseInt(message.doc_id), {'status': 'aging_complete'});
          const newResult = {
            'agingDocument': parseInt(message.doc_id),
            'sequenceID': parseInt(message.sequence_ids) // currently only supports 1 sequence id
          }
          const result = await agingResultModel.create(newResult);          

          // save aged image to agedImage
          
          // get age
          const agingSeq = await agingSeqModel.findById(parseInt(message.sequence_ids));
          const age = agingSeq.age;

          // get image name
          const agingDoc = await agingDocModel.findById(parseInt(message.doc_id))
          const originalImage = await imageModel.findById(agingDoc.originalImage);
          const imageName = originalImage.uri.replace(/^.*[\\\/]/, '');
          const name = imageName.substring(0, imageName.lastIndexOf('.'));
          const ext = imageName.substring(imageName.lastIndexOf('.'));
          const parent = originalImage.uri.substring(0, originalImage.uri.lastIndexOf('/')+1);

          // get uri of aged image
          const agedImg = parent + name + '_' + age.toString() + ext; 

          const newAgedImage = {
            'resultID': result,
            'uri': agedImg,
            'age': age
          }
          const _ = await agedImageModel.create(newAgedImage);

        }

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

export default checkMessages;