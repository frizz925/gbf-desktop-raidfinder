import queryString from "query-string";
import { OAuth } from "oauth";

export default class RequestTokenFactory {
  constructor(consumerTokens) {
    this.consumerTokens = consumerTokens;
    this.version = "1.0";
    this.oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      this.consumerTokens.consumer_key,
      this.consumerTokens.consumer_secret,
      this.version,
      null,
      "HMAC-SHA1",
      32
    );
  }

  requestToken() {
    return new Promise((resolve, reject) => {
      var callback = (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        var parsed = queryString.parse(data);
        resolve(parsed.oauth_token);
      };

      this.oauth.get(
        "https://api.twitter.com/oauth/request_token",
        null, null, callback
      );
    });
  }

  accessTokenFromPIN(requestToken, pin) {
    return new Promise((resolve, reject) => {
      var callback = (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(queryString.parse(data));
      };

      this.oauth.post(
        "https://api.twitter.com/oauth/access_token",
        requestToken, null,
        { oauth_verifier: pin },
        callback
      );
    });
  }
}