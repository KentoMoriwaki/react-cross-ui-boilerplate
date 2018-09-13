import * as React from "react";
import { View, Animated } from "react-native";

type OrigViewProps = GetComponentProps<View>;

type AnimatedViewProps = Omit<OrigViewProps, "style"> & {
  children: React.ReactElement<any>;
  style: Array<OrigViewProps["style"] | any> | any;
};

export function createAnimatedStyle(styles: {
  opacity: {
    value: Animated.Value;
  };
}) {
  return {
    opacity: styles.opacity.value
  };
}

export function timing(
  value: any,
  options: { toValue: number; duration: number }
) {
  return {
    start() {
      Animated.timing(value, options).start();
    },
    stop() {
      Animated.timing(value, options).stop();
    }
  };
}

export class AnimatedView extends React.Component<
  AnimatedViewProps,
  {
    styles: any;
  }
> {
  animValue: any;

  render() {
    return <Animated.View {...this.props} />;
  }
}
