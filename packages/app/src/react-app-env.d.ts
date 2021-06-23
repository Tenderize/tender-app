/// <reference types="react-scripts" />
declare module "rimble-ui";
declare module "styled-components";
declare module "react-router-dom";
declare module "@rimble/icons"
declare module "@tender/contracts"

declare type TransactionSummary = {
    modal: boolean,
    status: string,
    title: string,
    description: string
}