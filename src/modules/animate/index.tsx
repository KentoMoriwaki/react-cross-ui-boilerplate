import * as React from "react";
import { View, Text, StyleSheet, Animated } from "react-primitives";

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
  const value: any = styles.opacity.value;
  value._cssListener = () => {};
  value._cssStart = options => {
    value._cssListener("start", options);
  };
  value._cssStop = options => {
    value._cssListener("stop", options);
  };
  return {
    value,
    styles: {
      transitionProperty: "opacity",
      transitionTimingFunction: "linear",
      opacity: 1
    }
  };
}

export function timing(
  value: any,
  options: { toValue: number; duration: number }
) {
  return {
    start() {
      value._cssStart(options);
    },
    stop() {
      value._cssStop(options);
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

  constructor(props) {
    super(props);

    // console.log(props.style);
    this.animValue = props.style.value;
    this.state = {
      styles: props.style.styles
    };
  }

  componentDidMount() {
    this.animValue._cssListener = (event, options) => {
      if (event === "start") {
        this.setState({
          styles: {
            ...this.state.styles,
            transitionDuration: `${options.duration}ms`,
            opacity: options.toValue
          }
        });
      } else if (event === "stop") {
      }
    };
  }

  render() {
    return <View style={this.state.styles}>{this.props.children}</View>;
  }
}
