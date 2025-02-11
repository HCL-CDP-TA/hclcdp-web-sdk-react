// src/components/CdpClientWrapper.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";

// src/components/CdpProvider.tsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { HclCdp } from "hclcdp-web-sdk";
import { jsx } from "react/jsx-runtime";
var CdpContext = createContext({
  isReady: false,
  page: () => {
  },
  track: () => {
  },
  identify: () => {
  },
  setEventIdentifier: () => {
  },
  setPageProperties: () => {
  }
});
var CdpProvider = ({ writeKey, children }) => {
  const [isReady, setIsReady] = useState(false);
  const [eventIdentifier, setEventIdentifier] = useState("page");
  const [pageProperties, setPageProperties] = useState({});
  const initialised = useRef(false);
  const pageEventQueue = useRef([]);
  const trackEventQueue = useRef([]);
  const identifyEventQueue = useRef([]);
  useEffect(() => {
    if (!initialised.current) {
      if (!writeKey) {
        console.error("CDPProvider: Missing writeKey");
        return;
      }
      console.log("calling init from provider useEffect");
      HclCdp.init(writeKey, {}, (error, sessionData) => {
        if (!error) {
          initialised.current = true;
          console.log(sessionData);
          setIsReady(true);
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing page queue");
            HclCdp.page(identifier, properties, otherIds);
          });
          pageEventQueue.current = [];
          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing track queue");
            HclCdp.track(identifier, properties, otherIds);
          });
          trackEventQueue.current = [];
          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing identify queue");
            HclCdp.identify(identifier, properties, otherIds);
          });
          identifyEventQueue.current = [];
        }
      });
    }
  }, [writeKey]);
  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }) => {
    console.log("page event", identifier, properties);
    HclCdp.page(identifier, properties, otherIds);
  };
  const track = ({ identifier, properties = {}, otherIds = {} }) => {
    const event = { identifier, properties, otherIds };
    if (isReady) {
      HclCdp.track(identifier, properties, otherIds);
    } else {
      trackEventQueue.current.push(event);
    }
  };
  const identify = ({ identifier, properties = {}, otherIds = {} }) => {
    const event = { identifier, properties, otherIds };
    if (isReady) {
      HclCdp.identify(identifier, properties, otherIds);
    } else {
      identifyEventQueue.current.push(event);
    }
  };
  return /* @__PURE__ */ jsx(CdpContext.Provider, { value: { isReady, page, track, identify, setEventIdentifier, setPageProperties }, children });
};
var useCdp = () => useContext(CdpContext);

// src/components/CdpContext.tsx
import { createContext as createContext2, useContext as useContext2, useState as useState2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var CdpContext2 = createContext2(null);
var CdpContextProvider = ({ children }) => {
  const [eventIdentifier, setEventIdentifier] = useState2("page");
  const [pageProperties, setPageProperties] = useState2({});
  console.log("Cdp Provider", eventIdentifier, pageProperties);
  return /* @__PURE__ */ jsx2(CdpContext2.Provider, { value: { eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }, children });
};
var useCdpContext = () => {
  const context = useContext2(CdpContext2);
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider");
  }
  return context;
};

// src/components/CdpClientWrapper.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var CdpInitializer = () => {
  const { page } = useCdp();
  const { eventIdentifier, pageProperties } = useCdpContext();
  const isInitialized = useRef2(false);
  useEffect2(() => {
    if (!isInitialized.current && eventIdentifier !== "page") {
      console.log("Calling page with identifier:", eventIdentifier);
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} });
      isInitialized.current = true;
    }
  }, [page, eventIdentifier, pageProperties]);
  return null;
};
var CdpClientWrapper = ({ writeKey, children }) => {
  return /* @__PURE__ */ jsxs(CdpProvider, { writeKey, children: [
    /* @__PURE__ */ jsx3(CdpInitializer, {}),
    children
  ] });
};

// src/components/CdpPageEvent.tsx
import { useEffect as useEffect3 } from "react";
export {
  CdpClientWrapper,
  CdpContextProvider,
  CdpProvider,
  useCdp,
  useCdpContext
};
