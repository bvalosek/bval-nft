import React, { FunctionComponent } from 'react';

interface Props {
  tokenId: string;
}

export const ObjectLink: FunctionComponent<Props> = ({ tokenId }) => {
  return (
    <>
      [
      <a href={`https://www.screensaver.world/object/${tokenId}`} target="_blank" rel="noopener">
        obj#{tokenId}
      </a>
      ]
    </>
  );
};
