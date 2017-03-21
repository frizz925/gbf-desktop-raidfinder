import React from "react";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import Subheader from "material-ui/Subheader";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import { List, ListItem } from "material-ui/List";
import Snackbar from "material-ui/Snackbar";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import Tweet from "~/ui/components/Tweet";
import map from "lodash/map";
import filter from "lodash/filter";

export default function (items) {
  const dialogActions = [
    <FlatButton
      label="Close"
      onTouchTap={this.changeDialogState(false)} />
  ];

  const search = this.state.dialog.search;
  const searchRegexp = new RegExp(search, "i");
  const $filter = this.state.filter || {};
  const title = (
    <div style={{lineHeight: "24px", marginTop: "8px"}}>
      <div className="text-size-sm">{$filter.jp}</div>
      <div className="text-size-xs">{$filter.en}</div>
    </div>
  );

  const filteredDictionary = filter(this.dictionary, (item) => {
    if (!search) return true;
    return item.jp.match(searchRegexp) || item.en.match(searchRegexp);
  });

  const fullWidthStyle = { width: "100%" };

  return (
    <div className="full-height">
      <AppBar
        title={title}
        showMenuIconButton={false}
        iconElementRight={<i className="material-icons app-bar-icon">search</i>}
        onRightIconButtonTouchTap={::this.changeDialogState(true)}
        style={{position: "fixed", left: 0, top: 0}} />
      <Dialog
        title="Select Filter"
        actions={dialogActions}
        open={this.state.dialog.open}
        onRequestClose={this.changeDialogState(false)}
        autoScrollBodyContent={true}
        contentStyle={{width: "100%", marginTop: "-16px"}}
        bodyStyle={{padding: 0}}
        repositionOnUpdate={false}>
        <div style={{padding: "0 10px"}}>
          <TextField
           name="filter"
           inputStyle={fullWidthStyle}
           style={fullWidthStyle}
           onChange={::this.changeDialogSearch}
           value={search} />
        </div>
        <List style={{padding: 0}}>
          {map(filteredDictionary, (item, idx) => (
            <ListItem key={idx} onClick={::this.changeFilter(item)}>
              <div>{item.jp}</div>
              <div className="text-color-dark50 text-size-sm">{item.en}</div>
            </ListItem>
          ))}
        </List>
      </Dialog>
      <List className="list-scrollable" style={{paddingTop: "64px", paddingBottom: 0}}>
        {map(this.state.tweets, (item, idx) => (
          <Tweet key={idx} item={item} snackbarMessage={::this.snackbarMessage} />
        ))}
      </List>
      <Snackbar
        open={this.state.snackbar.open}
        message={this.state.snackbar.message}
        autoHideDuration={4000}
        onRequestClose={::this.changeSnackbarState(false)} />
    </div>
  );
}