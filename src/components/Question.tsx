import React, { ReactChildren, ReactChild } from "react";
import Markdown from "react-markdown";

interface Props {
  answered: boolean;
  question: string;
  answer: string;
  onAnswerClick: () => void;
  children: ReactChildren | ReactChild;
  visible: any;
}

const Question = ({
  answered,
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
      {answered ? (
        <h3 className="underline cursor-pointer" onClick={onAnswerClick}>
          <Markdown
            source={answer}
            renderers={{ paragraph: (props) => <>{props.children}</> }}
          />
        </h3>
      ) : (
        <>
          <h3>{question}</h3>
          {children}
        </>
      )}
    </div>
  );
};

export default Question;
