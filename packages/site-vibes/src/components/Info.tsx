import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { theme } from '../../../site-token-gallery/src/Theme';

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
  return (
    <PageSection maxWidth={'900px'}>
      <div className={classes.content}>
        <p>
          🐇 <a href="https://tokens.bvalosek.com/project">The BVAL NFT Project</a> has expanded to Layer 2. We're
          further down the rabbit hole now.
        </p>
        <p>
          🌈 The NFTs I mint on{' '}
          <a href="https://www.screensaver.world/created/0x303EeFeDeE1bA8e5d507a55465d946B2fea18583">
            Screensaver.World
          </a>{' '}
          will now be entangled with a custom digital engine that causes <strong>$VIBES</strong> to be generated inside
          of them over time.
        </p>
        <p>
          🎢 The current token owner can harvest the <strong>$VIBES</strong> within the NFT to their wallet at any time,
          which permanently removes them from the NFT.
        </p>
        <p>
          🍄 As always, we are absolutely doing this shit live. Want to know more? Find me in the{' '}
          <a href="https://tokens.bvalosek.com/contact">usual places</a> or check out the{' '}
          <a href="https://discord.gg/wGdTeU3kk4" target="_blank" rel="noopener">
            Screensaver DAO
          </a>{' '}
          Discord to check out the community.
        </p>
      </div>
    </PageSection>
  );
};
