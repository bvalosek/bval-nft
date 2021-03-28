import React, { FunctionComponent } from 'react';

interface Props {
  title: React.ReactNode;
  content: React.ReactNode;
}

/** basic dd / dt tags */
export const Description: FunctionComponent<Props> = (props) => {
  return (
    <dl>
      <dd>{props.content}</dd>
      <dt>{props.title}</dt>
    </dl>
  );
};
