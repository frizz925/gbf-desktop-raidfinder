import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "~/ui/components/App";
import Auth from "~/ui/components/Auth";
import TweetStream from "~/ui/lib/Twitter/TweetStream";
import Rx from "rxjs/Rx";

let root = document.getElementById("app");

let storageHas = Rx.Observable.create((observer) => {
  window.ipc.on("storage-has", (evt, key, hasKey) => {
    observer.next({ key, hasKey });
  });
});
let storageSet = Rx.Observable.create((observer) => {
  window.ipc.on("storage-set", (evt, key) => {
    observer.next(key);
  });
});
let token = Rx.Observable.create((observer) => {
  window.ipc.on("request-token-get", (evt, oauthToken) => {
    observer.next(oauthToken);
  });
});

window.ipc.on("access-token-set-pin", (evt, accessTokens) => {
  console.log("GUI process", "access-token-set-pin", accessTokens);
  window.ipc.send("storage-set", "access_tokens", accessTokens);
});

let onAuthSubmit = (requestToken, pin) => {
  console.log("GUI process", requestToken, pin);
  window.ipc.send("access-token-set-pin", requestToken, pin);
};

let stream = new TweetStream();

storageSet
  .filter((key) => key === "access_tokens")
  .subscribe(() => {
    console.log("GUI process", "storage-set", "access_tokens");
    window.location.reload();
  });

storageHas
  .filter(({ key }) => key === "access_tokens")
  .subscribe(({ hasKey }) => {
    if (hasKey) {
      ReactDOM.render(<App stream={stream} />, root);
      window.ipc.send("init");
    } else {
      ReactDOM.render(<Auth token={token} onSubmit={onAuthSubmit} />, root);
      window.ipc.send("request-token-get");
    }
  });

window.ipc.send("storage-has", "access_tokens");

