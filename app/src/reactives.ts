import type { MsgBroadcaster, BaseWalletStrategy } from '@injectivelabs/wallet-core'
import type { TurnkeyWallet } from '@injectivelabs/wallet-turnkey/src/index.ts'
import { ref } from 'vue'

export const walletStrategy = ref<BaseWalletStrategy | null>(null)
export const broadcaster = ref<MsgBroadcaster | null>(null)
export const address = ref<string | null>(null)
export const oidcToken = ref<string | null>(null)
export const walletStatus = ref<'starting' | 'ready' |  'waiting-otp' | 'logged-in'>('starting')
export const turnkeyWallet = ref<TurnkeyWallet | null>(null)