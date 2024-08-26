import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";

import { App } from "./App";

import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const client = new Ably.Realtime({
  key: process.env.REACT_APP_ABLY_API_KEY,
  clientId: "<client-ID>",
});

root.render(
  <StrictMode>
    <AblyProvider client={client}>
      <App />
    </AblyProvider>
  </StrictMode>
);
