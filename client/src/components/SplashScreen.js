import React from "react";
import logo from "../logo.svg";

function splashScreen() {
  const style = {
    border: "0",
    width: "90vw",
    height: "90vh",
    overflow: "hidden"
  };
  return <iframe style={style} src="this.is.a.url" />;
}
export default splashScreen;
