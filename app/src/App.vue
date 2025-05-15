<script setup lang="ts">
import { BaseWalletStrategy, MsgBroadcaster } from "@injectivelabs/wallet-core";
import {
  TurnkeyOauthWalletStrategy,
  TurnkeyOtpWalletStrategy,
  TurnkeyWallet,
} from "@injectivelabs/wallet-turnkey/src/index.ts";
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
import { getLocalStorageStrategy, setLocalStorageStrategy } from "./utils";
import Connected from "./components/Connected.vue";
import { turnkeyAuthIframeContainerId } from "./constants";

onMounted(async () => {
  const turnkeyOAuthStrategy = new TurnkeyOauthWalletStrategy({
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

  const turnkeyOTPStrategy = new TurnkeyOtpWalletStrategy({
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

  turnkeyWallet.value = new TurnkeyWallet({
    defaultOrganizationId: import.meta.env.VITE_TURNKEY_DEFAULT_ORGANIZATION_ID,
    apiBaseUrl: "https://api.turnkey.com",
    apiServerEndpoint: "https://api.ui.injective.network/api/v1",
    iframeContainerId: turnkeyAuthIframeContainerId,
  });

  walletStrategy.value = new BaseWalletStrategy({
    strategies: {
      [Wallet.TurnkeyOauth]: turnkeyOAuthStrategy,
      [Wallet.TurnkeyOtp]: turnkeyOTPStrategy,
    },
    chainId: injectiveClients.chainId,
  });

  const savedStrategy = getLocalStorageStrategy();

  if (savedStrategy) {
    selectWallet(savedStrategy as Wallet.TurnkeyOauth | Wallet.TurnkeyOtp);
  } else {
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

async function selectWallet(wallet: Wallet.TurnkeyOauth | Wallet.TurnkeyOtp) {
  if (!walletStrategy.value) {
    return;
  }
  walletStrategy.value.wallet = wallet;

  try {
    walletStrategy.value.enable();
    const session = await walletStrategy.value.getSessionOrConfirm();

    if (!session) {
      walletStatus.value = "ready";
      return;
    }

    const addresses = await walletStrategy.value.getAddresses();
    console.log("🪵 | selectWallet | addresses:", addresses);
    address.value = addresses[0];

    if (addresses.length > 0) {
      walletStatus.value = "logged-in";
    } else {
      walletStatus.value = "ready";
    }

    broadcaster.value = new MsgBroadcaster({
      network: injectiveClients.network,
      walletStrategy: walletStrategy.value,
      ethereumChainId: injectiveClients.ethereumChainId!,
      endpoints: injectiveClients.endpoints,
    });
  } catch (error) {
    setLocalStorageStrategy(undefined);
    console.error("🪵 | selectWallet | error:", error);
    walletStatus.value = "ready";
  }
}
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
