import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { useTokens } from '../hooks/tokens';
import { computeStats } from '../lib/faucet';
import { asDecimal } from '../lib/numbers';
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
    <PageSection maxWidth={'900px'}>
      <div className={classes.content}>
        <p>
          🐇 <a href="https://tokens.bvalosek.com/project">The BVAL NFT Project</a> has expanded to Layer 2. We're
          further down the rabbit hole now.
        </p>
        <p>
          🌈 Each NFT I mint on the{' '}
          <a href="https://www.screensaver.world/created/0x303EeFeDeE1bA8e5d507a55465d946B2fea18583">
            Screensaver.World
          </a>{' '}
          platform continously accumulates <strong>$VIBES</strong> as an intrinsically staked digital asset within the
          NFT.
          {/* will now be entangled with a custom digital engine that causes <strong>$VIBES</strong> to be
          generated inside of them over time. */}
        </p>
        <p>
          🎢 The current token owner can harvest the <strong>$VIBES</strong> to their wallet at any time, which
          permanently removes them from the NFT. <strong>$VIBES</strong> that are not harvested stay inside the NFT
          across sales or trades.
        </p>
        <p>
          📈 Total Accumulation:{' '}
          {stats.totalGenerated.gt(0) ? (
            <DecimalNumber number={stats.totalGenerated} interoplate={{ sampledAt, dailyRate: stats.totalDailyRate }} />
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
