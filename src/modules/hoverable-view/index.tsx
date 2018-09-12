import * as React from "react";
import { View } from "react-primitives";
import { ViewProps } from "./ViewProps";

export class HoverableView extends React.Component<ViewProps> {
  render() {
    return <View {...this.props} />;
  }
}
