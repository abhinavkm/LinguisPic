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

$(function () {
  $('#fileform').on('submit', uploadFiles);
});

/**
* 'submit' event handler - reads the image bytes and sends it to the Cloud
* Vision API.
*/
function uploadFiles (event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#blah')
      .attr('src', e.target.result)
      .width(300)
      .height(300);
    };

    reader.readAsDataURL(input.files[0]);
  }
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
  var type = $('#fileform [name=type]').val();

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

function translateText(response) {
  console.log(response);
  document.getElementById("translation").innerHTML += "<br>" + response.data.translations[0].translatedText;
}

/**
* Displays the results.
*/
function displayJSON (data) {

  var config = {
    key : "AIzaSyCikwWkzwrWXDx2ovyBU0SGbibmcRiPfo4",
    target:document.getElementById("lang").value
  };
    // if(document.getElementById("lang").value == "fr")
    // {
    //   target = "fr";
    // }
    // else if((document.getElementById("lang").selected).equals("de"))
    // {
    //   target = "de"
    // }
    // else if((document.getElementById("lang").selected).equals("ja"))
    // {
    //   target = "ja"
    // }
    // else
    // {
    //   target = "de"
    // }



    //console.log(data);

    var origArr = new Array();
    var translationArr = new Array();

    var i=0;
    for(i=0; i<data.responses[0].labelAnnotations.length; i++){
      origArr[i] = " "+data.responses[0].labelAnnotations[i].description;
    }

    var promises = data.responses[0].labelAnnotations
    .map(function(item){
      return $.get("https://www.googleapis.com/language/translate/v2?key="+config.key+"&q="+item.description+"&target="+config.target);
    })

    Promise.all(promises).then(function(results){
        results = results.map(function(result) {
        return result.data.translations[0].translatedText;
        //document.write(results);

      })

       var j=0;
       for(j=0; j<results.length; j++){
            translationArr[j] = " "+results[j];
       }


       //console.log(results);
       //"English Words to Describe the Image:" origArr + "\n Translation to  " + translationArr;
       var text = document.createElement('div');
       text.innerHTML = "ENGLISH: "+origArr + "<br>" + document.getElementById("lang").value+": " +translationArr;
       document.body.appendChild(text);

    });



  }
