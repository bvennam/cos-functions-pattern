function tryTextUrl(theUrl) {
  $.ajax({
    type: 'GET',
    url: theUrl,
    error: (e) => {
      setTimeout(() => { tryTextUrl(theUrl); }, 10000);
    },
    success: (result) => {
      const txtParagraph = document.getElementById('vr-text')
      txtParagraph.innerHTML = result;
    },
  });
}

function getVrText() {
  const fileInput = document.getElementById('theFile');
  const file = fileInput.files[0];
  let { name } = file;
  const n = name.lastIndexOf('.');
  name = name.substring(0, n != -1 ? n : name.length);
  name += '_vr.txt'
  const settings = {
    url: '/getSignedUrl',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    processData: false,
    data: JSON.stringify({ filename: name })
  };
  $.ajax(settings).done((response) => {
    setTimeout(() => { tryTextUrl(response.url)}, 45000)
  });
}

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

function getGrayUrl() {
  const fileInput = document.getElementById('theFile');
  const file = fileInput.files[0];
  let { name } = file;
  const n = name.lastIndexOf('.');
  name = name.substring(0, n != -1 ? n : name.length);
  name += '_grey.png';
  const settings = {
    url: '/getSignedUrl',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    processData: false,
    data: JSON.stringify({ filename: name }),
  };

  $.ajax(settings).done((response) => {
    setTimeout(() => { tryUrl(response.url); }, 45000);
  });
}


  let settings = {
      'async': false,
      'crossDomain': true,
      'method': 'GET',
  }
function uploadImage() {
  settings.url = '/write';
  const form = document.getElementById('myform')
  var data = new FormData(form);

$.ajax({
    type: 'POST',
    enctype: 'multipart/form-data',
    url: '/write',
    data,
    processData: false,
    contentType: false,
    cache: false,
    timeout: 60000,
    success: (response) => {
      const image = document.getElementById('original-image')
      image.src = response.url;
      getGrayUrl();
      getVrText();
    },
    error: (e) => {
      // $('#result').text(e.responseText);
      console.log('ERROR : ', e);
    },
    complete: () => {
      console.log('COMPLETE');
    },
  });
}