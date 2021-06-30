import { BigNumber, utils as ethersUtils, utils } from 'ethers';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Address } from './Address';
import { Connect } from './Connect';
import { Content } from './Content';
import { DecimalNumber } from './DecimalNumber';
import { Divider } from './Divder';
import { PageSection } from './PageSection';
import { Title } from './Title';
import { useTokens } from '../hooks/tokens';
import { getVotePower } from '../lib/gov';
import { getProvider } from '../lib/rpc';
import { useWallet } from '../hooks/wallet';
import { getTokenBalance, sendVibes, vibesAmount } from '../lib/vibes';
import { getPooledVibes } from '../lib/quickswap';
import { Button } from './Button';

// https://etherscan.io/token/0x27525344bbba0ddb182251387aedd0bde7d466b2#balances
const bvalHolders = [
  '0xc9a4a36efe3e5393b70541fa678442d062c8deb9',
  '0x9562339b4f94b28613ada8ad35e698d96c44fcea',
  '0xb34bc1a92c354f0628717ca4f7ffd508e6714998',
  '0x89e27f651186de46d656f8cd55ba9620dc556320',
  '0xa1b607c52717dfe4d907d78d91f0f3804a63f592',
  '0xcc57cc48121f73faeb668d917f1da7cba424208f',
  '0x0b7f74c4b983821c41c5eb54256aaae1b630925c',
  '0x651933461668b353b2d035d8ba58acd9fc527f41',
  '0x8AbAf5733742B1506F6a1255de0e37aEc76b7940',
  '0xFc91BE49bC90d263470f9d83FEFf46349165Ae8e',
  '0xf8530CcA204442e56F8f55ea35Eb0fDF0b40eEc8',
  '0x303EeFeDeE1bA8e5d507a55465d946B2fea18583',
  '0x82b04eb793777a10de5e54b6235396e60d0e4b5f',
];

// https://discord.com/channels/819107803892547625/819107803892547628/840682777199771668
const additionalBvalAidrops = [
  '0x9d3F4EEB533B8e3C8f50dbbD2E351D1BF2987908',
  '0xBf26925f736E90E1715ce4E04cD9c289dD1bc002',
  '0x0cb5697e7342A15Ee23531D364996da89d8cc714',
  '0x3DFf997410D94E2E3C961F805b85eB2Ef80622c5',
  '0xB4A90135a4d412Cbf08A328b96A13aDa3e07b7eb',
  '0xBCd96443387243698f80c2457aded032EE962B98',
  '0xDd8c1dB65964607C119535c98a6F6eD52b41588E',
  '0xE0E9A1A0700E822462a43dD216Fc37b127F04dEE',
  '0xE48134D57d65Fde70ac5B4DAC32d1e2cdA3b8989',
  '0xEEcd2A6ffe01B62ED26102705465Bc598bdF7DDA',
];

const additionalVibesAirdrops = [
  // ppl i've collected on SSW, other ppl hyped on the project pre-launch
  '0xA58b4A80dE82b889FF40e487c58208A429c77f88',
  '0x183bdb344a07ee3d27f07ac4799a56e4a2fe5439',
  '0x0E696712DaDEd627f370Ec9Bbf9F7931cf19863D',
  '0x6Fd6AfE08202D7aefDF533ee44dc0E62941C4B22',
  '0xa3d0562Bf1714019B0A6900A12aD7662C405A4F8',
  '0x195AcAf2cCB5d388f4F5a03030AD765D74d94f3f',
  '0x992624220719dDC92A46783b475A7ee91490c957',
  '0x5948f8C9B7A250643cca2F378B23701C57200332',
  '0xA3e51498579Db0f7bb1ec9E3093B2F44158E25a5',
  '0x3B3ac88fdFd33d8Eb95D62D884ac552e46894887',
  '0xa6bcB89f21E0BF71E08dEd426C142757791e17cf',
  '0x80eE02DC24D9fD858f12857997Efd43Fe3E83035',
  '0x2f9d6B127837e2F7A8510560CD067F59EBa2f4aA',
  '0x211f656B82e254CFB2eC42bC89086eC9cB350C5e',
  '0xF77BfC2a8C1E309Ece5631531E9e1D74eA821fD0',
  '0x22D02786f813A70c5699621810D0ea85efA07332',
  '0x3819D14e0B3147829E072336c8beDb02b73eE0AB',
  '0x281E6843cC18c8d58eE131309F788879F6C18D10',
  '0x94aa50fe3c1ad32b0419004eee4f278ca3908876',
  '0x6fe1a56c978C1b66e97C2ae9B0cFd29e6483d040',
  '0x7129E13e699Acfc09e40Bac9468738ff87353417',
  '0xd998Db775Bf515D92c9142eD747F11e9f643866e',
  '0x7744CD2C2AFF4dd8ED635CEEBd96d1165609725c',
  '0xB7D3A787a39f25457CA511dC3f0591b546f5e02f',
  '0x3a30c8DC7913d54ea9A7d7cfE41eD77D9BdA7b78',
  '0x8aE6555F24420F55ecE055d3fa4bd27E8A62E2B5',
  '0xE90545D4Ac0Df0cca39CE84b4d984FC04ce39150',
  '0x41ff38896855C46d62bc0276B7c35bd05668fdd1',
  '0x27641a64101fF152539dc88C24e09FF36Dc671c0',
  '0x4ffd5da06e6534F1e8B48a1fdFd19EaB0a6C0750',
];

const MaticAirdrop: FunctionComponent<{ address: string }> = ({ address }) => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const [submitted, setSubmitted] = useState(false);
  const { library, registerTransactions } = useWallet();
  const provider = getProvider();

  const fetch = async () => setBalance(await provider.getBalance(address));

  const drop = async () => {
    const signer = library.getSigner();
    const trx = await signer.sendTransaction({ to: address, value: utils.parseEther('0.1') });
    setSubmitted(true);
    registerTransactions(trx);
  };

  useEffect(() => {
    fetch();
  }, [address]);

  return (
    <>
      <Button onClick={() => drop()}>{!submitted ? '🎁' : '⏳'}</Button> <DecimalNumber number={balance} />
    </>
  );
};

const VibesAirdrop: FunctionComponent<{ address: string }> = ({ address }) => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const { library, registerTransactions } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  const provider = getProvider();

  // const fetch = async () => setBalance(await getVotePower(provider, address));
  const fetch = async () => {
    const [balance, pooled] = await Promise.all([
      getTokenBalance(provider, address),
      getPooledVibes(provider, address),
    ]);
    setBalance(balance.add(pooled));
  };

  const drop = async () => {
    const trx = await sendVibes(library.getSigner(), address, vibesAmount(10000));
    setSubmitted(true);
    registerTransactions(trx);
  };

  useEffect(() => {
    fetch();
  }, [address]);

  return (
    <>
      <Button onClick={() => drop()}>{!submitted ? '🎁' : '⏳'}</Button> <DecimalNumber number={balance} />
    </>
  );
};

export const VIPs: FunctionComponent = () => {
  const { tokens } = useTokens();

  const vibesTokenHolders = tokens.map((t) => t.owner);

  const deduped = [
    ...new Set(
      [...bvalHolders, ...additionalBvalAidrops, ...vibesTokenHolders, ...additionalVibesAirdrops].map((a) =>
        a.toLowerCase()
      )
    ),
  ].sort();

  return (
    <>
      <Connect>
        <PageSection>
          <Content>
            <Title>VIP Airdrop - {deduped.length} addresses</Title>
            <table>
              <thead>
                <tr>
                  <th>address</th>
                  <th>MATIC</th>
                  <th>VIBES</th>
                </tr>
              </thead>
              <tbody>
                {deduped.map((address) => (
                  <tr key={address}>
                    <td>
                      <Address address={address} />
                    </td>
                    <td>
                      <MaticAirdrop address={address} />
                    </td>
                    <td>
                      <VibesAirdrop address={address} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Content>
        </PageSection>
      </Connect>
      <PageSection>
        <code>
          {deduped.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </code>
      </PageSection>
      <PageSection>
        <Divider />
      </PageSection>
    </>
  );
};
