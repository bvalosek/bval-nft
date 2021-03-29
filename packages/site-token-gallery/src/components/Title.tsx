import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/styles';
import Img from 'gatsby-image';

import { ThemeConfig } from '../Theme';

interface Props {
  title: React.ReactNode;
  vibe?: React.ReactNode;
  subtitle?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fluidImage?: any;
}

const useStyles = makeStyles((theme: ThemeConfig) => {
  return {
    header: {
      lineHeight: 1.2,
      fontSize: theme.scaledSpacing(8, 2),
    },
    vibes: {
      color: theme.palette.foreground.secondary,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      fontSize: theme.scaledSpacing(4),
    },
    subtitle: {
      fontSize: theme.scaledSpacing(4),
      color: theme.palette.foreground.light,
      fontStyle: 'italic',
    },
    container: {
      display: 'grid',
      gap: theme.scaledSpacing(5.5),
      '@media(min-width: 800px)': {
        gridTemplateColumns: 'auto 1fr',
      },
    },
    image: {
      minWidth: theme.scaledSpacing(35),
    },
  };
});

export const Title: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        {props.fluidImage && (
          <div className={classes.image}>
            <Img fluid={props.fluidImage} />
          </div>
        )}
        <div>
          {props.vibe && <div className={classes.vibes}>{props.vibe}</div>}
          <h1 className={classes.header}>{props.title}</h1>
          {props.subtitle && <div className={classes.subtitle}>{props.subtitle}</div>}
        </div>
      </div>
    </>
  );
};
