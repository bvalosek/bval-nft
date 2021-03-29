import { Button, Text } from '@geist-ui/react';
import React, { FunctionComponent } from 'react';
import { atomicMint } from '../util/contract';
import { Container } from './Container';
import allTokens from '@bvalosek/token-manifest/data/tokens.json';
import allSequences from '@bvalosek/token-manifest/data/sequences.json';
import { SequenceCreateData, TokenMintData } from '@bvalosek/lib-tokens';
import { useWeb3Strict } from '../util/web3';

export const Tasks: FunctionComponent = () => {
  const { library } = useWeb3Strict();

  const tokens = allTokens.filter((t) => t.source.token.sequenceNumber === 1);
  const sequence = allSequences.find((s) => s.sequenceNumber === 1);

  // TODO: allow storing of contract address in local storage by chainID
  const contractAddress = '0x5511746Bac4303acc61dD7E5d035147fdCB47690';

  const sdata: SequenceCreateData = {
    sequenceNumber: sequence.sequenceNumber,
    name: sequence.source.name,
    description: sequence.source.description,
    image: `ipfs://ipfs/${sequence.imageCID}`,
  };

  const tdata = tokens.map<TokenMintData>((t) => {
    return {
      tokenId: t.tokenId,
      metadataCIDs: t.metadata.map((m) => m.cid),
    };
  });

  return (
    <Container>
      <Text h2>Collection Tasks</Text>
      <div>
        {/* TODO: dynamically determine "tasks" to perform based on on-chain
        contract state and all data files */}
        <Button type="success" onClick={() => atomicMint(contractAddress, sdata, tdata, library.getSigner())}>
          atomic mint ARCH-DESCENT
        </Button>
      </div>
    </Container>
  );
};
