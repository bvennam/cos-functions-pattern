const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cosInstance = require('./objectStorage');
const config = require('./config.js');

const app = express();
const port = 3000;

const bucketName = config.COSBucketName;
const processedBucketName = config.COSProcessedBucketName;
app.use(fileUpload());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/write', (req, res, next) => {
  console.log('Creating object');
  console.log(req.files.body)
  let url = '';
  cosInstance.putObject({
    Bucket: bucketName,
    Key: req.files.body.name,
    Body: req.files.body.data,
  }).promise()
    .then(() => {
      console.log("HERE")
      console.log(`${req.files.body.name} uploaded to Object Storage`);
      console.log(req.files.body.name);
      url = cosInstance.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: req.files.body.name,
      });
      console.log("URL", url);
      return res.json({ name: req.files.body.name, url });
    })
    .catch((error) => {
      console.log(`Did you create a bucket with name "${bucketName}"?`);
      console.log(error);
    });
});

app.post('/getSignedUrl', (req, res, next) => {
  console.log("BODY");
  console.log(req.body);
  const url = cosInstance.getSignedUrl('getObject', {
    Bucket: processedBucketName,
    Key: req.body.filename,
  });
  console.log("HERE2");
  console.log(url);
  return res.json({ url });

// return cosInstance.getSignedUrl('getObject',{
//     Key: req.body.data
// })
});

// serve static file (index.html, images, css)
app.use(express.static(`${__dirname}/ui`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))