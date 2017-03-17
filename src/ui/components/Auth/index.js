import { Component } from "react";
import template from "./template";
import merge from "lodash/merge";

export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oauth_token: null,
      pin: null
    };
    props.token.subscribe(this.onTokenFetch.bind(this));
  }

  onTokenFetch(oauth_token) {
    this.setState({
      oauth_token
    });
  }

  openTwitter() {
    var url = "https://api.twitter.com/oauth/authorize?oauth_token=";
    url += encodeURIComponent(this.state.oauth_token);
    window.shell.openExternal(url);
  }

  changePIN(pin) {
    this.setState({
      oauth_token: this.state.oauth_token,
      pin
    });
  }

  submitPIN() {

  }

  render() {
    if (this.state.oauth_token) {
      return template.apply(this);
    } else {
      return null;
    }
  }
}