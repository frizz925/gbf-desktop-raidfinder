import React from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";

export default function() {
  return (
    <div>
      <h3 className="ms-fontSize-xl">GBF Desktop Raidfinder v1.0</h3>
      <p className="ms-fontSize-m">
        <a href="#" className="ms-fontColor-themePrimary" onClick={::this.openTwitter}>Login to Twitter</a>
        <span> and enter the PIN here</span>
      </p>
      <TextField label="Authorization PIN" onChanged={::this.changePIN} />
      <PrimaryButton onClick={::this.submitPIN}>Submit</PrimaryButton>
    </div>
  );
}