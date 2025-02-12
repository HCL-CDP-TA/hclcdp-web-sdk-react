"use client";

// src/components/CdpClientWrapper.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";

// src/components/CdpProvider.tsx
import { createContext as createContext2, useContext as useContext2, useEffect, useState as useState2, useRef } from "react";
import { HclCdp } from "hclcdp-web-sdk";

// src/components/CdpContext.tsx
import { createContext, useContext, useState } from "react";
import { jsx } from "react/jsx-runtime";
var CdpContext = createContext(null);
var CdpContextProvider = ({ children }) => {
  const [eventIdentifier, setEventIdentifier] = useState("page");
  const [pageProperties, setPageProperties] = useState({});
  return /* @__PURE__ */ jsx(CdpContext.Provider, { value: { eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }, children });
};
var useCdpContext = () => {
  const context = useContext(CdpContext);
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider");
  }
  return context;
};

// src/components/CdpProvider.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var CdpContext2 = createContext2({
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
  const [isReady, setIsReady] = useState2(false);
  const [eventIdentifier, setEventIdentifier] = useState2("page");
  const [pageProperties, setPageProperties] = useState2({});
  const initialized = useRef(false);
  const pageEventQueue = useRef([]);
  const trackEventQueue = useRef([]);
  const identifyEventQueue = useRef([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!initialized.current) {
      if (!writeKey) {
        console.error("CDPProvider: Missing writeKey");
        return;
      }
      console.log("Initializing CDPProvider with writeKey:", writeKey);
      HclCdp.init(writeKey, {}, (error, sessionData) => {
        if (!error) {
          initialized.current = true;
          console.log("CDPProvider initialized successfully:", sessionData);
          setIsReady(true);
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued page event:", identifier);
            HclCdp.page(identifier, properties, otherIds);
          });
          pageEventQueue.current = [];
          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued track event:", identifier);
            HclCdp.track(identifier, properties, otherIds);
          });
          trackEventQueue.current = [];
          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("Processing queued identify event:", identifier);
            HclCdp.identify(identifier, properties, otherIds);
          });
          identifyEventQueue.current = [];
        } else {
          console.error("CDPProvider initialization failed:", error);
        }
      });
    }
  }, [writeKey]);
  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }) => {
    if (isReady) {
      HclCdp.page(identifier, properties, otherIds);
    } else {
      pageEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  const track = ({ identifier, properties = {}, otherIds = {} }) => {
    if (isReady) {
      HclCdp.track(identifier, properties, otherIds);
    } else {
      trackEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  const identify = ({ identifier, properties = {}, otherIds = {} }) => {
    if (isReady) {
      HclCdp.identify(identifier, properties, otherIds);
    } else {
      identifyEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  return /* @__PURE__ */ jsx2(CdpContextProvider, { children: /* @__PURE__ */ jsx2(CdpContext2.Provider, { value: { isReady, page, track, identify, setEventIdentifier, setPageProperties }, children }) });
};
var useCdp = () => useContext2(CdpContext2);

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
  return /* @__PURE__ */ jsx3(CdpProvider, { writeKey, children: /* @__PURE__ */ jsxs(CdpContextProvider, { children: [
    /* @__PURE__ */ jsx3(CdpInitializer, {}),
    children
  ] }) });
};

// src/components/CdpPageEvent.tsx
import { useEffect as useEffect3 } from "react";
var CdpPageEvent = ({ pageName = "page", pageProperties = {} }) => {
  const { setEventIdentifier, setPageProperties } = useCdpContext();
  useEffect3(() => {
    setEventIdentifier(pageName);
    setPageProperties(pageProperties);
    console.log("CdpPage:", pageName, pageProperties);
  }, [setEventIdentifier, pageName, setPageProperties]);
  return null;
};
export {
  CdpClientWrapper,
  CdpContextProvider,
  CdpPageEvent,
  CdpProvider,
  useCdp,
  useCdpContext
};
