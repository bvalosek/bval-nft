import { makeStyles } from '@material-ui/styles';
import React, { FunctionComponent } from 'react';
import { ThemeConfig } from '../Theme';
import { SQNCRData } from '../web3/sqncr';
import { Button } from './Button';

interface Props {
  sqncr: SQNCRData | null;
}

const useStyles = makeStyles<ThemeConfig, Props>((theme) => {
  return {
    sqncr: {
      color: (props) => (props.sqncr ? theme.palette.sqncr[props.sqncr.color].main : 'black'),
    },
  };
});

export const SQNCR: FunctionComponent<Props> = ({ sqncr }) => {
  const classes = useStyles({ sqncr });

  if (sqncr === null) {
    return null;
  }

  const { tokenId } = sqncr;

  return (
    <Button navTo={`/sqncr/${tokenId}`}>
      <span className={classes.sqncr}>▣</span> SQNCR#{tokenId}
    </Button>
  );
};
