import { UnstakeEvent } from "@tender/shared/src/queries";

export type Lock = UnstakeEvent & {
  open: boolean;
};
