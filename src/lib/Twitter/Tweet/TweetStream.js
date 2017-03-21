import Rx from "rxjs/Rx";
import map from "lodash/map";
import range from "lodash/range";

export default class TweetStream {
  constructor(client) {
    this.client = client; 
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