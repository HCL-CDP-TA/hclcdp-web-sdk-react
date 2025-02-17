"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/hclcdp-react.ts
var hclcdp_react_exports = {};
__export(hclcdp_react_exports, {
  CdpClientWrapper: () => CdpClientWrapper,
  CdpContextProvider: () => CdpContextProvider,
  CdpPageEvent: () => CdpPageEvent,
  CdpProvider: () => CdpProvider,
  useCdp: () => useCdp,
  useCdpContext: () => useCdpContext
});
module.exports = __toCommonJS(hclcdp_react_exports);

// src/components/CdpClientWrapper.tsx
var import_react3 = require("react");

// src/components/CdpProvider.tsx
var import_react2 = require("react");
var import_hclcdp_web_sdk = require("hclcdp-web-sdk");

// src/components/CdpContext.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var CdpContext = (0, import_react.createContext)(null);
var CdpContextProvider = ({ children }) => {
  const [eventIdentifier, setEventIdentifier] = (0, import_react.useState)("page");
  const [pageProperties, setPageProperties] = (0, import_react.useState)({});
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CdpContext.Provider, { value: { eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }, children });
};
var useCdpContext = () => {
  const context = (0, import_react.useContext)(CdpContext);
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider");
  }
  return context;
};

// src/components/CdpProvider.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var CdpContext2 = (0, import_react2.createContext)({
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
  const [isReady, setIsReady] = (0, import_react2.useState)(false);
  const [eventIdentifier, setEventIdentifier] = (0, import_react2.useState)("page");
  const [pageProperties, setPageProperties] = (0, import_react2.useState)({});
  const initialized = (0, import_react2.useRef)(false);
  const pageEventQueue = (0, import_react2.useRef)([]);
  const trackEventQueue = (0, import_react2.useRef)([]);
  const identifyEventQueue = (0, import_react2.useRef)([]);
  (0, import_react2.useEffect)(() => {
    if (typeof window === "undefined") return;
    if (!initialized.current) {
      if (!config.writeKey) {
        console.error("CdpProvider: Missing writeKey");
        return;
      }
      import_hclcdp_web_sdk.HclCdp.init(config, (error, sessionData) => {
        if (!error) {
          initialized.current = true;
          setIsReady(true);
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            import_hclcdp_web_sdk.HclCdp.page(identifier, properties, otherIds);
          });
          pageEventQueue.current = [];
          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            import_hclcdp_web_sdk.HclCdp.track(identifier, properties, otherIds);
          });
          trackEventQueue.current = [];
          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            import_hclcdp_web_sdk.HclCdp.identify(identifier, properties, otherIds);
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
      import_hclcdp_web_sdk.HclCdp.page(identifier, properties, otherIds);
    } else {
      pageEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  const track = ({ identifier, properties = {}, otherIds = {} }) => {
    if (isReady) {
      import_hclcdp_web_sdk.HclCdp.track(identifier, properties, otherIds);
    } else {
      trackEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  const identify = ({ identifier, properties = {}, otherIds = {} }) => {
    if (isReady) {
      import_hclcdp_web_sdk.HclCdp.identify(identifier, properties, otherIds);
    } else {
      identifyEventQueue.current.push({ identifier, properties, otherIds });
    }
  };
  const logout = () => {
    if (isReady) {
      import_hclcdp_web_sdk.HclCdp.logout();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CdpContextProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CdpContext2.Provider, { value: { isReady, page, track, identify, logout, setEventIdentifier, setPageProperties }, children }) });
};
var useCdp = () => (0, import_react2.useContext)(CdpContext2);

// src/components/CdpClientWrapper.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var CdpInitializer = () => {
  const { page } = useCdp();
  const { eventIdentifier, pageProperties } = useCdpContext();
  const isInitialized = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    if (!isInitialized.current && eventIdentifier !== "page") {
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} });
      isInitialized.current = true;
    }
  }, [page, eventIdentifier, pageProperties]);
  return null;
};
var CdpClientWrapper = ({ config, children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CdpProvider, { config, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(CdpContextProvider, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CdpInitializer, {}),
    children
  ] }) });
};

// src/components/CdpPageEvent.tsx
var import_react4 = require("react");
var CdpPageEvent = ({ pageName = "page", pageProperties = {} }) => {
  const { setEventIdentifier, setPageProperties } = useCdpContext();
  (0, import_react4.useEffect)(() => {
    setEventIdentifier(pageName);
    setPageProperties(pageProperties);
  }, [setEventIdentifier, pageName, setPageProperties]);
  return null;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CdpClientWrapper,
  CdpContextProvider,
  CdpPageEvent,
  CdpProvider,
  useCdp,
  useCdpContext
});
