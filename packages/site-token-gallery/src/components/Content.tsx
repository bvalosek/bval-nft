import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props {
  html?: string;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    content: {
      '& p': {
        fontSize: theme.scaledSpacing(4),
        marginBottom: theme.scaledSpacing(8),
        color: theme.palette.foreground.light,
      },
      '& p:last-child': {
        marginBottom: theme.scaledSpacing(0),
      },
      '& h2': {
        fontSize: theme.scaledSpacing(5),
        marginBottom: theme.scaledSpacing(2),
      },
      '& h2::before': {
        width: theme.scaledSpacing(5.5),
        height: theme.scaledSpacing(5.5),
        position: 'relative',
        top: theme.spacing(1),
        background: theme.palette.accent.main,
        content: '" "',
        display: 'inline-block',
        marginRight: theme.scaledSpacing(2),
      },
      '& a': {
        color: theme.palette.foreground.main,
        textDecoration: 'underline',
      },
      '& li': {
        fontSize: theme.scaledSpacing(4),
        color: theme.palette.foreground.light,
        listStyleType: 'square',
        marginLeft: theme.scaledSpacing(4.5),
      },
      '& strong': {
        color: theme.palette.foreground.main,
      },
      '& code': {
        color: theme.palette.foreground.main,
        fontSize: theme.scaledSpacing(2.7),
      },
    },
  };
});

/** display general page content */
export const Content: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  return props.html ? (
    <div className={classes.content} dangerouslySetInnerHTML={{ __html: props.html }} />
  ) : (
    <div className={classes.content}>{props.children}</div>
  );
};
