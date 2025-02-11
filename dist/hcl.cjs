"use strict";
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

// src/hcl.ts
var hcl_exports = {};
__export(hcl_exports, {
  CdpClientWrapper: () => CdpClientWrapper,
  CdpContextProvider: () => CdpContextProvider,
  CdpProvider: () => CdpProvider,
  useCdp: () => useCdp,
  useCdpContext: () => useCdpContext
});
module.exports = __toCommonJS(hcl_exports);

// src/components/CdpClientWrapper.tsx
var import_react3 = require("react");

// src/components/CdpProvider.tsx
var import_react = require("react");
var import_hclcdp_web_sdk = require("hclcdp-web-sdk");
var import_jsx_runtime = require("react/jsx-runtime");
var CdpContext = (0, import_react.createContext)({
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
  const [isReady, setIsReady] = (0, import_react.useState)(false);
  const [eventIdentifier, setEventIdentifier] = (0, import_react.useState)("page");
  const [pageProperties, setPageProperties] = (0, import_react.useState)({});
  const initialised = (0, import_react.useRef)(false);
  const pageEventQueue = (0, import_react.useRef)([]);
  const trackEventQueue = (0, import_react.useRef)([]);
  const identifyEventQueue = (0, import_react.useRef)([]);
  (0, import_react.useEffect)(() => {
    if (!initialised.current) {
      if (!writeKey) {
        console.error("CDPProvider: Missing writeKey");
        return;
      }
      console.log("calling init from provider useEffect");
      import_hclcdp_web_sdk.HclCdp.init(writeKey, {}, (error, sessionData) => {
        if (!error) {
          initialised.current = true;
          console.log(sessionData);
          setIsReady(true);
          pageEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing page queue");
            import_hclcdp_web_sdk.HclCdp.page(identifier, properties, otherIds);
          });
          pageEventQueue.current = [];
          trackEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing track queue");
            import_hclcdp_web_sdk.HclCdp.track(identifier, properties, otherIds);
          });
          trackEventQueue.current = [];
          identifyEventQueue.current.forEach(({ identifier, properties, otherIds }) => {
            console.log("clearing identify queue");
            import_hclcdp_web_sdk.HclCdp.identify(identifier, properties, otherIds);
          });
          identifyEventQueue.current = [];
        }
      });
    }
  }, [writeKey]);
  const page = ({ identifier = eventIdentifier, properties = pageProperties, otherIds = {} }) => {
    console.log("page event", identifier, properties);
    import_hclcdp_web_sdk.HclCdp.page(identifier, properties, otherIds);
  };
  const track = ({ identifier, properties = {}, otherIds = {} }) => {
    const event = { identifier, properties, otherIds };
    if (isReady) {
      import_hclcdp_web_sdk.HclCdp.track(identifier, properties, otherIds);
    } else {
      trackEventQueue.current.push(event);
    }
  };
  const identify = ({ identifier, properties = {}, otherIds = {} }) => {
    const event = { identifier, properties, otherIds };
    if (isReady) {
      import_hclcdp_web_sdk.HclCdp.identify(identifier, properties, otherIds);
    } else {
      identifyEventQueue.current.push(event);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CdpContext.Provider, { value: { isReady, page, track, identify, setEventIdentifier, setPageProperties }, children });
};
var useCdp = () => (0, import_react.useContext)(CdpContext);

// src/components/CdpContext.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var CdpContext2 = (0, import_react2.createContext)(null);
var CdpContextProvider = ({ children }) => {
  const [eventIdentifier, setEventIdentifier] = (0, import_react2.useState)("page");
  const [pageProperties, setPageProperties] = (0, import_react2.useState)({});
  console.log("Cdp Provider", eventIdentifier, pageProperties);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CdpContext2.Provider, { value: { eventIdentifier, setEventIdentifier, pageProperties, setPageProperties }, children });
};
var useCdpContext = () => {
  const context = (0, import_react2.useContext)(CdpContext2);
  if (!context) {
    throw new Error("useCdpContext must be used within a CdpProvider");
  }
  return context;
};

// src/components/CdpClientWrapper.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var CdpInitializer = () => {
  const { page } = useCdp();
  const { eventIdentifier, pageProperties } = useCdpContext();
  const isInitialized = (0, import_react3.useRef)(false);
  (0, import_react3.useEffect)(() => {
    if (!isInitialized.current && eventIdentifier !== "page") {
      console.log("Calling page with identifier:", eventIdentifier);
      page({ identifier: eventIdentifier, properties: pageProperties, otherIds: {} });
      isInitialized.current = true;
    }
  }, [page, eventIdentifier, pageProperties]);
  return null;
};
var CdpClientWrapper = ({ writeKey, children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(CdpProvider, { writeKey, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CdpInitializer, {}),
    children
  ] });
};

// src/components/CdpPageEvent.tsx
var import_react4 = require("react");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CdpClientWrapper,
  CdpContextProvider,
  CdpProvider,
  useCdp,
  useCdpContext
});
