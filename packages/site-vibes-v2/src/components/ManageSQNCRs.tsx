import React, { FunctionComponent } from 'react';
import { PageSection } from './PageSection';
import { Connect } from './Connect';
import { Content } from './Content';
import { Title } from './Title';
import { useWallet } from '../hooks/wallet';
import { SQNCR } from './SQNCR';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { makeStyles } from '@material-ui/styles';
import { ThemeConfig } from '../Theme';

const useStyles = makeStyles<ThemeConfig>((theme) => {
  return {
    header: {
      fontWeight: 'bold',
      color: theme.palette.accent.secondary,
    },
  };
});

export const ManageSQNCRs: FunctionComponent = () => {
  const { accountView } = useWallet();
  const classes = useStyles();
  return (
    <>
      <PageSection>
        <Content>
          <Connect>
            <Title>Manage SQNCRs</Title>
            <table>
              <thead>
                <tr className={classes.header}>
                  <th style={{ textAlign: 'left' }}>SQNCR</th>
                  <th style={{ textAlign: 'left' }}>variant</th>
                  <th style={{ textAlign: 'left' }}>shell</th>
                  <th style={{ textAlign: 'left' }}>modules</th>
                </tr>
              </thead>
              <tbody>
                {accountView?.sqncrs.map((sqncr) => (
                  <tr key={sqncr.tokenId}>
                    <td>
                      <SQNCR sqncr={sqncr} />
                    </td>
                    <td>???</td>
                    <td>DEFAULT.EXE</td>
                    <td>(none)</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonGroup>
              {accountView?.maxMints > accountView?.mintedSQNCRs ? (
                <Button navTo="/sqncr/mint">🚀 MINT new SQNCR</Button>
              ) : (
                <Button disabled>max SQNCRs minted</Button>
              )}
            </ButtonGroup>
          </Connect>
        </Content>
      </PageSection>
    </>
  );
};
