<script setup lang="ts">
import { onMounted, ref } from "vue";
import { address, oidcToken, walletStatus, walletStrategy } from "../reactives";
import { TurnkeyProvider, Wallet } from "@injectivelabs/wallet-base";
import { setLocalStorageStrategy } from "../utils";
import { WalletException } from "@injectivelabs/exceptions";

const email = ref("");
const OTP = ref("");

const otpID = ref("");

const oauthError = ref("");

async function handleEmailSubmit() {
  console.log("email", email.value);
  if (!walletStrategy.value) {
    throw new Error("Wallet strategy not found");
  }

  walletStrategy.value.wallet = Wallet.TurnkeyOtp;

  walletStrategy.value.setMetadata({
    turnkey: {
      email: email.value,
    },
  });

  const result = await walletStrategy.value.getSessionOrConfirm();
  if (result) {
    walletStatus.value = "waiting-otp";
    otpID.value = result;
  }
}

async function handleOTPSubmit() {
  if (!walletStrategy.value) {
    throw new Error("Wallet strategy not found");
  }

  console.log("OTP", OTP.value);
  walletStrategy.value.setMetadata({
    turnkey: {
      otpCode: OTP.value,
      otpId: otpID.value,
    },
  });

  const result = await walletStrategy.value?.getAddresses();
  if (result?.length && result?.length > 0) {
    walletStatus.value = "logged-in";
    setLocalStorageStrategy(Wallet.TurnkeyOtp);
    address.value = result[0];
  }
}

function handleSubmitClick() {
  if (walletStatus.value === "waiting-otp") {
    return handleOTPSubmit();
  }

  if (walletStatus.value === "ready") {
    return handleEmailSubmit();
  }

  throw new Error("Turnkey not ready");
}

async function handleGoogleOAuthClick() {
  if (!walletStrategy.value) {
    throw new Error("Wallet strategy not found");
  }
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    throw new Error("Google client ID not found");
  }

  walletStrategy.value.wallet = Wallet.TurnkeyOauth;
  walletStrategy.value.setMetadata({
    turnkey: {
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      googleRedirectUri: "http://localhost:5173",
    },
  });
  const url = await walletStrategy.value.getSessionOrConfirm();

  if (!url) {
    throw new Error("URL not found");
  }

  window.location.href = url;
}

onMounted(async () => {
  if (oidcToken.value) {
    if (!walletStrategy.value) {
      return;
    }
    // ? Watches for a token response form Google and logs in if its there
    walletStrategy.value.wallet = Wallet.TurnkeyOauth;
    walletStrategy.value?.setMetadata({
      turnkey: {
        oidcToken: oidcToken.value,
        provider: TurnkeyProvider.Google,
        googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        googleRedirectUri: "http://localhost:5173",
      },
    });
    const result = await walletStrategy.value
      ?.getSessionOrConfirm()
      .catch((e: WalletException) => {
        if (e instanceof WalletException) {
          oauthError.value = e.message;
        }
      });
    if (result) {
      const addresses = await walletStrategy.value?.getAddresses();
      if (addresses?.length && addresses?.length > 0) {
        walletStatus.value = "logged-in";
        setLocalStorageStrategy(Wallet.TurnkeyOauth);
        address.value = addresses[0];
      }
    } else {
      //  tell the use to login with  OTP, store a flag
      oauthError.value =
        "An error occurred. Try logging in with your original signup method.";
    }

    // Clear all params from URL either way
    window.history.replaceState({}, "", window.location.pathname);
    oidcToken.value = "";
  }
});
</script>

<template>
  <div style="gap: 10px; display: flex; flex-direction: column">
    <form @submit.prevent="handleSubmitClick">
      <div v-if="oauthError" style="color: red">{{ oauthError }}</div>
      <label>
        <span>Email address </span>
        <input
          type="email"
          v-model="email"
          required
          :disabled="walletStatus === 'waiting-otp'"
        />
      </label>
      <label v-if="walletStatus === 'waiting-otp'">
        <span>OTP</span>
        <input
          type="text"
          v-model="OTP"
          :required="walletStatus === 'waiting-otp'"
        />
      </label>
      <button type="submit">Submit</button>
    </form>
    <div v-if="!oauthError && walletStatus !== 'waiting-otp'">
      <div>or</div>
      <button @click="handleGoogleOAuthClick">Login with Google</button>
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
