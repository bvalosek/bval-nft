import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeConfig } from '../Theme';
import { Metadata, resolveMetadata } from '../lib/nft';
import { NFTView } from '../web3/wellspringv2';
import { DecimalNumber } from './DecimalNumber';
import { NFTLink } from './NFTLink';
import { TwoPanel } from './TwoPanel';
import { VerticalGap } from './VerticalGap';
import { Title } from './Title';
import { Address } from '../../../site-vibes/src/components/Address';
import { Button } from './Button';

interface Props {
  view: NFTView;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    token: {
      fontSize: theme.spacing(5),
    },
    media: {
      maxWidth: '50vh',
      '& img': {
        width: '100%',
      },
    },
  };
});

export const TokenCard: FunctionComponent<Props> = ({ view }) => {
  const classes = useStyles();
  const [metadata, setMetadata] = useState<Metadata>(undefined);

  const fetchToken = async () => {
    const metadata = await resolveMetadata(view);
    setMetadata(metadata);
  };

  useEffect(() => {
    fetchToken();
  }, [view.nft, view.tokenId]);

  if (!metadata) {
    return null;
  }

  return (
    <VerticalGap className={classes.token} gap={4}>
      <div className={classes.media}>
        <Link to={`/tokens/${view.nft}/${view.tokenId}`}>
          {metadata.image && <img src={metadata.image} />}
          {metadata.animation_url && (
            <video autoPlay muted loop controls={false}>
              <source src={metadata.animation_url} />
            </video>
          )}
        </Link>
      </div>
      {/* <VerticalGap gap={0.5}>
        <div className={classes.info}>
          <TwoPanel template="1fr auto">
            <div>
              <DecimalNumber
                number={view.claimable}
                interoplate={{ sampledAt: view.sampledAt, dailyRate: view.dailyRate }}
              />{' '}
              VIBES
            </div>
            <div>
              <NFTLink view={view} />
            </div>
          </TwoPanel>
        </div>
        <div>
          <Title align="left" margin={0}>
            {metadata.name}
          </Title>
        </div>
        {metadata.creator && (
          <div>
            <Button>
              <Address address={metadata.creator} />
            </Button>
          </div>
        )}
      </VerticalGap> */}
    </VerticalGap>
  );
};
