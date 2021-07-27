import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { Address } from '../../../site-vibes/src/components/Address';
import { useProtocol } from '../hooks/protocol';
import { DecimalNumber } from '../../../site-vibes/src/components/DecimalNumber';
import { Stats } from './Stats';
import { Button } from './Button';
import { MarketPrice } from './MarketPrice';
import { TwoPanel } from './TwoPanel';
import { Divider } from './Divder';
import { ButtonGroup } from './ButtonGroup';

export const Protocol: FunctionComponent = () => {
  const { protocolView, marketView } = useProtocol();

  if (protocolView === null || marketView === null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ Loading</Title>
        </Content>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <Content>
          <div>
            <Title>VIBES Token</Title>
            <TwoPanel>
              <div>
                <Content>
                  <Stats>
                    <strong>address</strong>:{' '}
                    <Button externalNavTo={`https://polygonscan.com/address/${protocolView.vibesToken.address}`}>
                      <Address address={protocolView.vibesToken.address} />
                    </Button>
                    <br />
                    <strong>total supply</strong>:{' '}
                    <DecimalNumber decimals={0} number={protocolView.vibesToken.totalSupply} /> ($
                    <MarketPrice amount={protocolView.vibesToken.totalSupply} price="vibesUsdcPrice" />)
                  </Stats>
                  <ButtonGroup>
                    <Button externalNavTo={`https://polygonscan.com/token/${protocolView.vibesToken.address}`}>
                      🔎 VIEW transfers
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
              <div>
                <Content>
                  <p>
                    <Vibes /> is a standard ERC-20 token with a <code>MINTER</code> role that allows minting of new
                    tokens.
                  </p>
                  <p>Total supply is not yet finalized while the protocol is in early-phase development.</p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Market (QuickSwap)</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button
                    externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${marketView.vibesMaticPool.address}`}
                  >
                    <Address address={marketView.vibesMaticPool.address} />
                  </Button>
                  <br />
                  <strong>VIBES price</strong>: <DecimalNumber number={marketView.vibesUsdcPrice} decimals={5} /> USD
                  <br />
                  <strong>VIBES price</strong>: <DecimalNumber number={marketView.vibesMaticPrice} decimals={5} /> MATIC
                  <br />
                  <strong>MATIC price</strong>: <DecimalNumber number={marketView.maticUsdcPrice} decimals={2} /> USD
                  <br />
                  <strong>total liquidity</strong>:{' '}
                  <DecimalNumber number={marketView.vibesMaticPool.totalSupply} decimals={0} /> LP ($
                  <MarketPrice amount={marketView.vibesMaticPool.vibesReserve.mul(2)} price="vibesUsdcPrice" />)
                  <br />
                  <strong>&nbsp;- VIBES</strong>:{' '}
                  <DecimalNumber number={marketView.vibesMaticPool.vibesReserve} decimals={0} />
                  <br />
                  <strong>&nbsp;- MATIC</strong>:{' '}
                  <DecimalNumber number={marketView.vibesMaticPool.maticReserve} decimals={0} />
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    QuickSwap is a decentralized exchange that has VIBES-MATIC liquidity to support the buying and
                    selling of <Vibes />.
                  </p>
                  <ButtonGroup>
                    <Button
                      externalNavTo={`https://polygonscan.com/address/${marketView.vibesMaticPool.address}#tokentxns`}
                    >
                      🔎 VIEW market trxs
                    </Button>
                    <Button externalNavTo={`https://info.quickswap.exchange/pair/${marketView.vibesMaticPool.address}`}>
                      📊 VIEW market stats
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Wellspring v1</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button externalNavTo={`https://polygonscan.com/address/${protocolView.wellspring.address}`}>
                    <Address address={protocolView.wellspring.address} />
                  </Button>
                  <br />
                  <strong>TVL</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.wellspring.reserveVibesBalance} /> <Vibes /> ($
                  <MarketPrice amount={protocolView.wellspring.reserveVibesBalance} price="vibesUsdcPrice" />)
                  <br />
                  <strong>managed tokens</strong>: {protocolView.wellspring.tokenCount}
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    The <Vibes /> Wellspring is the contract that handles the bookkeeping associated with provenance
                    mining.
                  </p>
                  <p>
                    Locked tokens cannot be removed (outside of provenance mining) unless an injected NFT has been
                    burned.
                  </p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>SQNCR</Title>
            <TwoPanel>
              <div>
                <Content>
                  <p>
                    <strong>address</strong>:{' '}
                    <Button externalNavTo={`https://polygonscan.com/address/${protocolView.sqncr.address}`}>
                      <Address address={protocolView.sqncr.address} />
                    </Button>
                    <br />
                    <strong>mint cost</strong>: <DecimalNumber decimals={0} number={protocolView.sqncr.mintCost} />{' '}
                    <Vibes /> ($
                    <MarketPrice amount={protocolView.sqncr.mintCost} price="vibesUsdcPrice" />)
                    <br />
                    <strong>total minted</strong>: {protocolView.sqncr.totalMinted}
                    <br />
                    <strong>max mints per address</strong>: {protocolView.sqncr.maxMints}
                  </p>
                  <ButtonGroup>
                    <Button
                      externalNavTo={`https://opensea.io/collection/vibes-sqncr?search[sortAscending]=false&search[sortBy]=CREATED_DATE`}
                    >
                      ⛵️ VIEW on OpeanSea
                    </Button>
                  </ButtonGroup>
                </Content>
              </div>
              <div>
                <Content>
                  <p>SQNCR is a standard ERC-721 (NFT) contract. </p>
                  <p>
                    The <code>CONFIG</code> role allows setting the default and token-specific metadata resolvers
                    (shell) and the <code>WITHDRAW</code> role allows removing tokens from the contract that were used
                    to pay for mints.
                  </p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Gnosis Safe</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button
                    externalNavTo={`https://polygon.gnosis-safe.io/app/#/safes/${protocolView.gnosisSafe.address}`}
                  >
                    <Address address={protocolView.gnosisSafe.address} />
                  </Button>
                  <br />
                  <strong>VIBES balance</strong>
                  : <DecimalNumber decimals={0} number={protocolView.gnosisSafe.vibesBalance} /> ($
                  <MarketPrice amount={protocolView.gnosisSafe.vibesBalance} price="vibesUsdcPrice" />)
                  <br />
                  <strong>LP balance</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.gnosisSafe.vibesMaticLpBalance} /> LP ($
                  <MarketPrice amount={protocolView.gnosisSafe.vibesMaticLpBalance} price="vibesMaticLpUsdcPrice" />)
                </Stats>
              </div>
              <div>
                <p>
                  The <Vibes /> multisig uses a Gnosis Safe to store protocol assets and manage protocol parameters. All
                  asset transfers or contract invocations take a 3-of-5 on-chain consensus.
                </p>
              </div>
            </TwoPanel>
          </div>
          <Divider />
        </Content>
      </PageSection>
    </>
  );
};
