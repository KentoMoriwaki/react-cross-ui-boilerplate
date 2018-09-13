import * as React from "react";
import { View, Text, StyleSheet, Animated } from "react-primitives";
import { LinearGradient } from "modules/linear-gradient";
import { HoverableView } from "modules/hoverable-view";
import { AnimatedView, createAnimatedStyle, timing } from "modules/animate";

class Button extends React.PureComponent<{}, { isHovered: boolean }> {
  state = {
    isHovered: false
  };

  shadowValue = new Animated.Value(1);
  enterAnim = timing(this.shadowValue, { toValue: 0, duration: 3000 });
  leaveAnim = timing(this.shadowValue, { toValue: 1, duration: 3000 });
  animStyle = createAnimatedStyle({
    opacity: {
      value: this.shadowValue
    }
  });

  render() {
    return (
      <Text>
        <HoverableView
          onMouseEnter={() => {
            this.setState({ isHovered: true });
            this.enterAnim.start();
          }}
          onMouseLeave={() => {
            this.setState({ isHovered: false });
            this.leaveAnim.start();
          }}
          onTouchStart={() => {
            this.setState({ isHovered: true });
            this.enterAnim.start();
          }}
        >
          <AnimatedView style={this.animStyle}>
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
          </AnimatedView>
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
