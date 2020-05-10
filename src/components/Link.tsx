import React from "react";

interface Props {
  href: string;
  children: string;
}

export default ({ href, children }: Props) => (
  <a
    className="text-blue-500 hover:text-blue-700"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);
