import React from "react";

interface Props {
  href: string;
  children: string;
}

export default ({ href, children }: Props) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);
