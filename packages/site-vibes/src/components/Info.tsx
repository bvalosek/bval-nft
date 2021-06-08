import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { useTokens } from '../hooks/tokens';
import { computeStats } from '../lib/faucet';
import { DecimalNumber } from './DecimalNumber';
import { Content } from './Content';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {};
});

export const Info: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, sampledAt } = useTokens();
  const stats = computeStats(tokens);

  return (
    <PageSection>
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
          NFTs to continously generate <Vibes /> inside of them as an intrinsically staked digital asset.
        </p>
        <p>
          🎢 The owner of an NFT can unstake the <Vibes /> to their wallet at any time, which is a one-way operation.
          Staked <Vibes /> stay inside the NFT across transfers or sales.
        </p>
        <p>
          💎 This captures the value of holding my art, and allows my collectors to capitalize on that value by
          unstaking the generated <Vibes />. I'm calling this mechanic <em>Provenance Mining</em>.
        </p>
        <p>
          🔥 Total Mined:{' '}
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
          🚀 Current Mining Rate:{' '}
          {stats.totalGenerated.gt(0) ? (
            <DecimalNumber number={stats.totalDailyRate} decimals={0} />
          ) : (
            '⌛️'
          )} <Vibes /> / day
          <br />
          🤑 Total Locked Value:{' '}
          {stats.totalGenerated.gt(0) ? <DecimalNumber number={stats.totalBalance} decimals={0} /> : '⌛️'} <Vibes />
        </p>
        <p>
          ⚡️ As always, we are absolutely <a href="https://tokens.bvalosek.com/bval-token">doing this shit live</a>.
        </p>
        <p>
          🍄 Want to know more about <Vibes />? Find me in the{' '}
          <a href="https://tokens.bvalosek.com/contact">usual places</a> or visit the{' '}
          <a href="https://discord.gg/wGdTeU3kk4" target="_blank" rel="noopener">
            Screensaver DAO
          </a>{' '}
          Discord and check out the community.
        </p>
      </Content>
    </PageSection>
  );
};
