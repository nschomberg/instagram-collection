'use strict'
//let http = require('http');
let request = require('request');

let key = "3212451964.1677ed0.3df09055dce04fd48eab46209a267ea7";
let endPoint = "https://api.instagram.com/";
let prePath = "v1/tags/";
let postPath = "/media/recent?access_token=";

function getTag(tag){
  let path = `${prePath}${tag}${postPath}${key}`;
  console.log(path);

  var options = {
    url: endPoint + path,
    'method': 'GET',
  };

   request(options,function(error,response,body){
     console.log(response);
     //do what you want with this callback functon
  });
}

/*http.get({
        host: endPoint,
    }, function(response) {
       console.dir(response);
    });
*/

getTag('tecate');
