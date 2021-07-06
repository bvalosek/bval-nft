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
import { truncateHex } from '../lib/strings';

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

const otherL1People = [
  '0x6908c81da16a60a6abec06883ba27cf0398f47a9',
  '0x271f2d33c88133878a9eaec8091de094c617013b',
  '0x987aab2e64db6eb26bd591abdc9746fd44016267',
  '0xd16be44a4f59c15f7fd19aef9fb695f2e43dbca1',
  '0x5d4377C603d5B677d797Cb025e777e9b6B106EF0',
];

// https://polygonscan.com/token/0x64b10bc34746e3c7ac4505c76aec0c13e1d4965a#balances
const booshCoinHolders = [
  '0x0c6204b8ebaf837d5cff51447050777cd9b39fc4',
  '0x4dcedbdf36ac9ad41889671fe56b7abe37434390',
  '0x7d9197e146d5ec395992d118ef244e2f06bfbc37',
  '0x8abaf5733742b1506f6a1255de0e37aec76b7940',
  '0xc0a38fcac5b39c5454bd93775a74ec4183d2b488',
  '0xf8530cca204442e56f8f55ea35eb0fdf0b40eec8',
  '0xfc91be49bc90d263470f9d83feff46349165ae8e',
  '0x89e27f651186de46d656f8cd55ba9620dc556320',
];

// ppl i've collected on SSW, other ppl hyped on the project pre-launch
const additionalVibesAirdrops = [
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
  '0x897cE0748b9F874d9abc24117c740FA16026201D',
  '0x1Be195D2f8fd76C63c9ce274349F2ecF5486C601',
  '0x9A18E1412F7d8566005Db607E38c2279D26422D0',
  '0xb012A1bDCA34E1d0c2267bb50e6c53C8042eB4b6',
  '0x6C9b6041797C556d712a64F12e3035d019Fd450e',
  '0x05dB7e001F6650745DCFf8044d3e5AdE3af4C03a',
  '0x41ff38896855C46d62bc0276B7c35bd05668fdd1',
  '0x27641a64101fF152539dc88C24e09FF36Dc671c0',
  '0x4ffd5da06e6534F1e8B48a1fdFd19EaB0a6C0750',
  '0x046bBe099CfA0b6cc71d59D6E4Cd38c5d0eEF71b',
  '0x5333bc481bEAB05f7B6e7681ec8Fc49B0fb0E053',
  '0x83f8f7F1426580F64e54c1C9C9DC6007a95e5af0',
  '0xD1dCe085C1D53cFc979B13A053B3AE66b74a8634',
  '0xe288a00DF4b697606078876788e4D64633CD2e01',
  '0xB7D3A787a39f25457CA511dC3f0591b546f5e02f',
  '0x439ad039f0135eD849C1ebf692776265A1015C43',
  '0x41ff38896855C46d62bc0276B7c35bd05668fdd1',
  '0xC2bD7faca51549dbB8E701f48baAF5C135374613',
];

// top screensaver collectors
// https://polygonscan.com/token/0x486ca491c9a0a9ace266aa100976bfefc57a0dd4#balances
const topScreensaverCollectors = [
  '0x21db94192456295dd4bd7136580f1877264faafd',
  '0x27641a64101ff152539dc88c24e09ff36dc671c0',
  '0x9ec4ea049091265134181706868c695e441baa59',
  '0x21db94192456295dd4bd7136580f1877264faafd',
  '0x27641a64101ff152539dc88c24e09ff36dc671c0',
  '0x9ec4ea049091265134181706868c695e441baa59',
  '0x303eefedee1ba8e5d507a55465d946b2fea18583',
  '0x22ec7a4429c381f5c382ac7ea624cc05d37ffdde',
  '0x0e696712daded627f370ec9bbf9f7931cf19863d',
  '0x544bb9000af946ec304a154a4ac1663bac3dbe23',
  '0x0d5bb684506cebbf5fdfd6473691f19059d42d60',
  '0x3a30c8dc7913d54ea9a7d7cfe41ed77d9bda7b78',
  '0x3b3ac88fdfd33d8eb95d62d884ac552e46894887',
  '0x6fd6afe08202d7aefdf533ee44dc0e62941c4b22',
  '0xeb56bfe2b561d3191f4de93e11600e0933bf9554',
  '0x8f75dcb28b4101ed7568ce7a7d4efb7dee526daf',
  '0x7194d371a3a1658a2e6dec02b8c50bbb56fd60bc',
  '0x05db7e001f6650745dcff8044d3e5ade3af4c03a',
  '0x57e5f230f1a87d6276c2d9dbfd2c0c4a5beca4bf',
  '0x6744d79392eb4d47c49a92f03bce87885fa0f3c7',
  '0x6d765f26e56384ad21c5103995ad1c21fd239589',
  '0xa58b4a80de82b889ff40e487c58208a429c77f88',
];

// https://polygonscan.com/token/0x2452d8049f04d54ca779257678a691ee4a413267#balances
const topScreensaverV0Collectors = [
  '0x21db94192456295dd4bd7136580f1877264faafd',
  '0xa3d0562bf1714019b0a6900a12ad7662c405a4f8',
  '0x885d6d7bf2f0b3d6f70f8f05ab67d5044a1dfe1c',
  '0x544bb9000af946ec304a154a4ac1663bac3dbe23',
  '0x6d765f26e56384ad21c5103995ad1c21fd239589',
  '0x27641a64101ff152539dc88c24e09ff36dc671c0',
  '0xb7d3a787a39f25457ca511dc3f0591b546f5e02f',
  '0xa58b4a80de82b889ff40e487c58208a429c77f88',
  '0xe288a00df4b697606078876788e4d64633cd2e01',
  '0x0e696712daded627f370ec9bbf9f7931cf19863d',
  '0x3b3ac88fdfd33d8eb95d62d884ac552e46894887',
  '0x57e5f230f1a87d6276c2d9dbfd2c0c4a5beca4bf',
  '0x3a30c8dc7913d54ea9a7d7cfe41ed77d9bda7b78',
  '0x94aa50fe3c1ad32b0419004eee4f278ca3908876',
  '0xbcb1e8284e3a998a50a88f1562ac399de560b974',
  '0x8f75dcb28b4101ed7568ce7a7d4efb7dee526daf',
  '0xdb08edbcf449de2a2b27448a8040935802c621f1',
  '0x0fd73ea2391d2ee5806a15a22e67d583a403409b',
  '0xff9911abdbe9d1f7d1a19595b93905c2a9ad60f4',
];

const blacklist = [
  // dev address
  '0xFF2c630C4D354b2D505EC986EE8188b6820FCC4C',
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
  const [balance, setBalance] = useState<[BigNumber, BigNumber]>([BigNumber.from(0), BigNumber.from(0)]);
  const { library, registerTransactions } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  const provider = getProvider();

  // const fetch = async () => setBalance(await getVotePower(provider, address));
  const fetch = async () => {
    const [balance, pooled] = await Promise.all([
      getTokenBalance(provider, address),
      getPooledVibes(provider, address),
    ]);
    setBalance([balance, pooled]);
  };

  const drop = async () => {
    const trx = await sendVibes(library.getSigner(), address, vibesAmount(10000));
    setSubmitted(true);
    registerTransactions(trx);
  };

  useEffect(() => {
    fetch();
  }, [address]);

  const [inWallet, inPool] = balance;

  return (
    <>
      <Button onClick={() => drop()}>{!submitted ? '🎁' : '⏳'}</Button>{' '}
      <DecimalNumber number={inWallet} decimals={0} /> + <DecimalNumber number={inPool} decimals={0} />
    </>
  );
};

export const VIPs: FunctionComponent = () => {
  const { tokens } = useTokens();

  const vibesTokenHolders = tokens.map((t) => t.owner);

  const deduped = [
    ...new Set(
      [
        ...bvalHolders,
        ...additionalBvalAidrops,
        ...vibesTokenHolders,
        ...additionalVibesAirdrops,
        ...booshCoinHolders,
        ...otherL1People,
        ...topScreensaverCollectors,
        ...topScreensaverV0Collectors,
      ].map((a) => a.toLowerCase())
    ),
  ]
    .sort()
    .filter((a) => !blacklist.find((b) => b.toLowerCase() === a));

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
                      <Address address={address} /> {truncateHex(address)}
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
