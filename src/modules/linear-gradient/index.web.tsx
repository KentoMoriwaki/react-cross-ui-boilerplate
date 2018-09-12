import * as React from "react";
import { View } from "react-primitives";

class LinearGradient extends React.PureComponent<{
  start?: {
    x: number;
    y: number;
  };
  end?: {
    x: number;
    y: number;
  };
  locations?: number[];
  colors?: string[];
  style?: any;
}> {
  static defaultProps = {
    start: {
      x: 0.5,
      y: 0
    },
    end: {
      x: 0.5,
      y: 1
    },
    locations: [],
    colors: []
  };

  state = {
    width: 1,
    height: 1
  };

  measure = ({ nativeEvent }) =>
    this.setState({
      width: nativeEvent.layout.width,
      height: nativeEvent.layout.height
    });

  getAngle = () => {
    // Math.atan2 handles Infinity
    const angle =
      Math.atan2(
        this.state.width * (this.props.end.y - this.props.start.y),
        this.state.height * (this.props.end.x - this.props.start.x)
      ) +
      Math.PI / 2;
    return angle + "rad";
  };

  getColors = () =>
    this.props.colors
      .map((color, index) => {
        const location = this.props.locations[index];
        let locationStyle = "";
        if (location) {
          locationStyle = " " + location * 100 + "%";
        }
        return color + locationStyle;
      })
      .join(",");

  render() {
    return (
      <View
        style={[
          this.props.style,
          {
            backgroundImage: `linear-gradient(${this.getAngle()},${this.getColors()})`
          }
        ]}
        onLayout={this.measure}
      >
        {this.props.children}
      </View>
    );
  }
}

export { LinearGradient };
