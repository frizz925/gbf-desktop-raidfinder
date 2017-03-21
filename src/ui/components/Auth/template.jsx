import React from "react";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

export default function() {
  return (
    <div>
      <AppBar title={window.document.title} showMenuIconButton={false} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <h4 className="text-weight-300">
              <a href="#" onClick={::this.openTwitter}>Login to Twitter</a>
              <span> and enter the PIN here</span>
            </h4>
          </div> {/* .col */}
        </div> {/* .row */}
        <div className="row">
          <div className="col-xs-2">
            <TextField floatingLabelText="Authorization PIN" onChange={::this.changePIN} />
            <RaisedButton label="Submit" primary={true} onTouchTap={::this.submitPIN} />
          </div> {/* .col */}
        </div> {/* .row */}
      </div> {/* .fluid-container */}
    </div>
  );
}