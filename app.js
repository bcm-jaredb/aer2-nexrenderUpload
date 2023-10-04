const {name}  = require('./package.json')
const path = require('path')
const fs = require('fs');
require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

module.exports = (job, settings, { input, productionUID, output, ...options }, type) => {
    
    if (type != 'postrender') {
        throw new Error(`Action ${name} can be only run in postrender mode, you provided: ${type}.`)
    }

    settings.logger.log(`[${job.uid}] starting bcm-upload action`)

    let fileType='video/mp4';

    settings.logger.log(`[${job.uid}] [action-bcm-upload] input is set to ${input}`)
    settings.logger.log(`[${job.uid}] [action-bcm-upload] fileType is set to ${fileType}`)
    settings.logger.log(`[${job.uid}] [action-bcm-upload] job.output is set to ${job.output}`)

    return new Promise((resolve, reject) => {
    
        /* check if input has been provided */
        input = input || job.output;

        /* fill absolute/relative paths */
        if (!path.isAbsolute(input)) input = path.join(job.workpath, input);

        settings.logger.log(`[${job.uid}] [action-bcm-upload] input is set to ${input}`)

        // Create S3 service object
var s3 = new S3Client({
    region: "auto",
    endpoint: "https://"+process.env.CF_Account+".r2.cloudflarestorage.com",
    credentials:{
        accessKeyId: process.env.R2_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_KEY,
    }
  
  });
  
  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {Bucket: process.env.cfBucket, Key: '', Body: ''};
  
  // Configure the file stream and obtain the upload parameters
  
  var fileStream = fs.createReadStream(input);
  fileStream.on('error', function(err) {
    console.log('File Error', err);
    console.log("Error with bcm-upload")
                    console.log(error);
                return reject(new Error('Error in bcm-upload module'));
  });
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(file);
  
  // upload
  s3.send(new PutObjectCommand(uploadParams));

  console.log("Download %s from %s", upload.file.name, upload.url)
                if(options.eraseInput){
                    settings.logger.log(`[${job.uid}] [action-bcm-upload] erasing input ${input}`)
                    fs.unlinkSync(input)
                }
                settings.logger.log(`[${job.uid}] [action-bcm-upload] upload process complete`)
                resolve(job);
    })
}