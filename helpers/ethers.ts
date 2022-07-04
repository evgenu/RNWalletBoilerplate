import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';
import { Alert } from 'react-native';

export function isAddress(value: string) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getSigner(web3Provider: Web3Provider, address: string) {
  return web3Provider.getSigner(address).connectUnchecked();
}

export function getProviderOrSigner(web3Provider: Web3Provider, address: string) {
  return address ? getSigner(web3Provider, address) : web3Provider;
}

export function getContract(
  contractAddress: string,
  ABI: any,
  web3Provider: Web3Provider,
  providerAddress: string
) {
  if (!isAddress(contractAddress) || contractAddress === AddressZero) {
    throw Error(`Invalid 'address' parameter '${contractAddress}'.`);
  }

  return new Contract(contractAddress, ABI, getProviderOrSigner(web3Provider, providerAddress));
}

export const prepareSignature = async (
  tokenContract: Contract,
  address: string,
  library: Web3Provider,
  value: BigNumber
) => {
  const nonce = await tokenContract.nonces(address); // Our Token Contract Nonces
  const deadline = +new Date() + 60 * 60; // Permit with deadline which the permit is valid

  const EIP712Domain = [
    // array of objects -> properties from the contract and the types of them ircwithPermit
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'verifyingContract', type: 'address' },
  ];

  const domain = {
    name: await tokenContract.name(),
    version: '1',
    verifyingContract: tokenContract.address,
  };

  const Permit = [
    // array of objects -> properties from erc20withpermit
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ];

  const message = {
    owner: address,
    spender: process.env.LIBRARY_CONTRACT_ADDRESS,
    value: value.toString(),
    nonce: nonce.toHexString(),
    deadline,
  };

  const data = JSON.stringify({
    types: {
      EIP712Domain,
      Permit,
    },
    domain,
    primaryType: 'Permit',
    message,
  });

  const signatureLike = await library.send('eth_signTypedData_v4', [address, data]);
  const signature = await utils.splitSignature(signatureLike);

  const preparedSignature = {
    v: signature.v,
    r: signature.r,
    s: signature.s,
    deadline,
  };

  return preparedSignature;
};

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
};
export async function sendTransaction(functionToExecute: Function, triesToExecute: number = 0) {
  const functionTransaction = await functionToExecute();
  const functionReceipt = await functionTransaction.await();

  if (functionReceipt !== 1 && triesToExecute === 3) {
    Alert.alert('Transaction Failure', 'Could not send transaction', [
      { text: 'OK', style: 'cancel' },
    ]);
  } else if (functionReceipt !== 1) {
    sendTransaction(functionToExecute, (triesToExecute = triesToExecute + 1));
  }
}
