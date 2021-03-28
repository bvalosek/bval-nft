import React, { FunctionComponent } from 'react';

interface Props {
  url: string;
}

/** target blancc */
export const ExternalLink: FunctionComponent<Props> = (props) => {
  return (
    <a href={props.url} target="_blank" rel="noopener">
      {props.children}
    </a>
  );
};
