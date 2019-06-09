# cos-functions-pattern
## Summary
This pattern will set up a sample application to teach you about using IBM Cloud Object Storage from IBM Cloud Functions. There is also a web application component of this application, which will teach you about using the IBM Cloud Object Storage SDK for Node.js. In this application you will upload an image. That image will be stored in Cloud Object Storage, which will trigger your Serverless Cloud Functions to run. Those Cloud Functions will do some image processing and analysis - charcoaling the image and running visual recognition on the image. After the analysis and processing is done, the results will be stored in a different Cloud Object Storage Bucket, which can then be read from.

## Architecture
   ![](images/architecture.png)

## Instructions
### Prerequisites
1. An [IBM Cloud Account](https://cloud.ibm.com/register)
1. An [IBM Cloud CLI](https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-install-ibmcloud-cli#install_use) with the IBM Cloud Functions [Plugin](https://cloud.ibm.com/docs/openwhisk?topic=cloud-functions-cli_install) installed.

### Create Required Services on IBM Cloud
To run this application, you'll need to set up IBM Object Storage and the IBM Visual Recognition Service on IBM Cloud
1. Create a Cloud Object Storage Service Instance:
  1. From the catalog select [Object Storage](https://cloud.ibm.com/catalog/services/cloud-object-storage).
  1. Give your service a name, and click `Create`.
  1. In the left side menu, select `Buckets`, and then `Create bucket`.
  1. Give your bucket a unique name. 
  1. For Resiliency, select `Cross Region`, and for Location, select `us-geo`.
  1. Click `Create Bucket`.
  1. Create another bucket, with the same name suffixed by `-processed`. If your original bucket was `my-bucket`, then your new bucket will be `my-bucket-processed`.
  1. Again, ensure that you select `Cross Region` and `us-geo`.
  1. In the left side menu, click `Service Credentials`. Click `New Credential`.
  1. Check the checkbox for `Include HMAC Credential`. Click `Add`.

1. Create a Visual Recognition Service Instance
  1. From the catalog select [Visual Recognition](https://cloud.ibm.com/catalog/services/visual-recognition)
  1. Give your service a name, and click `Create`.
  1. In the left side menu, click `Service Credentials`. If there are no service credentials created, click `New Credential`. Once your Service Credentials are created, make note of your `apikey`.

### Login and set up your IBM Cloud CLI with Functions plugin
1. Login to the IBM Cloud CLI:
  ```
  ibmcloud login
  ```

1. List the namespaces available in IBM Cloud Functions:
  ```
  ibmcloud fn namespace list
  ```

1. Set your namespace using the ID found in the previous step:
  ```
  ibmcloud fn property set --namespace <namespace_id>
  ```

### Create the Cloud Object Storage Experimental Package Binding
IBM Cloud Functions has recently created an experimental package that introduces a feed action used during trigger creation to configure bucket-specific events. We will create a package binding to make the `whisk.system/cos-experimental` package avaliable in our namespace. This will enable us to set our own parameters on the package, such as required credentials.

1. Create the package binding:
  ```
  ibmcloud fn package bind /whisk.system/cos-experimental myCosPkg
  ```

1. Bind your Cloud Object Storage credentials to your package binding:
  ```
  ibmcloud fn service bind cloud-object-storage myCosPkg
  ```

### Create Required Environment Variables and Deploy Cloud Functions
To deploy the functions required in this application, we'll use the `ibm fn deploy` command. This command wil look for a `manifest.yaml` file defining a collection of packages, actions, triggers, and rules to be deployed. 
1. Take a look at the `serverless/manifest.yaml file`. You should see manifest describing the various actions, triggers, packages, and sequences to be created. You will also notice that there are a number of environment variables you should set locally before running this manifest file.

1. Choose a package name, trigger name, and rule name and then save the environment variables.
  ```
  export PACKAGE_NAME=<your_chosen_package_name>
  export RULE_NAME=<your_chosen_rule_name>
  export TRIGGER_NAME=<your_chosen_trigger_name>
  ```

1. You already chose a bucket name earlier when creating your COS Instance. Save that name as your BUCKET_NAME environment variable:
  ```
  export BUCKET_NAME=<your_bucket_name>
  ```

1. You will need to save the endpoint name, which is the COS Endpoint for your buckets. Since you selected us-geo when selecting your buckets, the endpoint should be `s3.us.cloud-object-storage.appdomain.cloud`
  ```
  export ENDPOINT=s3.us.cloud-object-storage.appdomain.cloud
  ```

1. Finally, you will need some information from the Visual Recognition service.  You saved your apikey earlier, so use that. This application is built against the version released on `2018-03-19`, so we'll use that value for VERSION.
  ```
  export API_KEY=<your_visual_recognition apikey>
  export VERSION=2018-03-19
  ```

1. You've set up some required credentials and various parameters for your IBM Cloud Functions. Let's deploy the functions now! Change directories to the `serverless` folder, and then deploy the functions.
  ```
  cd serverless
  ibmcloud fn deploy
  ```

1. `ibmcloud fn deploy`

### Bind Service Credentials to the Created Cloud Object Storage Package
1. The deploy command created a package for you called `cloud-object-storage`. This package contains some useful cloud functions for interacting with cloud object storage. Let's bind the service credentials to this package.
  ```
  ibmcloud fn service bind cloud-object-storage cloud-object-storage)
  ```

1. Congratulations! If you went directly to your cloud object storage bucket and added a file, you should see your trigger fire and some processed actions showing up in your `mybucket-processed` bucket. Let's deploy a simple application for uploading the images and showing these results.

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