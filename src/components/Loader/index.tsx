import React from "react";

import "./Loader.css";

interface Props {
  className?: string;
  style?: object;
  el?: string;
}

const Loader = ({ className, style, el = "span" }: Props) =>
  React.createElement(el, {
    className: `loader ${className || ""}`,
    style,
    children: <span className="loader__spinner" />,
  });

export default Loader;
