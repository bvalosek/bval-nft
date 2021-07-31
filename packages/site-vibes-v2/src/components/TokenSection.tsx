import React, { FunctionComponent } from 'react';

interface Props {
  limit?: number;
  offset?: number;
  owner?: string;
  creator?: string;
  seeder?: string;
}

export const TokenSection: FunctionComponent<Props> = () => {
  const [tokens, setTokens] = useState<NFTView[]>(undefined);
  const fetchTokens = async () => {
    const tokens = await getRecentTokens({ limit: 7 });
    setTokens(tokens);
  };
  return <></>;
};
