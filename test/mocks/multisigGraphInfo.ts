import {MultisigAccountGraphInfo, MultisigAccountInfo, NetworkType, PublicAccount} from 'nem2-sdk';

export const multisigGraphInfoPublicAccount1 = PublicAccount.createFromPublicKey(
 'B694186EE4AB0558CA4AFCFDD43B42114AE71094F5A1FC4A913FE9971CACD21D', NetworkType.MIJIN_TEST);
export const multisigGraphInfoPublicAccount2 = PublicAccount.createFromPublicKey(
 'CF893FFCC47C33E7F68AB1DB56365C156B0736824A0C1E273F9E00B8DF8F01EB', NetworkType.MIJIN_TEST);
export const multisigGraphInfoPublicAccount3 = PublicAccount.createFromPublicKey(
 '68B3FBB18729C1FDE225C57F8CE080FA828F0067E451A3FD81FA628842B0B763', NetworkType.MIJIN_TEST);
export const multisigGraphInfoPublicAccount4 = PublicAccount.createFromPublicKey(
 'DAB1C38C3E1642494FCCB33138B95E81867B5FB59FC4277A1D53761C8B9F6D14', NetworkType.MIJIN_TEST);
export const multisigGraphInfoPublicAccount5 = PublicAccount.createFromPublicKey(
 '1674016C27FE2C2EB5DFA73996FA54A183B38AED0AA64F756A3918BAF08E061B', NetworkType.MIJIN_TEST);

export const multisigGraphInfoPublicAccounts = [
 multisigGraphInfoPublicAccount1,
 multisigGraphInfoPublicAccount2,
 multisigGraphInfoPublicAccount3,
 multisigGraphInfoPublicAccount4,
 multisigGraphInfoPublicAccount5,
];

const multisigAccountGraphInfoDTO = {
 level: 2,
 multisigEntries: [
  {
   multisig: {
    account: multisigGraphInfoPublicAccount1,
    cosignatories: [
     multisigGraphInfoPublicAccount2,
     multisigGraphInfoPublicAccount3,
     multisigGraphInfoPublicAccount4,
    ],
    minApproval: 3,
    minRemoval: 3,
    multisigAccounts: [multisigGraphInfoPublicAccount5],
   },
  },
 ],
};

const multisigAccounts = new Map<number, MultisigAccountInfo[]>();
multisigAccounts.set(
 multisigAccountGraphInfoDTO.level,
 multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
  return new MultisigAccountInfo(
   multisigAccountInfoDTO.multisig.account,
   multisigAccountInfoDTO.multisig.minApproval,
   multisigAccountInfoDTO.multisig.minRemoval,
   multisigAccountInfoDTO.multisig.cosignatories,
   multisigAccountInfoDTO.multisig.multisigAccounts,
  );
 }),
);
multisigAccounts.set(
 3,
 multisigAccountGraphInfoDTO.multisigEntries.map((multisigAccountInfoDTO) => {
  return new MultisigAccountInfo(
   multisigAccountInfoDTO.multisig.account,
   multisigAccountInfoDTO.multisig.minApproval,
   multisigAccountInfoDTO.multisig.minRemoval,
   multisigAccountInfoDTO.multisig.cosignatories,
   multisigAccountInfoDTO.multisig.multisigAccounts,
  );
 }),
);

export const multisigGraphInfo1 = new MultisigAccountGraphInfo(multisigAccounts);
