import axios from "axios";
import md5 from "crypto-js/md5";
import base64 from "crypto-js/enc-base64";
import hmacSHA1 from "crypto-js/hmac-sha1";
import each from "lodash/each";
import queryString from "query-string";

export default class RequestTokenFactory {
  constructor(consumerTokens) {
    this.consumerTokens = consumerTokens;
  }

  randomRange(start, length) {
    return Math.floor((Math.random() * length) + start);
  }

  createOAuthNonce() {
    var nonce = "";
    var possible = [
      ["A".charCodeAt(0), 26],
      ["a".charCodeAt(0), 26],
      ["0".charCodeAt(0), 10]
    ];
    for (var i = 0; i < 32; i++) {
      var idx = this.randomRange(0, possible.length);
      var tuple = possible[idx];
      var start = tuple[0];
      var length = tuple[1];
      nonce += String.fromCharCode(this.randomRange(start, length));
    }
    return nonce;
  }

  createOAuthSignature(method, url, params) {
    var paramString = [];
    each(params, (value, key) => {
      paramString.push(
        encodeURIComponent(key) + "=" +
        encodeURIComponent(value)
      );
    });
    paramString = paramString.sort().join("&");

    var baseString = method.toUpperCase() + "&" +
      encodeURIComponent(url) + "&" +
      encodeURIComponent(paramString);

    var signing = this.consumerTokens.consumer_secret + "&";

    return base64.stringify(hmacSHA1(baseString, signing));
  }

  createOAuthParameters(method, url) {
    var params = {
      oauth_consumer_key: this.consumerTokens.consumer_key,
      oauth_token: "",
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.round(new Date().getTime() / 1000),
      oauth_nonce: this.createOAuthNonce(),
      oauth_version: "1.0"
    };
    params.oauth_signature = this.createOAuthSignature(method, url, params);
    return params;
  }

  objectToParams(obj) {
    var params = [];
    each(obj, (value, key) => {
      params.push(key + "=" + encodeURIComponent(value));
    });
    return params.join("&");
  }

  requestToken() {
    var method = "POST";
    var url = "https://api.twitter.com/oauth/request_token";
    var params = this.createOAuthParameters(method, url);
    var auth = [];
    each(params, (value, key) => {
      auth.push(
        encodeURIComponent(key) + "=\"" +
        encodeURIComponent(value) + "\""
      );
    });
    auth = auth.join(", ");

    return new Promise((resolve, reject) => {
      axios({
        method, url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache",
          "Authorization": "OAuth " + auth
        }
      }).then((resp) => {
        var parsed = queryString.parse(resp.data);
        resolve(parsed.oauth_token);
      }, (err) => {
        reject(err);
      });
    });
  }
}