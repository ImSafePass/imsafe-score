import React, { ReactChildren, ReactChild } from "react";
import Markdown from "react-markdown";

interface Props {
  open: boolean;
  question: string;
  answer: string;
  onAnswerClick: () => void;
  children: ReactChildren | ReactChild;
  visible: any;
}

const Question = ({
  open,
  question,
  answer,
  onAnswerClick,
  children,
  visible,
}: Props) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="question">
      {open ? (
        <>
          <h3>{question}</h3>
          {children}
        </>
      ) : (
        <h3 className="underline cursor-pointer" onClick={onAnswerClick}>
          <Markdown
            source={answer}
            renderers={{ paragraph: (props) => <>{props.children}</> }}
          />
        </h3>
      )}
    </div>
  );
};

export default Question;
