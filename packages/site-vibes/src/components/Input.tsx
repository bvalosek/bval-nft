import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

interface Props extends React.HTMLProps<HTMLInputElement> {
  value?: string | number;
  onTextChange?: (text: string) => unknown;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    input: {
      background: theme.palette.background.main,
      color: theme.palette.foreground.main,
      border: 'none',
      // padding: theme.scaledSpacing(1),
      width: '100%',
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
    if (attrs.onInput !== undefined) {
      throw new Error();
    }
    attrs.onInput = (event) => {
      onTextChange(`${(event.target as any).value}`);
    };
  }

  return (
    <input {...attrs} className={className}>
      {props.children}
    </input>
  );
};
