import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { useTokens } from '../hooks/tokens';
import { computeStats } from '../lib/faucet';
import { DecimalNumber } from './DecimalNumber';
import { Content } from './Content';
import { Vibes } from './Vibes';
import { Hero } from './Hero';
import { Divider } from './Divder';
import { Button } from './Button';
import { Stats } from './Stats';
import { ButtonGroup } from './ButtonGroup';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {};
});

export const Info: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, sampledAt } = useTokens();
  const stats = computeStats(tokens);

  return (
    <>
      <PageSection>
        <Hero>vibes.</Hero>
        <Content>
          <p>
            🐇 <a href="https://tokens.bvalosek.com/project">The BVAL NFT Project</a> has expanded to Layer 2. We're
            further down the rabbit hole than ever now.
          </p>
          <p>
            🌈 I hacked my{' '}
            <a href="https://www.screensaver.world/created/0x303EeFeDeE1bA8e5d507a55465d946B2fea18583">
              Screensaver.World
            </a>{' '}
            <Button navTo="/tokens">NFTs</Button> to continously generate <Vibes /> inside of them as an intrinsically
            staked digital asset.
          </p>
          <p>
            🎢 The owner of an NFT can unstake the <Vibes /> to their wallet at any time, which is a one-way operation.
            Staked <Vibes /> stay inside the NFT across transfers or sales.
          </p>
          <p>
            💎 This captures the value of holding my art, and allows my collectors to capitalize on that value by
            unstaking the generated <Vibes />. I'm calling this mechanic{' '}
            <strong>
              <em>Provenance Mining</em>
            </strong>
            .
          </p>
          <Stats>
            <p>
              🔥 <strong>total mined</strong>:{' '}
              {stats.totalGenerated.gt(0) ? (
                <>
                  <DecimalNumber
                    number={stats.totalClaimable}
                    interoplate={{ sampledAt, dailyRate: stats.totalDailyRate }}
                  />
                </>
              ) : (
                '⌛️'
              )}{' '}
              <Vibes />
              <br />
              🚀 <strong>net mining rate</strong>:{' '}
              {stats.totalGenerated.gt(0) ? <DecimalNumber number={stats.totalDailyRate} decimals={0} /> : '⌛️'}{' '}
              <Vibes /> / day
              <br />
              🤑 <strong>total value locked</strong>:{' '}
              {stats.totalGenerated.gt(0) ? <DecimalNumber number={stats.totalBalance} decimals={0} /> : '⌛️'}{' '}
              <Vibes />
            </p>
          </Stats>
          <p>
            🥳 This is just the first phase: Distribution. <Vibes /> is an experimental asset, but it was designed with
            several utility use cases in mind.
          </p>
          <p>
            🍄 Looking for some <Vibes /> alpha? Find me in the{' '}
            <a href="https://tokens.bvalosek.com/contact">usual places</a> or visit the{' '}
            <a href="https://discord.gg/wGdTeU3kk4" target="_blank" rel="noopener">
              Screensaver DAO
            </a>{' '}
            Discord and check out the community.
          </p>
          <ButtonGroup>
            <Button navTo="/tokens">VIEW NFTs</Button>
            <Button navTo="/wallet">CHECK WALLET</Button>
          </ButtonGroup>
        </Content>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
