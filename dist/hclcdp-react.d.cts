import * as react_jsx_runtime from 'react/jsx-runtime';
import { HclCdpConfig } from 'hclcdp-web-sdk';
export { HclCdpConfig } from 'hclcdp-web-sdk';
import { ReactNode } from 'react';

type CdpClientWrapperProps = {
    config: HclCdpConfig;
    children: React.ReactNode;
};
declare const CdpClientWrapper: ({ config, children }: CdpClientWrapperProps) => react_jsx_runtime.JSX.Element;

type CdpContextType = {
    isReady: boolean;
    track: (event: EventObject) => void;
    page: (event: EventObject) => void;
    identify: (event: EventObject) => void;
    logout: () => void;
    setEventIdentifier: React.Dispatch<React.SetStateAction<string>>;
    setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
};
type CdpProviderProps = {
    config: HclCdpConfig;
    children: ReactNode;
};
type EventObject = {
    identifier: string;
    properties?: Record<string, unknown>;
    otherIds?: Record<string, unknown>;
};
declare const CdpProvider: ({ config, children }: CdpProviderProps) => react_jsx_runtime.JSX.Element;
declare const useCdp: () => CdpContextType;

type CdpPageEventProps = {
    pageName: string | undefined;
    pageProperties?: Record<string, any>;
};
declare const CdpPageEvent: ({ pageName, pageProperties }: CdpPageEventProps) => null;

type CdpContextValue = {
    eventIdentifier: string;
    setEventIdentifier: (identifier: string) => void;
    pageProperties: Record<string, unknown>;
    setPageProperties: (properties: Record<string, unknown>) => void;
};
declare const CdpContextProvider: ({ children }: {
    children: ReactNode;
}) => react_jsx_runtime.JSX.Element;
declare const useCdpContext: () => CdpContextValue;

export { CdpClientWrapper, CdpContextProvider, CdpPageEvent, CdpProvider, type EventObject, useCdp, useCdpContext };
