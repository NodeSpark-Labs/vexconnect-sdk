# @nodespark/vexconnect

Connect web dApps to Vexanium wallets — core SDK + modal UI.

Handles wallet discovery, QR pairing, encrypted sessions, transaction signing, and auto-reconnect. Works with any framework (React, Vue, Svelte, vanilla JS).

---

## Installation

```bash
npm install @nodespark/vexconnect
```

---

## Quick Start

```ts
import { openVexConnectModal } from '@nodespark/vexconnect'

const { session, bridge } = await openVexConnectModal({
  dappName: 'My dApp',
  dappUrl:  'https://mydapp.com',
})

console.log(session.account)   // "myaccount"
console.log(session.publicKey) // wallet's public key

// Send a transaction
const result = await bridge.sendTransaction({
  actions: [
    {
      account: 'vex.token',
      name: 'transfer',
      authorization: [{ actor: session.account, permission: 'active' }],
      data: {
        from:     session.account,
        to:       'otheraccount',
        quantity: '1.0000 VEX',
        memo:     'hello',
      },
    },
  ],
})

console.log(result.txId, result.blockNum)

// Disconnect
bridge.disconnect()
```

---

## API Reference

### `openVexConnectModal(options)`

Opens the wallet selection modal. Returns a `Promise<VexConnectResult>` that resolves when the user approves the connection.

Sessions are automatically persisted in `localStorage` — on the next page load, the SDK silently resumes the last session without showing the modal again.

```ts
const { session, bridge } = await openVexConnectModal({
  dappName:         'My dApp',           // required — shown in wallet's native approval screen
  dappUrl:          'https://mydapp.com', // required — shown in wallet's native approval screen
  dappIcon:         'https://mydapp.com/icon.png', // optional — sent to the wallet's native approval screen only, NOT rendered in the dApp-side modal (its header uses a fixed VexConnect brand mark)
  theme:            'dark',              // 'light' | 'dark' | 'auto' (default: 'auto')
  accentColor:      '#f59e0b',           // optional — override accent color
  connectTimeoutMs: 300_000,             // optional — pairing timeout (default: 5 min)
})
```

#### `VexConnectResult`

| Field | Type | Description |
|-------|------|-------------|
| `session` | `VexSession` | Connected session info |
| `bridge` | `VexConnect` | Bridge instance for sending transactions |

#### `VexSession`

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | `string` | Unique session identifier |
| `account` | `string` | Connected Vexanium account name |
| `publicKey` | `string` | Wallet's active public key |

---

### `bridge.sendTransaction(request)`

Sends a transaction to the wallet for signing. The wallet shows an approval dialog; the promise resolves when the user approves.

```ts
const result = await bridge.sendTransaction({
  actions: [
    {
      account:       'vex.token',   // contract account
      name:          'transfer',      // action name
      authorization: [{ actor: session.account, permission: 'active' }],
      data: {                         // action data — resolved against live ABI
        from:     session.account,
        to:       'recipient',
        quantity: '10.0000 VEX',
        memo:     '',
      },
    },
  ],
})

// result.txId     — transaction ID
// result.blockNum — block number
```

Throws if the user rejects or the wallet doesn't respond within 120 seconds.

---

### `bridge.disconnect()`

Ends the session and clears persisted state.

```ts
bridge.disconnect()
```

---

### `bridge.on(event, handler)`

Listen for connection events.

```ts
bridge.on('disconnect', () => {
  console.log('Wallet disconnected')
  // update your UI
})

bridge.on('error', (err) => {
  console.error('Connection error:', err.message)
})
```

---

### `bridge.currentSession`

Returns the active `VexSession`, or `null` if not connected.

```ts
const session = bridge.currentSession
if (session) {
  console.log('Connected as', session.account)
}
```

---

### `bridge.isConnected`

Returns `true` if there's an active session and the underlying WebSocket to the relay is open, `false` otherwise. Useful for guarding calls to `sendTransaction()` without waiting on a `disconnect` event first.

```ts
if (bridge.isConnected) {
  await bridge.sendTransaction({ actions: [...] })
}
```

---

## Framework Examples

### React

```tsx
import { useState } from 'react'
import { openVexConnectModal, VexConnect, VexSession } from '@nodespark/vexconnect'

export default function App() {
  const [session, setSession] = useState<VexSession | null>(null)
  const [bridge, setBridge]   = useState<VexConnect | null>(null)

  async function connect() {
    const result = await openVexConnectModal({
      dappName: 'My dApp',
      dappUrl:  'https://mydapp.com',
    })
    setSession(result.session)
    setBridge(result.bridge)
    result.bridge.on('disconnect', () => {
      setSession(null)
      setBridge(null)
    })
  }

  async function transfer() {
    if (!bridge || !session) return
    const result = await bridge.sendTransaction({
      actions: [{
        account:       'vex.token',
        name:          'transfer',
        authorization: [{ actor: session.account, permission: 'active' }],
        data: { from: session.account, to: 'recipient', quantity: '1.0000 VEX', memo: '' },
      }],
    })
    alert(`Tx: ${result.txId}`)
  }

  if (!session) {
    return <button onClick={connect}>Connect Wallet</button>
  }

  return (
    <div>
      <p>Connected: {session.account}</p>
      <button onClick={transfer}>Send 1 VEX</button>
      <button onClick={() => bridge?.disconnect()}>Disconnect</button>
    </div>
  )
}
```

### Vue 3

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { openVexConnectModal, VexConnect, VexSession } from '@nodespark/vexconnect'

const session = ref<VexSession | null>(null)
const bridge  = ref<VexConnect | null>(null)

async function connect() {
  const result = await openVexConnectModal({
    dappName: 'My dApp',
    dappUrl:  'https://mydapp.com',
  })
  session.value = result.session
  bridge.value  = result.bridge
  result.bridge.on('disconnect', () => {
    session.value = null
    bridge.value  = null
  })
}
</script>

<template>
  <button v-if="!session" @click="connect">Connect Wallet</button>
  <div v-else>
    <p>Connected: {{ session.account }}</p>
    <button @click="bridge?.disconnect()">Disconnect</button>
  </div>
</template>
```

### Vanilla JS

```html
<button id="connect">Connect Wallet</button>
<p id="account"></p>

<script type="module">
  import { openVexConnectModal } from 'https://esm.sh/@nodespark/vexconnect'

  document.getElementById('connect').addEventListener('click', async () => {
    const { session, bridge } = await openVexConnectModal({
      dappName: 'My dApp',
      dappUrl:  window.location.origin,
    })
    document.getElementById('account').textContent = 'Connected: ' + session.account
    bridge.on('disconnect', () => {
      document.getElementById('account').textContent = ''
    })
  })
</script>
```

---

## How It Works

1. **Pairing** — The SDK connects to the VexConnect relay and generates a unique session URI. The modal shows a QR code and deep link.
2. **Handshake** — When the wallet scans or taps the link, both sides perform an X25519 ECDH key exchange over the relay. The derived session key never leaves the devices.
3. **Encryption** — All subsequent messages (transaction requests, approvals) are AES-GCM encrypted end-to-end.
4. **Persistence** — The session is stored in `localStorage` with a 7-day TTL. Page reloads resume silently without re-pairing.
5. **Reconnect** — If the WebSocket drops, the SDK reconnects with exponential backoff (1s → 2s → 4s → 8s → 16s).

---

## Relay

The official relay is hosted at `wss://connect.nodespark.org`.

---

## License

MIT © [NodeSpark Labs](https://nodespark.org)
