import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';

type Props = React.HtmlHTMLAttributes<HTMLDivElement> & {
  gap?: number;
};

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    container: {
      display: 'grid',
      gap: (props) => theme.spacing(props.gap ?? 2),
    },
  };
});

export const VerticalGap: FunctionComponent<Props> = (props) => {
  const classes = useStyles(props);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gap, ...rest } = props;
  const className = `${classes.container} ${props.className ?? ''}`;
  return (
    <div {...rest} className={className}>
      {props.children}
    </div>
  );
};
