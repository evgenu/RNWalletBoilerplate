import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
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

export async function sendTransaction(
  functionToExecute: Function,
  triesToExecute: number = 0
) {
  const functionTransaction = await functionToExecute();
  const functionReceipt = await functionTransaction.await();

  if(functionReceipt !== 1 && triesToExecute === 3) {
    Alert.alert('Transaction Failure', 'Could not send transaction', [{text: 'OK', style: 'cancel'}]);
  } else if(functionReceipt !== 1) {
    sendTransaction(functionToExecute, triesToExecute = triesToExecute + 1);
  }
}
