import * as React from "react";
import { View, Text } from "react-primitives";
import { LinearGradient } from "modules/linear-gradient";

const MyButton = () => {
  return (
    <View>
      <LinearGradient>
        <Text>Hello, World!</Text>
      </LinearGradient>
    </View>
  );
};

export default MyButton;
