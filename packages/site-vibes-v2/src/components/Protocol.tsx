import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Content } from './Content';
import { Title } from './Title';
import { Vibes } from './Vibes';
import { Address } from './Address';
import { useProtocol } from '../hooks/protocol';
import { DecimalNumber } from './DecimalNumber';
import { Stats } from './Stats';
import { Button } from './Button';
import { MarketPrice } from './MarketPrice';
import { TwoPanel } from './TwoPanel';
import { Divider } from './Divder';
import { ButtonGroup } from './ButtonGroup';
import { useTokens } from '../hooks/tokens';
import { BigNumber } from '@ethersproject/bignumber';

export const Protocol: FunctionComponent = () => {
  const { protocolView } = useProtocol();
  const { tokens } = useTokens();

  if (protocolView == null || tokens == null) {
    return (
      <PageSection>
        <Content>
          <Title>⌛️ LOADING</Title>
        </Content>
      </PageSection>
    );
  }

  const totalMined = tokens.reduce((acc, t) => acc.add(t.mined), BigNumber.from(0));
  const totalClaimed = tokens.reduce((acc, t) => acc.add(t.claimed), BigNumber.from(0));
  const totalDailyRate = tokens.reduce((acc, t) => acc.add(t.dailyRate), BigNumber.from(0));
  const totalClaimable = tokens.reduce((acc, t) => acc.add(t.claimable), BigNumber.from(0));

  return (
    <>
      <PageSection>
        <Content>
          <Title>VIBES Protocol</Title>
          <p>
            The <Vibes /> protocol is made up of a cluster smart contracts. Information about the parameters, roles, and
            addresses of the main contracts are listed here.
          </p>
          <p>
            For more information, check out the{' '}
            <Button externalNavTo="https://docs.sickvibes.xyz/resources/architecture">
              Architecture Documentation
            </Button>{' '}
            on the <Vibes /> documentation site.
          </p>
        </Content>
      </PageSection>
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
                    externalNavTo={`https://quickswap.exchange/#/swap?inputCurrency=ETH&outputCurrency=${protocolView.quickswap.vibesMaticPool.address}`}
                  >
                    <Address address={protocolView.quickswap.vibesMaticPool.address} />
                  </Button>
                  <br />
                  <strong>VIBES price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesUsdcPrice} decimals={5} /> USD
                  <br />
                  <strong>VIBES price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPrice} decimals={5} /> MATIC
                  <br />
                  <strong>MATIC price</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.maticUsdcPrice} decimals={2} /> USD
                  <br />
                  <strong>total liquidity</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.totalSupply} decimals={0} /> LP ($
                  <MarketPrice
                    amount={protocolView.quickswap.vibesMaticPool.vibesReserve.mul(2)}
                    price="vibesUsdcPrice"
                  />
                  )
                  <br />
                  <strong>&nbsp;- VIBES</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.vibesReserve} decimals={0} />
                  <br />
                  <strong>&nbsp;- MATIC</strong>:{' '}
                  <DecimalNumber number={protocolView.quickswap.vibesMaticPool.maticReserve} decimals={0} />
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
                      externalNavTo={`https://polygonscan.com/address/${protocolView.quickswap.vibesMaticPool.address}#tokentxns`}
                    >
                      🔎 VIEW market trxs
                    </Button>
                    <Button
                      externalNavTo={`https://info.quickswap.exchange/pair/${protocolView.quickswap.vibesMaticPool.address}`}
                    >
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
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    The original <Vibes /> Wellspring contract that handles the bookkeeping associated with provenance
                    mining.
                  </p>
                  <p>
                    Read data is proxied through the Wellspring V2 contract now, but the original seeded <Vibes /> are
                    still locked in this contract.
                  </p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <div>
            <Title>Wellspring v2</Title>
            <TwoPanel>
              <div>
                <Stats>
                  <strong>address</strong>:{' '}
                  <Button externalNavTo={`https://polygonscan.com/address/${protocolView.wellspringV2.address}`}>
                    <Address address={protocolView.wellspringV2.address} />
                  </Button>
                  <br />
                  <strong>TVL</strong>:{' '}
                  <DecimalNumber decimals={0} number={protocolView.wellspringV2.totalVibesLocked} /> <Vibes /> ($
                  <MarketPrice amount={protocolView.wellspringV2.totalVibesLocked} price="vibesUsdcPrice" />)
                  <br />
                  <strong>managed tokens</strong>: {protocolView.wellspringV2.tokenCount}
                  <br />
                  <strong>mining</strong>: <DecimalNumber decimals={0} number={totalDailyRate} /> <Vibes /> ($
                  <MarketPrice amount={totalDailyRate} price="vibesUsdcPrice" />) / day
                  <br />
                  <strong>mined</strong>: <DecimalNumber decimals={0} number={totalMined} /> <Vibes /> ($
                  <MarketPrice amount={totalMined} price="vibesUsdcPrice" />)
                  <br />
                  <strong>claimable</strong>: <DecimalNumber decimals={0} number={totalClaimable} /> <Vibes /> ($
                  <MarketPrice amount={totalClaimable} price="vibesUsdcPrice" />)
                  <br />
                  <strong>claimed</strong>: <DecimalNumber decimals={0} number={totalClaimed} /> <Vibes /> ($
                  <MarketPrice amount={totalClaimed} price="vibesUsdcPrice" />)
                </Stats>
              </div>
              <div>
                <Content>
                  <p>
                    Wellspring V2 improves on V1 by adding support for multiple NFT contracts, better on-chain
                    enumerability, and multi-artist support.
                  </p>
                  <p>Locked tokens cannot be removed except by NFT owners via provenance mining</p>
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
                <Content>
                  <p>
                    The <Vibes /> multisig uses a Gnosis Safe to store protocol assets and manage protocol parameters.
                  </p>
                  <p>All asset transfers or contract invocations take a 3-of-5 on-chain consensus.</p>
                </Content>
              </div>
            </TwoPanel>
          </div>
          <Divider />
        </Content>
      </PageSection>
    </>
  );
};
