import * as React from "react";
import { Text, StyleSheet, Animated } from "react-primitives";
import { LinearGradient } from "modules/linear-gradient";
import { HoverableView } from "modules/hoverable-view";
import { AnimatedView, createAnimatedStyle, timing } from "modules/animate";
import { ViewStyle, TextStyle } from "react-native";

class Button extends React.PureComponent<{}, { isHovered: boolean }> {
  state = {
    isHovered: false
  };

  shadowValue = new Animated.Value(1);
  enterAnim = timing(this.shadowValue, { toValue: 0.3, duration: 300 });
  leaveAnim = timing(this.shadowValue, { toValue: 1, duration: 300 });
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
            if (this.state.isHovered) {
              this.setState({ isHovered: false });
              this.leaveAnim.start();
            } else {
              this.setState({ isHovered: true });
              this.enterAnim.start();
            }
          }}
        >
          <AnimatedView style={this.animStyle}>
            <LinearGradient
              colors={["rgb(13, 147, 224)", "rgb(0, 196, 196)"]}
              start={{
                x: 0.0,
                y: 0.2
              }}
              end={{
                x: 1.0,
                y: 0.8
              }}
              style={[
                defaultButtonStyle.button,
                this.state.isHovered ? styles.button : {}
              ]}
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
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
});

const styles = StyleSheet.create<{
  button: ViewStyle;
  text: TextStyle;
}>({
  button: {
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4
    }
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 20
  }
});

export default Button;
