import React, { FunctionComponent, ReactNode } from 'react';
import { makeStyles } from '@material-ui/styles';
import { defaultMetadata, GatsbyTokenData } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Content } from './Content';
import { ExternalLink } from './ExternalLink';

interface Props {
  token: GatsbyTokenData;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      '& dt': {
        fontSize: theme.scaledSpacing(3.5),
        color: theme.palette.foreground.secondary,
        textTransform: 'uppercase',
        fontWeight: 'bold',
      },
      '& dd': {
        fontWeight: 'bold',
        fontSize: theme.scaledSpacing(5),
      },
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: theme.scaledSpacing(16),
    },
    info: {
      marginTop: theme.scaledSpacing(4),
      fontSize: theme.scaledSpacing(4),
      display: 'grid',
      gap: theme.scaledSpacing(4),
      '@media(min-width: 800px)': {
        gridTemplateColumns: 'auto auto',
      },
    },
    statTitle: {
      fontSize: theme.scaledSpacing(3.5),
      textTransform: 'uppercase',
      color: theme.palette.foreground.secondary,
    },
    statInfo: {
      fontSize: theme.scaledSpacing(5),
      fontWeight: 'bold',
    },
  };
});

const Info: FunctionComponent<{ title: ReactNode; info: ReactNode }> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.stat}>
      <div className={classes.statInfo}>{props.info}</div>
      <div className={classes.statTitle}>{props.title}</div>
    </div>
  );
};

export const TokenDetails: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { token } = props;
  const ts = token.source.token;
  const metadata = defaultMetadata(token);

  return (
    <div className={classes.container}>
      <Content>
        <h2>Token Details</h2>
        <div className={classes.info}>
          <Info title="Token Number" info={`#${ts.tokenNumber}`} />
          <Info title="Edition" info={`${ts.editionNumber} / ${ts.editionTotal}`} />
          <Info title="Minted" info={ts.minted} />
          <Info title="Completed" info={ts.created} />
          <Info title="Original File" info={`${ts.width} x ${ts.height} ${ts.assetType}`} />
        </div>
      </Content>
      <Content>
        <h2>Token Assets</h2>
        <ul>
          {metadata.assets.map((asset) => (
            <li>
              {asset.name} - <ExternalLink url={asset.ipfsGatewayUrl}>Download from IPFS</ExternalLink>
            </li>
          ))}
        </ul>
      </Content>
    </div>
  );
};
