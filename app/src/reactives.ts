import type { MsgBroadcaster } from '@injectivelabs/wallet-core'
import type {
  TurnkeyWalletStrategy
} from '@injectivelabs/wallet-turnkey'
import type {TurnkeyStatus} from '@injectivelabs/wallet-base'
import { ref } from 'vue'

export const turnkeyStrategy = ref<TurnkeyWalletStrategy | null>(null)
export const broadcaster = ref<MsgBroadcaster | null>(null)
export const turnkeyStatus = ref<TurnkeyStatus | null>(null)
export const address = ref<string | null>(null)
export const oidcToken = ref<string | null>(null)
