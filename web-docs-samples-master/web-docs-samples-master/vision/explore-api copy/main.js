// Copyright 2015, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var CV_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + window.apiKey;
var descriptionStr = "";

$(function () {
  $('#picfileform').on('submit', uploadFiles);
});

/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles (event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#picfileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile (event) {
  var content = event.target.result;
  sendFileToCloudVision(content.replace('data:image/jpeg;base64,', ''));
}

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision (content) {
  var type = $('#picfileform [name=type]').val();

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: type,
        maxResults: 200
      }]
    }]
  };

  $('#results').text('Loading...');
  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
  }).done(displayJSON);
}

/**
 * takes data and stringifies it
 * returns a string containing just the description words separated by comma
 */
function makeDescripStr (data) {
  var contents = JSON.stringify(data, null, 4);

  var resultsArr = contents.match(/description\":\s\".*\"/g);

  var i = 0;
  var descriptionStr = "";
  for(i=0; i<resultsArr.length; i++){
    descriptionStr += resultsArr[i].substring(resultsArr[i].indexOf("d")+15,resultsArr[i].length-1)+", ";
  }

  document.write(descriptionStr);

  <div id="translation"></div>

    function translateText(response) {
      document.getElementById("translation").innerHTML += "<br>" + response.data.translations[0].translatedText;
    }

    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    var sourceText = escape(document.getElementById("sourceText").innerHTML);
    // WARNING: Your API key will be visible in the page source.
    // To prevent misuse, restrict your key to designated domains or use a
    // proxy to hide your key.
    var target = "";
    if(document.getElementById("lang").selected == 0)
    {
      target = "en";
    }
    else if(document.getElementById("lang").selected == 1)
    {
      target = "fr";
    }
    else if(document.getElementById("lang").selected == 2)
    {
      target = "de";
    }
    else if(document.getElementById("lang").selected == 3)
    {
      target = "ja";
    }

    var source = 'https://www.googleapis.com/language/translate/v2?key=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1vwzLxg2DFPFf&source=en&target=' +target+ '&callback=translateText&q=' + sourceText;
    newScript.src = source;
    results.textContent+=descriptionStr+newScript;
  //document.write(descriptionStr);
}
