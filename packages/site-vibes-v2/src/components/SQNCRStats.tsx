import React, { FunctionComponent } from 'react';
import { Title } from './Title';
import { useWallet } from '../hooks/wallet';
import { SQNCR } from './SQNCR';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';
import { Content } from './Content';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    header: {
      fontWeight: 'bold',
      color: theme.palette.accent.secondary,
    },
    onlyDesktop: {
      '@media(max-width: 799px)': { display: 'none' },
    },
  };
});

export const SQNCRStats: FunctionComponent = () => {
  const { accountView } = useWallet();
  const classes = useStyles();

  return (
    <div>
      <Title>Your SQNCRs</Title>
      <Content>
        {accountView.sqncrs.length === 0 ? (
          <p style={{ textAlign: 'center' }}>(none)</p>
        ) : (
          <table>
            <thead>
              <tr className={classes.header}>
                <th style={{ textAlign: 'left' }}>SQNCR</th>
                <th style={{ textAlign: 'left' }}>variant</th>
                <th style={{ textAlign: 'left' }} className={classes.onlyDesktop}>
                  shell
                </th>
                <th style={{ textAlign: 'left' }} className={classes.onlyDesktop}>
                  modules
                </th>
              </tr>
            </thead>
            <tbody>
              {accountView?.sqncrs.map((sqncr) => (
                <tr key={sqncr.tokenId}>
                  <td>
                    <SQNCR sqncr={sqncr} />
                  </td>
                  <td>???</td>
                  <td className={classes.onlyDesktop}>DEFAULT.EXE</td>
                  <td className={classes.onlyDesktop}>(none)</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <ButtonGroup>
          {accountView?.maxMints > accountView?.mintedSQNCRs ? (
            <Button navTo="/sqncr/mint">🚀 MINT new SQNCR</Button>
          ) : (
            <Button disabled>max SQNCRs minted</Button>
          )}
        </ButtonGroup>
      </Content>
    </div>
  );
};
