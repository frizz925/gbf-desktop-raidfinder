import { Component } from "react";
import template from "./template";
import TweetParser from "~/lib/TweetParser";

export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tweets: []
      };
      this.parser = new TweetParser();
      this.subscribeToTweets();
    }

    subscribeToTweets() {
      this.props.stream.getTweets()
        .filter(tweet => tweet.text.match(/(Lv50 ティアマト・マグナ|Lvl 50 Tiamat Omega)/))
        .map(tweet => this.parser.parse(tweet))
        .subscribe(this.onData.bind(this));
    }

    onData(data) {
      var tweets = this.state.tweets;
      this.setState({
        tweets: [data].concat(tweets)
      });
    }

    render() {
        return template(this.state.tweets);
    }
}