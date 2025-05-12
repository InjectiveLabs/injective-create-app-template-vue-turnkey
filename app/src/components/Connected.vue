<script lang="ts" setup>
import { getEthereumAddress, MsgSend } from "@injectivelabs/sdk-ts";
import { ref } from "vue";
import {
  address,
  broadcaster,
  walletStatus,
  walletStrategy,
} from "../reactives";

import { setLocalStorageStrategy } from "../utils";

const msgValues = ref({
  to: address.value,
  from: address.value,
  amount: "1000000",
  denom: "factory/inj1dm0yt646fsjsvznjz2twyht9ytcmwz3aqydjjp/RealTrumPepe",
});

const txHash = ref("");

const isLoading = ref(false);

const handleSendClick = async () => {
  if (
    !msgValues.value.to ||
    !msgValues.value.from ||
    !msgValues.value.amount ||
    !msgValues.value.denom
  ) {
    throw new Error("Invalid input");
  }

  if (!address.value) {
    throw new Error("Address not initialized");
  }

  if (!broadcaster.value) {
    throw new Error("Broadcaster not initialized");
  }

  isLoading.value = true;

  const msgs = MsgSend.fromJSON({
    srcInjectiveAddress: msgValues.value.from,
    dstInjectiveAddress: msgValues.value.to,
    amount: [
      {
        denom: msgValues.value.denom,
        amount: msgValues.value.amount,
      },
    ],
  });

  try {
    const result = await broadcaster.value.broadcastWithFeeDelegation({
      msgs,
      injectiveAddress: address.value,
      ethereumAddress: getEthereumAddress(address.value),
    });

    console.log("🪵 | result:", result);
    if (result.txHash) {
      txHash.value = result.txHash;
    }
  } catch (error) {
    console.error("Error sending tx", error);
  } finally {
    isLoading.value = false;
  }
};

async function disconnect() {
  await walletStrategy.value?.disconnect();
  walletStatus.value = "ready";
  setLocalStorageStrategy(undefined);
}
</script>

<template>
  <h2>Connected!</h2>
  <div class="actions">
    <button @click="disconnect()">Logout</button>
  </div>
  <div>
    <span>Addresses: {{ address }}</span>
  </div>

  <h3>Send Tx</h3>
  <form>
    <label>
      <span>To</span>
      <input type="text" v-model="msgValues.to" />
    </label>
    <label>
      <span>Amount</span>
      <input type="text" v-model="msgValues.amount" />
    </label>
    <label>
      <span>Denom</span>
      <input type="text" v-model="msgValues.denom" />
    </label>
    <button
      type="submit"
      @click.prevent="handleSendClick"
      :disabled="isLoading"
    >
      {{ isLoading ? "Sending..." : "Submit" }}
    </button>
    <div v-if="txHash">
      <span>Tx Hash: {{ txHash }}</span>
      <a :href="`https://injscan.com/transaction/${txHash}`" target="_blank">
        <span>View on Explorer</span>
      </a>
    </div>
  </form>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-bottom: 10px;
}

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
