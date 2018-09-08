import * as React from "react";
import { Button } from "react-primitives";
import { LinearGradient } from "modules/linearGradient";

const MyButton = () => {
  return (
    <Button>
      <LinearGradient>Hello, World!</LinearGradient>
    </Button>
  );
};

export default MyButton;
