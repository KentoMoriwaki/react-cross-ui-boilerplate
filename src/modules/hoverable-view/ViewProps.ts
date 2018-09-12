import { View } from "react-primitives";

export type ViewProps = GetComponentProps<View> & {
  onMouseEnter?(): void;
  onMouseLeave?(): void;
};
