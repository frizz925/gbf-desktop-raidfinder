import * as React from "react";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import injectTapEventPlugin from "react-tap-event-plugin";
import Rx from "rxjs/Rx";

import App from "~/ui/components/App";
import Auth from "~/ui/components/Auth";
import TweetStream from "~/ui/lib/Twitter/Tweet/TweetStream";

let root = document.getElementById("app");
injectTapEventPlugin();

let storageSet = Rx.Observable.create((observer) => {
  window.ipc.on("storage-set", (evt, key) => {
    observer.next(key);
  });
});
let storageHas = Rx.Observable.create((observer) => {
  window.ipc.on("storage-has", (evt, key, hasKey) => {
    observer.next({ key, hasKey });
  });
});
let storageGet = Rx.Observable.create((observer) => {
  window.ipc.on("storage-get", (evt, key, value) => {
    observer.next({ key, value });
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

let keyFilter = (observable) => 
  (key) => 
    observable.filter((payload) => payload.key === key);
let storage = {
  observables: {
    get: keyFilter(storageGet),
    has: keyFilter(storageHas),
    set: keyFilter(storageSet)
  },
  get: (key) => window.ipc.send("storage-get", key),
  has: (key) => window.ipc.send("storage-has", key),
  set: (key, value) => window.ipc.send("storage-set", key, value)
};

storageHas
  .filter(({ key }) => key === "access_tokens")
  .subscribe(({ hasKey }) => {
    let app;
    if (hasKey) {
      app = <App stream={stream} storage={storage} />;
      window.ipc.send("init");
    } else {
      app = <Auth token={token} onSubmit={onAuthSubmit} />;
      window.ipc.send("request-token-get");
    }

    ReactDOM.render((
      <MuiThemeProvider>
        {app}
      </MuiThemeProvider>
    ), root);
  });

window.ipc.send("storage-has", "access_tokens");

