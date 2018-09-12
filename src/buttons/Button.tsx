import * as React from "react";
import { View, Text, StyleSheet } from "react-primitives";
import { LinearGradient } from "modules/linear-gradient";
import { HoverableView } from "modules/hoverable-view";

class Button extends React.PureComponent<{}, { isHovered: boolean }> {
  state = {
    isHovered: false
  };

  render() {
    return (
      <Text>
        <HoverableView
          onMouseEnter={() => {
            this.setState({ isHovered: true });
          }}
          onMouseLeave={() => {
            this.setState({ isHovered: false });
          }}
        >
          <LinearGradient
            colors={
              this.state.isHovered
                ? ["rgb(13, 147, 224)", "rgb(0, 196, 196)"]
                : ["rgb(13, 147, 224)", "rgb(0, 196, 0)"]
            }
            start={{
              x: 0.0,
              y: 0.2
            }}
            end={{
              x: 1.0,
              y: 0.8
            }}
            style={[defaultButtonStyle.button, styles.button]}
          >
            <Text style={[styles.text]}>{this.props.children}</Text>
          </LinearGradient>
        </HoverableView>
      </Text>
    );
  }
}

const defaultButtonStyle = StyleSheet.create({
  button: {
    paddingVertical: 1 * 8,
    paddingHorizontal: 5 * 8,
    borderRadius: 3 * 8
  }
});

const styles = StyleSheet.create({
  button: {
    borderWidth: 0,
    backgroundColor: "white"
  },
  text: {
    color: "white",
    textAlign: "center"
  }
});

export default Button;
