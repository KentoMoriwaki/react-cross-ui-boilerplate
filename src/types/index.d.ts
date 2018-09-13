import * as React from "react";

declare global {
  export type GetComponentProps<T> = T extends
    | React.ComponentType<infer P>
    | React.Component<infer P>
    ? P
    : never;

  export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
}
