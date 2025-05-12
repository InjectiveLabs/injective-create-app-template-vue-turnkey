import { getEthereumAddress } from "@injectivelabs/sdk-ts";
import { getAddress } from "viem";

export function generateGoogleUrl(nonce: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    throw new Error('Google client ID not found')
  }

  const redirectUri = encodeURIComponent('http://localhost:5173')
  const scope = encodeURIComponent('openid profile email')
  const responseType = 'id_token'

  return `https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}`
}


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