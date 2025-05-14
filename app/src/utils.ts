import { getEthereumAddress } from "@injectivelabs/sdk-ts";
import { getAddress } from "viem";


export function getLocalStorageStrategy() {
  return localStorage.getItem('turnkeyStrategy')
}

export function setLocalStorageStrategy(strategy: string| undefined) {
  if (!strategy) {
    localStorage.removeItem('turnkeyStrategy')
  } else {
    localStorage.setItem('turnkeyStrategy', strategy)
  }
}

export function getChecksumAddress(address: string) {
  if (address.startsWith('0x')) {
    return getAddress(address)
  }

  if (address.startsWith('inj')) {
    return getAddress(getEthereumAddress(address))
  }

  throw new Error('Invalid address')
}