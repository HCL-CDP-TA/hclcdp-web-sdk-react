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
  logout: () => {
  },
  setEventIdentifier: () => {
  },
  setPageProperties: () => {
  }
});
var CdpProvider = ({ config, children }) => {
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
      if (!config.writeKey) {
        console.error("CdpProvider: Missing writeKey");
        return;
      }
      HclCdp.init(config, (error, sessionData) => {
        if (!error) {
          initialized.current = true;
          setIsReady(true);
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.page(identifier, properties, otherIds);
          });
          pageEventQueue.current = [];
          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.track(identifier, properties, otherIds);
          });
          trackEventQueue.current = [];
          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            HclCdp.identify(identifier, properties, otherIds);
          });
          identifyEventQueue.current = [];
        } else {
          console.error("CDPProvider initialization failed:", error);
        }
      });
    }
  }, [config.writeKey]);
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
  const logout = () => {
    if (isReady) {
      HclCdp.logout();
    }
  };
  return /* @__PURE__ */ jsx2(CdpContextProvider, { children: /* @__PURE__ */ jsx2(CdpContext2.Provider, { value: { isReady, page, track, identify, logout, setEventIdentifier, setPageProperties }, children }) });
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
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} });
      isInitialized.current = true;
    }
  }, [page, eventIdentifier, pageProperties]);
  return null;
};
var CdpClientWrapper = ({ config, children }) => {
  return /* @__PURE__ */ jsx3(CdpProvider, { config, children: /* @__PURE__ */ jsxs(CdpContextProvider, { children: [
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
