# cos-functions-pattern
## Summary
This pattern will set up a sample application to teach you about using IBM Cloud Object Storage from IBM Cloud Functions. There is also a web application component of this application, which will teach you about using the IBM Cloud Object Storage SDK for Node.js. In this application you will upload an image. That image will be stored in Cloud Object Storage, which will trigger your Serverless Cloud Functions to run. Those Cloud Functions will do some image processing and analysis - charcoaling the image and running visual recognition on the image. After the analysis and processing is done, the results will be stored in a different Cloud Object Storage Bucket, which can then be read from.

## Architecture

## Instructions
### Create Required Services on IBM Cloud
To run this application, you'll need to set up IBM Cloud Object Storage and the 
1. Create COS Service
1. Create Bucket with name "x"
1. Create Bucket with name "x-processed"
1. Create Watson Visual Recognition Service

### Create the Cloud Object Storage Service Binding
1. Create COS experimental trigger change feed from instructions (link)

### Create Required Environment Variables and Deploy Cloud Functions
1. create env var for your watson vr service credentials, package name, trigger name, bucketname, etc.
1. run wskdeploy on manifest.yaml 

### Bind Service Credentials to the Created Cloud Object Storage Package
1. Bind service credentials for created cloud object storage dependency (bx wsk service bind cloud-object-storage cloud-object-storage)

### Deploy the Web Application
1. To deploy local app: 
1. update config.js
1. create credentials.json based on credentials_template.json
1. run CORS update function on the bucket with something like this:

```
    CORSRules: [{
      AllowedHeaders: ['*'],
      AllowedMethods: ['PUT', 'GET', 'DELETE'],
      AllowedOrigins: ['*'],
    }],
```