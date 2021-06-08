import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { useTokens } from '../hooks/tokens';
import { computeStats } from '../lib/faucet';
import { DecimalNumber } from './DecimalNumber';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    content: {
      fontSize: theme.scaledSpacing(4),
      display: 'grid',
      gap: theme.spacing(10),
      '& a': {
        color: theme.palette.accent.secondary,
      },
      '& strong': {
        color: theme.palette.accent.tertiary,
      },
    },
  };
});

export const Info: FunctionComponent = () => {
  const classes = useStyles();
  const { tokens, sampledAt } = useTokens();
  const stats = computeStats(tokens);

  return (
    <PageSection maxWidth={'1000px'}>
      <div className={classes.content}>
        <p>
          🐇 <a href="https://tokens.bvalosek.com/project">The BVAL NFT Project</a> has expanded to Layer 2. We're
          further down the rabbit hole than ever now.
        </p>
        <p>
          🌈 I hacked my{' '}
          <a href="https://www.screensaver.world/created/0x303EeFeDeE1bA8e5d507a55465d946B2fea18583">
            Screensaver.World
          </a>{' '}
          NFTs to continously generate <strong>$VIBES</strong> inside of them as an intrinsically staked digital asset.
        </p>
        <p>
          🎢 The owner of an NFT can unstake the <strong>$VIBES</strong> to their wallet at any time, which is a one-way
          operation. Staked <strong>$VIBES</strong> stay inside the NFT across transfers or sales.
        </p>
        <p>
          💎 This captures the value of holding my art, and allows my collectors to capitalize on that value by
          unstaking the generated <strong>$VIBES</strong>. I'm calling this mechanic <em>Provenance Mining</em>.
        </p>
        <p>
          📈 Total Intrinsic Stake:{' '}
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
          <strong>$VIBES</strong>
        </p>
        <p>
          🍄 As always, we are absolutely doing this shit live. Want to know more or see whats next? Find me in the{' '}
          <a href="https://tokens.bvalosek.com/contact">usual places</a> or visit the{' '}
          <a href="https://discord.gg/wGdTeU3kk4" target="_blank" rel="noopener">
            Screensaver DAO
          </a>{' '}
          Discord and check out the community.
        </p>
      </div>
    </PageSection>
  );
};
