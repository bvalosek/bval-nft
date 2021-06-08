import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent, InputHTMLAttributes } from 'react';
import { ThemeConfig } from '../Theme';

interface Props extends React.HTMLAttributes<InputHTMLAttributes> {
  value?: string | number;
  onTextChange: (text: string) => unknown;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    input: {
      background: theme.palette.background.main,
      borderSize: '1px',
      borderStyle: 'solid',
      borderColor: theme.palette.foreground.dark,
      padding: theme.scaledSpacing(1),
      fontSize: theme.scaledSpacing(3),
      color: theme.palette.foreground.main,
      '&:focus': {
        outline: 'none',
        borderColor: theme.palette.accent.secondary,
      },
    },
  };
});

export const Input: FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  const { onTextChange, ...attrs } = props;
  const className = `${classes.input} ${attrs.className ?? ''}`;

  if (onTextChange) {
    attrs.onChange = (event) => {
      onTextChange(`${(event.target as any).value}`);
    };
  }

  return (
    <input {...attrs} className={className}>
      {props.children}
    </input>
  );
};
