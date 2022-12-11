import { ErrorFormatType } from "@realmtickets/common";

export interface ErrorClassInterface {
  statusCode: number;
  serializeErrors(): ErrorFormatType;
}
