// Attempt to check if the VR text url is available, if not retry in 10 seconds.
// The signed url is generated before the item becomes available in the COS bucket.
function tryTextUrl(theUrl) {
  $.ajax({
    type: 'GET',
    url: theUrl,
    error: (e) => {
      setTimeout(() => { tryTextUrl(theUrl); }, 10000);
    },
    success: (result) => {
      const txtParagraph = document.getElementById('vr-text');
      txtParagraph.innerHTML = result;
    },
  });
}

// Attempt to check if the processed image url is available, if not retry in 10 seconds.
// The signed url is generated before the item becomes available in the COS bucket.
function tryUrl(theUrl) {
  $.ajax({
    type: 'GET',
    url: theUrl,
    error: (e) => {
      setTimeout(() => { tryUrl(theUrl); }, 10000);
    },
    success: (result) => {
      const greyImage = document.getElementById('grey-image');
      greyImage.src = theUrl;
    },
  });
}

// get the signed url for a specific file.
function getSignedUrl(suffix) {
  // build the file name based on the original file + suffix provided
  const file = document.getElementById('theFile').files[0];
  let { name } = file;
  const indexOfLastPeriod = name.lastIndexOf('.');
  name = name.substring(0, indexOfLastPeriod != -1 ? indexOfLastPeriod : name.length);
  name += suffix;

  // get signedUrl for the filename we just built.
  const settings = {
    url: '/getSignedUrl',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    processData: false,
    data: JSON.stringify({ filename: name }),
  };
  return new Promise((resolve) => {
    $.ajax(settings).done((response) => {
      resolve(response.url);
    });
  });
}

// this function will upload the image to COS and get signedurls for uploaded images
async function uploadImageAndGetProcessedImages() {
  const form = document.getElementById('myform');
  const data = new FormData(form);

  try {
    const response = await $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: '/write',
      data,
      processData: false,
      contentType: false,
      cache: false,
      timeout: 60000,
    });
    const image = document.getElementById('original-image');
    image.src = response.url;
    const grayUrl = await getSignedUrl('_grey.png');
    const vrUrl = await getSignedUrl('_vr.txt');
    setTimeout(() => { tryTextUrl(vrUrl); }, 45000);
    setTimeout(() => { tryUrl(grayUrl); }, 45000);
  } catch (error) {
    console.log('ERROR : ', error);
  }
}
