import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type CdpClientWrapperProps = {
    writeKey: string;
    children: React.ReactNode;
};
declare const CdpClientWrapper: ({ writeKey, children }: CdpClientWrapperProps) => react_jsx_runtime.JSX.Element;

type CdpContextType = {
    isReady: boolean;
    track: (event: EventObject) => void;
    page: (event: EventObject) => void;
    identify: (event: EventObject) => void;
    setEventIdentifier: React.Dispatch<React.SetStateAction<string>>;
    setPageProperties: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
};
type CdpProviderProps = {
    writeKey: string;
    children: ReactNode;
};
type EventObject = {
    identifier: string;
    properties?: Record<string, unknown>;
    otherIds?: Record<string, unknown>;
};
declare const CdpProvider: ({ writeKey, children }: CdpProviderProps) => react_jsx_runtime.JSX.Element;
declare const useCdp: () => CdpContextType;

type CdpContextValue = {
    eventIdentifier: string;
    setEventIdentifier: (identifier: string) => void;
    pageProperties: Record<string, unknown>;
    setPageProperties: (properties: Record<string, unknown>) => void;
};
type CdpContextProviderProps = {
    children: ReactNode;
};
declare const CdpContextProvider: ({ children }: CdpContextProviderProps) => react_jsx_runtime.JSX.Element;
declare const useCdpContext: () => CdpContextValue;

export { CdpClientWrapper, CdpContextProvider, CdpProvider, type EventObject, useCdp, useCdpContext };
