<script setup lang="ts">
import { BaseWalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-core";
import { TurnkeyWalletStrategy } from "@injectivelabs/wallet-turnkey/src/index.ts";
import { injectiveClients } from "./injective-clients";
import { onMounted } from "vue";
import { Wallet } from "@injectivelabs/wallet-base";
import {
  address,
  broadcaster,
  oidcToken,
  turnkeyWallet,
  walletStatus,
  walletStrategy,
} from "./reactives";

import LoginForm from "./components/LoginForm.vue";
import { setLocalStorageAddress } from "./utils";
import Connected from "./components/Connected.vue";
import { turnkeyAuthIframeContainerId } from "./constants";

onMounted(async () => {
  const turnkeyStrategy = new TurnkeyWalletStrategy({
    chainId: injectiveClients.chainId,
    ethereumOptions: {
      ethereumChainId: injectiveClients.ethereumChainId!,
    },
    metadata: {
      turnkey: {
        iframeContainerId: turnkeyAuthIframeContainerId,
        defaultOrganizationId: import.meta.env
          .VITE_TURNKEY_DEFAULT_ORGANIZATION_ID,
        apiBaseUrl: "https://api.turnkey.com",
        apiServerEndpoint: "https://api.ui.injective.network/api/v1",
      },
    },
  });

  turnkeyWallet.value = await turnkeyStrategy.getWalletClient();
  walletStrategy.value = new BaseWalletStrategy({
    strategies: {
      [Wallet.Turnkey]: turnkeyStrategy,
    },
    chainId: injectiveClients.chainId,
  });

  walletStrategy.value.enable();

  try {
    await walletStrategy.value.getSessionOrConfirm();
    const addresses = await walletStrategy.value.getAddresses();

    if (addresses.length > 0) {
      walletStatus.value = "logged-in";
      address.value = addresses[0];
      setLocalStorageAddress(addresses[0]);

      broadcaster.value = new MsgBroadcaster({
        network: injectiveClients.network,
        walletStrategy: walletStrategy.value,
        ethereumChainId: injectiveClients.ethereumChainId!,
        endpoints: injectiveClients.endpoints,
      });
    } else {
      walletStatus.value = "ready";
    }
  } catch (error) {
    console.error("🪵 | selectWallet | error:", error);
    walletStatus.value = "ready";
  }
});

onMounted(async () => {
  //? If the user has been redirected back from Google we need to use the OIDC token to login
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const params = {
    idToken: hashParams.get("id_token"),
  };

  oidcToken.value = params.idToken;
});
</script>

<template>
  <h1>Injective + Turnkey</h1>
  <div v-if="walletStatus === 'starting'">Loading...</div>
  <div v-else-if="walletStatus === 'logged-in'">
    <Connected />
  </div>
  <div v-else>
    <LoginForm />
  </div>
  <div :id="turnkeyAuthIframeContainerId" style="display: none"></div>
</template>

<style>
input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>
