# cos-functions-pattern


1. Create COS Service
1. Create Bucket with name "x"
1. Create Bucket with name "x-processed"
1. Create Watson Visual Recognition Service
1. Create COS experimental trigger change feed from instructions (link)
1. create env var for your watson vr service credentials, package name, trigger name, bucketname, etc.
1. run wskdeploy on manifest.yaml 
1. Bind service credentials for created cloud object storage dependency (bx wsk service bind cloud-object-storage cloud-object-storage)
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