import { Component } from "react";
import template from "./template.jsx";
import TweetParser from "~/lib/Twitter/Tweet/TweetParser";
import BossDictionary from "~/lib/Twitter/Tweet/BossDictionary.json";
import each from "lodash/each";
import map from "lodash/map";
import assign from "lodash/assign";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      filter: BossDictionary[0],
      snackbar: {
        message: "",
        open: false
      }
    };
    this.parser = new TweetParser();
    this.dictionary = BossDictionary;
    this.subscribeToTweets();
  }

  getDictionaryList() {
    return map(this.dictionary, (item, idx) => ({
      key: idx,
      text: item.en
    }));
  }

  changeFilter(evt, idx, filter) {
    this.setState({
      tweets: [],
      filter
    });
  }

  subscribeToTweets() {
    this.props.stream.getTweets()
      .filter((tweet) => {
        var filter = this.state.filter;
        if (!filter) return false;
        var regex = new RegExp("(" + filter.jp + "|" + filter.en + ")");
        var match = tweet.text.match(regex);
        if (!match) return false;
        return this.parser.parse(tweet);
      })
      .map((tweet) => this.parser.parse(tweet))
      .subscribe(::this.onTweet);
  }

  onTweet(tweet) {
    this.updateState({
      tweets: [tweet].concat(this.state.tweets).slice(0, 50)
    });
  }

  onSnackbarClose() {
    this.updateState({
      snackbar: assign(this.state.snackbar, {
        open: false
      })
    });
  }

  snackbarMessage(message) {
    this.updateState({
      snackbar: assign(this.state.snackbar, {
        open: true,
        message
      })
    });
  }

  updateState(newState) {
    var state = assign({}, this.state, newState);
    this.setState(state);
  }

  render() {
    return template.call(this);
  }
}