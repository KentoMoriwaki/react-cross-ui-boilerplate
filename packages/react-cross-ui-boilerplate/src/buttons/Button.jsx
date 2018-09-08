import * as React from "react";
import { View, Text } from "react-primitives";
import { LinearGradient } from "modules/linear-gradient";

const Button = ({ children }) => {
  return (
    <View>
      <LinearGradient>
        <Text>{children}</Text>
      </LinearGradient>
    </View>
  );
};

export default Button;
