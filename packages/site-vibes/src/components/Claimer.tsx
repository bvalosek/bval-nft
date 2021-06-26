import { makeStyles } from '@material-ui/styles';
import { BigNumber, ContractTransaction, utils as ethersUtils } from 'ethers';
import React, { FunctionComponent, useState } from 'react';
import { useTokens } from '../hooks/tokens';
import { ThemeConfig } from '../Theme';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { Input } from './Input';
import { New } from './Next';
import { Vibes } from './Vibes';

interface Props {
  tokenId: string;
  onClaim: (amount: BigNumber) => Promise<ContractTransaction>;
}

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      fontSize: theme.spacing(4),
      '@media(min-width: 800px)': {
        fontSize: theme.spacing(4.5),
      },
    },
    claimer: {
      '@media(min-width: 800px)': {
        width: theme.spacing(130),
      },
      margin: `${theme.spacing(10)} 0`,
    },
    top: {
      display: 'flex',
      '& div:first-child': { flex: 1 },
      marginBottom: theme.spacing(2),
      alignItems: 'flex-end',
    },
    big: {
      fontSize: theme.spacing(5.5),
    },
    input: {
      border: `solid ${theme.spacing(0.25)} ${theme.palette.foreground.dark}`,
      display: 'flex',
      '& div:first-child': { flex: 1 },
      '& div:not(:first-child)': { marginLeft: theme.spacing(2) },
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    buttons: {
      marginTop: theme.spacing(10),
    },
  };
});

export const Claimer: FunctionComponent<Props> = ({ tokenId, onClaim }) => {
  const classes = useStyles();
  const [toClaim, setToClaim] = useState<string>('');
  const [trx, setTrx] = useState<null | 'confirming'>(null);
  const { tokens } = useTokens();

  const token = tokens.find((t) => t.tokenId === tokenId);

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val.match(/^[0-9]*[.,]?[0-9]*$/)) {
      setToClaim(val);
    }
  };

  const max = () => {
    setToClaim(ethersUtils.formatUnits(token.claimable, 18));
  };

  const claim = async () => {
    const valueToClaim = ethersUtils.parseUnits(toClaim, 18);
    setTrx('confirming');
    try {
      await onClaim(valueToClaim);
    } catch (err) {
      setTrx(null);
    }
  };

  let caption = '🤑 UNSTAKE VIBES';
  let disabled = false;
  let showMax = true;
  let nice = false;

  if (toClaim === '') {
    caption = '⚠️ INPUT AMOUNT';
    disabled = true;
  } else {
    try {
      const valueToClaim = toClaim ? ethersUtils.parseUnits(toClaim, 18) : BigNumber.from(0);

      if (toClaim.replace('.', '').match(/420|69/)) {
        nice = true;
      }

      if (valueToClaim.gt(token.claimable)) {
        caption = '⚠️ INSUFFICIENT STAKE';
        disabled = true;
      } else if (valueToClaim.eq(token.claimable)) {
        showMax = false;
      }
    } catch (err) {
      caption = '⚠️ INVALID AMOUNT';
      disabled = true;
    }
  }

  // override depending on trx state
  if (trx === 'confirming') {
    caption = '⌛️ CONFIRM TRANSACTION';
    disabled = true;
  }

  return (
    <div className={classes.container}>
      <div className={classes.claimer}>
        <div className={classes.top}>
          <div>
            <strong>CLAIM</strong>{' '}
            {nice && (
              <>
                <New label="nice 🤙" />
              </>
            )}
          </div>
          <div>
            staked: <DecimalNumber number={token.claimable} />
          </div>
        </div>
        <div className={classes.input}>
          <div className={classes.big}>
            <Input value={toClaim} onInput={onInput} inputMode="decimal" placeholder="0.00" spellCheck={false} />
          </div>
          <div>{showMax && <Button onClick={() => max()}>MAX</Button>}</div>
          <div className={classes.big}>
            <Vibes />
          </div>
        </div>
        <div className={`${classes.big} ${classes.buttons}`}>
          <ButtonGroup>
            <Button onClick={() => claim()} disabled={disabled}>
              {caption}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};
