import React, { ReactChild, ReactChildren } from "react";

export const QuestionText = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}) => <h3 className="text-xl text-blue-700">{children}</h3>;

export const Unimportant = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}) => <span className="question__unimportant">{children}</span>;

export const makeOpener = (open: (qn: string) => void) => ({
  children,
  name,
}: {
  children: ReactChild;
  name: string;
}) => (
  <span className="question__opener" onClick={() => open(name)}>
    {children}
  </span>
);
