import Twitter from "twitter";
import Rx from "rxjs/Rx";
import map from "lodash/map";
import range from "lodash/range";

export default class TweetStream {
  constructor(consumerKeys, accessTokens) {
    this.client = new Twitter({
      consumer_key: consumerKeys.consumer_key,
      consumer_secret: consumerKeys.consumer_secret,
      access_token_key: accessTokens.oauth_token,
      access_token_secret: accessTokens.oauth_token_secret
    });
    this.keywords = map(range(15, 150, 5), (item) => "Lv" + item);
    this.keywords.push("I need backup!Battle ID: ");
  }

  getTweets() {
    return Rx.Observable.create((observer) => {
      this.client.stream("statuses/filter", { track: this.keywords.join(",") }, (stream) => {

        stream.on("data", (tweet) => {
          observer.next({type: "data", tweet});
        });

        stream.on("error", (error) => {
          observer.next({type: "error", error});
        });

      });
    });
  }
}