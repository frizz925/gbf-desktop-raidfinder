import { Component } from "react";
import template from "./template";
import moment from "moment";

export default class TweetTile extends Component {
  copyCode(item) {
    return () => window.clipboard.writeText(item.raid.code);
  }

  relativeTime(time) {
    var format = "ddd MMM DD HH:mm:ss ZZ YYYY";
    return moment(time, format).fromNow();
  }

  render() {
    return template.call(this, this.props.item);
  }
}