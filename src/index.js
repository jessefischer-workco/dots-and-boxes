import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { v4 as uuidv4 } from "uuid";

import { App } from "./App";

import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const client = new Ably.Realtime({
  key: process.env.REACT_APP_ABLY_API_KEY,
  clientId: uuidv4(),
});

root.render(
  <StrictMode>
    <AblyProvider client={client}>
      <ChannelProvider channelName="players">
        <ChannelProvider channelName="games">
          <App />
        </ChannelProvider>
      </ChannelProvider>
    </AblyProvider>
  </StrictMode>
);
