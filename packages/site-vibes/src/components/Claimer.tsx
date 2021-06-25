import { makeStyles } from '@material-ui/styles';
import { BigNumber } from 'ethers';
import React, { FunctionComponent, useState } from 'react';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { DecimalNumber } from './DecimalNumber';
import { Input } from './Input';
import { Vibes } from './Vibes';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    claimer: {
      width: theme.spacing(95),
      '& > div': {
        display: 'flex',
        marginBottom: theme.spacing(2),
        '& div:first-child': {
          flex: 1,
        },
      },
    },
  };
});

export const Claimer: FunctionComponent = () => {
  const classes = useStyles();
  const [toClaim, setToClaim] = useState<string | undefined>(undefined);

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val.match(/^[0-9]*[.,]?[0-9]*$/)) {
      setToClaim(val);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.claimer}>
        <div>
          <div>CLAIM</div>
          <div>
            staked: <DecimalNumber number={BigNumber.from(1234567)} />
          </div>
        </div>
        <div>
          <div>
            <Input value={toClaim} onInput={onInput} inputMode="decimal" placeholder="0.0" spellCheck={false} />
          </div>
          <div>
            <Button>All</Button> <Vibes />
          </div>
        </div>
      </div>
    </div>
  );
};
