import React from "react";
import AppBar from "material-ui/AppBar";
import Subheader from "material-ui/Subheader";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { List } from "material-ui/List";
import Snackbar from "material-ui/Snackbar";
import Tweet from "~/ui/components/Tweet";
import map from "lodash/map";

export default function (items) {
  return (
    <div>
      <AppBar
        title={this.state.filter.en}
        iconClassNameRight="muidocs-icon-navigation-expand-more" />
      <List>
        {/*
        <Subheader>
          <SelectField
            floatingLabelText="Filter"
            value={this.state.filter}
            onChange={::this.changeFilter}>
            {map(this.dictionary, (item, idx) => (
              <MenuItem key={idx} value={item} primaryText={item.en} />
            ))}
          </SelectField>
        </Subheader>
        */}
        {map(this.state.tweets, (item, idx) => (
          <Tweet key={item.tweet.id} item={item} snackbarMessage={::this.snackbarMessage} />
        ))}
      </List>
      <Snackbar
        open={this.state.snackbar.open}
        message={this.state.snackbar.message}
        autoHideDuration={4000}
        onRequestClose={::this.onSnackbarClose} />
    </div>
  );
}