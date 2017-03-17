import { Component } from "react";
import template from "./template";

export default class TweetTile extends Component {
  render() {
    return template(this.props.item);
  }
}