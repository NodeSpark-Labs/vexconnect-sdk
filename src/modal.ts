import { VexConnect, VexSession, VEXCONNECT_RELAY } from './core.js'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletEntry {
  id: string
  name: string
  iconUrl: string
  description?: string
  deepLinkScheme?: string
  /**
   * https:// base URL the wallet has verified via its own App Links/Universal
   * Links config (assetlinks.json / apple-app-site-association). When set,
   * the pairing URI is wrapped as `${universalLink}?uri=<encoded uri>` so
   * tapping it opens the wallet directly, or falls back to a normal webpage
   * if the app isn't installed. Dynamic per-wallet — same model as
   * WalletConnect's wallet registry, no domain is hardcoded by the SDK.
   */
  universalLink?: string
  playStoreUrl?: string
  appStoreUrl?: string
}

/** Wraps the raw pairing URI for a specific wallet's deep-link/QR target. */
function walletOpenUrl(wallet: WalletEntry, coreUri: string): string {
  if (!wallet.universalLink) return coreUri
  const sep = wallet.universalLink.includes('?') ? '&' : '?'
  return `${wallet.universalLink}${sep}uri=${encodeURIComponent(coreUri)}`
}

export interface VexConnectModalOptions {
  dappName: string
  dappUrl: string
  dappIcon?: string
  /**
   * Override wallet list. If omitted, fetched automatically from
   * the official VexConnect registry.
   */
  wallets?: WalletEntry[]
  theme?: 'light' | 'dark' | 'auto'
  accentColor?: string
  connectTimeoutMs?: number
}

export interface VexConnectResult {
  session: VexSession
  bridge: VexConnect
}

// ─── Default wallets ──────────────────────────────────────────────────────────

const NODESPARK_LOGO = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImJnR3JhZGllbnQiIGN4PSIzNSUiIGN5PSIzMCUiIHI9Ijg1JSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxQjIwNDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTQxODMzIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJub2RlR3JhZGllbnRQb3MiIHgxPSIwIiB5MT0iMCIgeDI9IjUwMCIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzJBOTNFMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3QzVDRjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InN0YXJHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZFOUI4Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y1QTgzQyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxmaWx0ZXIgaWQ9Im5vZGVHbG93IiB4PSItMTUwJSIgeT0iLTE1MCUiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMCIgcmVzdWx0PSJibHVyIi8+CiAgICAgIDxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0iYmx1ciIvPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIvPjwvZmVNZXJnZT4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciBpZD0ic3Rhckdsb3ciIHg9Ii0xNTAlIiB5PSItMTUwJSIgd2lkdGg9IjQwMCUiIGhlaWdodD0iNDAwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjE0IiByZXN1bHQ9ImJsdXIiLz4KICAgICAgPGZlTWVyZ2U+PGZlTWVyZ2VOb2RlIGluPSJibHVyIi8+PGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+PC9mZU1lcmdlPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiByeD0iMTIwIiBmaWxsPSJ1cmwoI2JnR3JhZGllbnQpIi8+CiAgPGcgc3Ryb2tlPSIjNEE2QkM0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1vcGFjaXR5PSIwLjU1Ij4KICAgIDxsaW5lIHgxPSIyNTAiIHkxPSIxMDgiIHgyPSIxMjgiIHkyPSIxODAiLz4KICAgIDxsaW5lIHgxPSIyNTAiIHkxPSIxMDgiIHgyPSIzNzIiIHkyPSIxODAiLz4KICAgIDxsaW5lIHgxPSIxMjgiIHkxPSIxODAiIHgyPSIxMjgiIHkyPSIzMTgiLz4KICAgIDxsaW5lIHgxPSIzNzIiIHkxPSIxODAiIHgyPSIzNzIiIHkyPSIzMTgiLz4KICAgIDxsaW5lIHgxPSIxMjgiIHkxPSIzMTgiIHgyPSIyNTAiIHkyPSIzODgiLz4KICAgIDxsaW5lIHgxPSIzNzIiIHkxPSIzMTgiIHgyPSIyNTAiIHkyPSIzODgiLz4KICAgIDxsaW5lIHgxPSIyNTAiIHkxPSIxMDgiIHgyPSIyNTAiIHkyPSIzODgiLz4KICAgIDxsaW5lIHgxPSIxMjgiIHkxPSIxODAiIHgyPSIzNzIiIHkyPSIzMTgiLz4KICAgIDxsaW5lIHgxPSIzNzIiIHkxPSIxODAiIHgyPSIxMjgiIHkyPSIzMTgiLz4KICA8L2c+CiAgPGcgZmlsdGVyPSJ1cmwoI25vZGVHbG93KSI+CiAgICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIxMDgiIHI9IjI0IiBmaWxsPSIjNEE3OEQ2Ii8+CiAgICA8Y2lyY2xlIGN4PSIxMjgiIGN5PSIxODAiIHI9IjI0IiBmaWxsPSIjMkE5M0UwIi8+CiAgICA8Y2lyY2xlIGN4PSIzNzIiIGN5PSIxODAiIHI9IjI0IiBmaWxsPSIjNkU1Q0YwIi8+CiAgICA8Y2lyY2xlIGN4PSIxMjgiIGN5PSIzMTgiIHI9IjI0IiBmaWxsPSIjNEE3OEQ2Ii8+CiAgICA8Y2lyY2xlIGN4PSIzNzIiIGN5PSIzMTgiIHI9IjI0IiBmaWxsPSIjN0M1Q0Y1Ii8+CiAgICA8Y2lyY2xlIGN4PSIyNTAiIGN5PSIzODgiIHI9IjI0IiBmaWxsPSIjNzI1OUYyIi8+CiAgPC9nPgogIDxnIGZpbHRlcj0idXJsKCNzdGFyR2xvdykiPgogICAgPHBhdGggZD0iTTI1MCAxOTUgTDI2MiAyMzMgTDMwMCAyNDUgTDI2MiAyNTcgTDI1MCAyOTUgTDIzOCAyNTcgTDIwMCAyNDUgTDIzOCAyMzMgWiIgZmlsbD0idXJsKCNzdGFyR3JhZGllbnQpIi8+CiAgPC9nPgo8L3N2Zz4K`

// ─── Entry point ──────────────────────────────────────────────────────────────

/**
 * Opens the VexConnect wallet modal.
 *
 * @example
 * ```ts
 * const session = await openVexConnectModal({
 *   relayUrl: 'wss://connect.nodespark.fun',
 *   dappName: 'My dApp',
 *   dappUrl: 'https://mydapp.vex',
 * })
 * console.log(session.account) // "myaccount"
 * ```
 */
/**
 * Derives the HTTP(S) registry URL from the relay WebSocket URL.
 * wss://connect.nodespark.fun  →  https://connect.nodespark.fun/registry
 * ws://localhost:8080          →  http://localhost:8080/registry
 */
const REGISTRY_URL = VEXCONNECT_RELAY
  .replace(/^wss:\/\//, 'https://')
  .replace(/^ws:\/\//, 'http://')
  .replace(/\/$/, '') + '/registry'

async function fetchWallets(): Promise<WalletEntry[]> {
  try {
    const res = await fetch(REGISTRY_URL, { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json() as { wallets: WalletEntry[] }
    return Array.isArray(json.wallets) ? json.wallets : []
  } catch {
    return []
  }
}

export function openVexConnectModal(opts: VexConnectModalOptions): Promise<VexConnectResult> {
  return new Promise((resolve, reject) => {
    const showModal = () => {
      if (opts.wallets !== undefined) {
        new VexConnectModal(opts, opts.wallets, resolve, reject).mount()
        return
      }
      const modal = new VexConnectModal(opts, null, resolve, reject)
      modal.mount()
      fetchWallets().then((wallets) => modal.setWallets(wallets))
    }

    // Silently resume a previously-approved session (mirrors WalletConnect's
    // pairing persistence) - only falls through to the pairing modal if
    // there's nothing saved, or the wallet doesn't answer the resume ping.
    const resumed = VexConnect.tryResume(opts)
    if (!resumed) {
      showModal()
      return
    }
    resumed.connect().then(
      (session) => resolve({ session, bridge: resumed }),
      showModal,
    )
  })
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type View = 'loading' | 'wallets' | 'qr' | 'connecting' | 'connected' | 'error'

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── Overlay ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:999999;padding:16px;animation:fi .18s ease-out}
@keyframes fi{from{opacity:0}to{opacity:1}}

/* ── Modal card ── */
@keyframes su{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
.modal{--bg:#141618;--bd:rgba(255,255,255,.06);--sf:rgba(255,255,255,.05);--tx:#e2e8f0;--mt:#64748b;--ac:#f59e0b;background:var(--bg);border:1px solid var(--bd);border-radius:24px;width:100%;max-width:400px;overflow:hidden;animation:su .28s cubic-bezier(.34,1.56,.64,1);box-shadow:0 32px 96px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
.modal.light{--bg:#ffffff;--bd:rgba(0,0,0,.08);--sf:rgba(0,0,0,.04);--tx:#0f172a;--mt:#64748b}

/* ── Header ── */
.hdr{display:flex;align-items:center;gap:8px;padding:20px 20px 0}
.hdr-brand{display:flex;align-items:center;gap:7px;flex:1;min-width:0}
.hdr-logo{flex-shrink:0;width:24px;height:24px}
.hdr-t{font-size:15px;font-weight:600;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:32px;height:32px;border-radius:50%;background:var(--sf);border:1px solid var(--bd);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--mt);font-size:14px;transition:.15s;flex-shrink:0}
.x:hover{background:rgba(255,255,255,.1);color:var(--tx);border-color:rgba(255,255,255,.12)}
.modal.light .x:hover{background:rgba(0,0,0,.08);color:var(--tx);border-color:rgba(0,0,0,.12)}

/* ── Loading / shimmer ── */
.loading{padding:20px 16px 24px;display:flex;flex-direction:column;gap:10px}
@keyframes sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
.shimmer-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:var(--sf)}
.shimmer{border-radius:8px;background:linear-gradient(90deg,var(--sf) 25%,rgba(255,255,255,.09) 50%,var(--sf) 75%);background-size:200% 100%;animation:sh 1.4s ease-in-out infinite}
.modal.light .shimmer{background:linear-gradient(90deg,var(--sf) 25%,rgba(0,0,0,.07) 50%,var(--sf) 75%);background-size:200% 100%}
.sh-icon{width:52px;height:52px;border-radius:12px;flex-shrink:0}
.sh-lines{flex:1;display:flex;flex-direction:column;gap:6px}
.sh-name{height:14px;width:45%;border-radius:6px}
.sh-desc{height:11px;width:60%;border-radius:5px}

/* ── Wallet list ── */
.wlist{padding:14px 12px 8px;display:flex;flex-direction:column;gap:4px}
.wi-row{display:flex;align-items:center;gap:6px}
.wi{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;border:1px solid transparent;background:var(--sf);cursor:pointer;transition:background .15s,border-color .15s,box-shadow .15s,transform .1s;text-align:left;flex:1}
.qr-ico{flex-shrink:0;width:40px;height:40px;border-radius:12px;background:var(--sf);border:1px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--mt);transition:background .15s,border-color .15s,color .15s}
.qr-ico svg{width:18px;height:18px}
.qr-ico:hover{background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.3);color:var(--ac)}
.wi:hover{background:rgba(255,255,255,.07);border-color:rgba(245,158,11,.3);box-shadow:0 0 0 1px rgba(245,158,11,.12),0 4px 16px rgba(0,0,0,.2);transform:translateY(-1px)}
.modal.light .wi:hover{background:rgba(0,0,0,.04);border-color:rgba(245,158,11,.35);box-shadow:0 0 0 1px rgba(245,158,11,.15),0 4px 12px rgba(0,0,0,.08)}
.wi:nth-child(1){animation:wfi .18s ease both}
.wi:nth-child(2){animation:wfi .18s .05s ease both}
.wi:nth-child(3){animation:wfi .18s .10s ease both}
.wi:nth-child(4){animation:wfi .18s .15s ease both}
.wi:nth-child(n+5){animation:wfi .18s .18s ease both}
@keyframes wfi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.wico{width:52px;height:52px;border-radius:12px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center}
.wico img{width:100%;height:100%;object-fit:cover}
.winfo{flex:1;min-width:0}
.wn{font-size:15px;font-weight:600;color:var(--tx);line-height:1.2}
.wd{font-size:12px;color:var(--mt);margin-top:2px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wa{font-size:20px;color:var(--mt);margin-left:auto;flex-shrink:0;padding-left:6px;line-height:1}

/* ── Footer ── */
.foot{display:flex;align-items:center;justify-content:center;gap:5px;padding:12px 12px 18px;color:var(--mt);font-size:10px;letter-spacing:.02em;opacity:.7}
.foot svg{flex-shrink:0}

/* ── QR / Download view ── */
.qrp{padding:10px 20px 20px;display:flex;flex-direction:column;align-items:center;gap:6px}
.back{background:none;border:none;cursor:pointer;color:var(--mt);font-size:12px;padding:0 0 4px;align-self:flex-start;display:flex;align-items:center;gap:3px;transition:.15s}
.back:hover{color:var(--tx)}
.hint{font-size:12px;color:var(--mt);text-align:center;line-height:1.5}
.dlbtn{width:100%;padding:13px;border-radius:12px;background:var(--ac);color:#0f172a;font-size:14px;font-weight:700;border:none;cursor:pointer;transition:.15s;display:block;text-align:center;text-decoration:none}
.dlbtn:hover{opacity:.88;transform:translateY(-1px)}
.dlbtn2{width:100%;padding:12px;border-radius:12px;background:transparent;color:var(--ac);font-size:13px;font-weight:600;border:1.5px solid rgba(245,158,11,.3);cursor:pointer;transition:.15s;text-decoration:none;display:block;text-align:center}
.dlbtn2:hover{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.5)}

/* ── Center panel (connecting / connected / error) ── */
.ctr{padding:28px 22px 32px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.spin{width:48px;height:48px;border:3px solid rgba(255,255,255,.08);border-top-color:var(--ac);border-radius:50%;animation:sp .7s linear infinite}
.modal.light .spin{border-color:rgba(0,0,0,.08);border-top-color:var(--ac)}
@keyframes sp{to{transform:rotate(360deg)}}
.ct{font-size:15px;font-weight:600;color:var(--tx)}
.cs{font-size:12px;color:var(--mt);line-height:1.5;max-width:260px}
.cwn{font-size:13px;font-weight:600;color:var(--ac);margin-top:-4px}

/* ── Connected ── */
@keyframes ck-in{0%{opacity:0;transform:scale(0)}60%{transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
.chk{width:56px;height:56px;border-radius:50%;background:rgba(52,211,153,.12);border:1.5px solid rgba(52,211,153,.3);display:flex;align-items:center;justify-content:center;animation:ck-in .4s cubic-bezier(.34,1.56,.64,1) both}
.chk-svg{width:26px;height:26px}
.ca{font-size:14px;color:var(--ac);font-weight:600}
.ck{font-size:11px;color:var(--mt);font-family:'SF Mono',ui-monospace,monospace;background:var(--sf);padding:4px 10px;border-radius:6px;border:1px solid var(--bd)}
.auto-close{font-size:11px;color:var(--mt)}

/* ── Error ── */
.err-ic{width:52px;height:52px;border-radius:50%;background:rgba(239,68,68,.12);border:1.5px solid rgba(239,68,68,.3);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.et{font-size:15px;font-weight:600;color:#ef4444}
.em{font-size:12px;color:var(--mt);line-height:1.5;max-width:260px}
.rbtn{margin-top:4px;padding:11px 28px;border-radius:10px;background:var(--ac);color:#0f172a;font-size:14px;font-weight:700;border:none;cursor:pointer;transition:.15s}
.rbtn:hover{opacity:.88;transform:translateY(-1px)}
`

class VexConnectModal {
  private host: HTMLElement
  private shadow: ShadowRoot
  private vc: VexConnect
  private wallets: WalletEntry[]
  private selected: WalletEntry | null = null
  private view: View = 'loading'
  private errMsg = ''
  private session: VexSession | null = null
  private dark: boolean
  private resolve: (r: VexConnectResult) => void
  private reject: (e: Error) => void

  constructor(
    private opts: VexConnectModalOptions,
    initialWallets: WalletEntry[] | null,
    resolve: (r: VexConnectResult) => void,
    reject: (e: Error) => void,
  ) {
    this.resolve = resolve
    this.reject = reject
    this.wallets = initialWallets ?? []
    if (initialWallets !== null) this.view = 'wallets'
    this.dark = opts.theme === 'dark' ||
      (opts.theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    this.vc = this.makeVc()
    this.host = document.createElement('div')
    this.shadow = this.host.attachShadow({ mode: 'open' })
  }

  private makeVc() {
    const vc = new VexConnect({
      dappName: this.opts.dappName,
      dappUrl: this.opts.dappUrl,
      dappIcon: this.opts.dappIcon,
      connectTimeoutMs: this.opts.connectTimeoutMs,
    })
    vc.on('disconnect', () => { if (this.session) this.unmount() })
    vc.on('error', (e) => this.showErr(e.message))
    return vc
  }

  mount() {
    document.body.appendChild(this.host)
    this.render()
    document.addEventListener('keydown', this.onKey)
  }

  /** Called after registry fetch completes. Transitions loading → wallets. */
  setWallets(wallets: WalletEntry[]) {
    this.wallets = wallets
    if (this.view === 'loading') {
      this.view = 'wallets'
      this.render()
    }
  }

  private unmount() {
    document.removeEventListener('keydown', this.onKey)
    this.host.remove()
  }

  private dismiss() {
    this.vc.disconnect()
    this.unmount()
    this.reject(new Error('User closed'))
  }

  private onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') this.dismiss() }

  private render() {
    // After initial mount, only replace the card's content — avoids the full
    // shadow-DOM wipe that causes the overlay to blink on every state change.
    const existing = this.shadow.querySelector<HTMLElement>('.modal')
    if (existing) {
      existing.innerHTML = ''
      existing.appendChild(this.buildHeader())
      existing.appendChild(this.buildBody())
      return
    }

    this.shadow.innerHTML = ''

    const style = document.createElement('style')
    style.textContent = CSS + (this.opts.accentColor ? `.modal{--ac:${this.opts.accentColor}}` : '')
    this.shadow.appendChild(style)

    const overlay = document.createElement('div')
    overlay.className = 'overlay'
    overlay.addEventListener('click', (e) => { if (e.target === overlay) this.dismiss() })

    const modal = document.createElement('div')
    modal.className = `modal${!this.dark ? ' light' : ''}`

    modal.appendChild(this.buildHeader())
    modal.appendChild(this.buildBody())
    overlay.appendChild(modal)
    this.shadow.appendChild(overlay)
  }

  private buildHeader() {
    const titles: Record<View, string> = {
      loading: 'Connect Wallet', wallets: 'Connect Wallet', qr: 'Get Wallet',
      connecting: 'Connecting…', connected: 'Connected', error: 'Connection Failed',
    }
    const h = document.createElement('div')
    h.className = 'hdr'

    const brand = document.createElement('div')
    brand.className = 'hdr-brand'
    brand.innerHTML = `
      <svg class="hdr-logo" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="vc-bg" cx="35%" cy="30%" r="85%">
            <stop offset="0%" stop-color="#1B2048"/>
            <stop offset="100%" stop-color="#141833"/>
          </radialGradient>
          <linearGradient id="vc-star" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFE9B8"/>
            <stop offset="100%" stop-color="#F5A83C"/>
          </linearGradient>
        </defs>
        <rect width="500" height="500" rx="120" fill="url(#vc-bg)"/>
        <g stroke="#4A6BC4" stroke-width="3" stroke-opacity="0.55">
          <line x1="250" y1="108" x2="128" y2="180"/><line x1="250" y1="108" x2="372" y2="180"/>
          <line x1="128" y1="180" x2="128" y2="318"/><line x1="372" y1="180" x2="372" y2="318"/>
          <line x1="128" y1="318" x2="250" y2="388"/><line x1="372" y1="318" x2="250" y2="388"/>
          <line x1="250" y1="108" x2="250" y2="388"/>
          <line x1="128" y1="180" x2="372" y2="318"/><line x1="372" y1="180" x2="128" y2="318"/>
        </g>
        <circle cx="250" cy="108" r="24" fill="#4A78D6"/>
        <circle cx="128" cy="180" r="24" fill="#2A93E0"/>
        <circle cx="372" cy="180" r="24" fill="#6E5CF0"/>
        <circle cx="128" cy="318" r="24" fill="#4A78D6"/>
        <circle cx="372" cy="318" r="24" fill="#7C5CF5"/>
        <circle cx="250" cy="388" r="24" fill="#7259F2"/>
        <path d="M250 195 L262 233 L300 245 L262 257 L250 295 L238 257 L200 245 L238 233 Z" fill="url(#vc-star)"/>
      </svg>
      <span class="hdr-t">${titles[this.view]}</span>`

    const x = document.createElement('button')
    x.className = 'x'
    x.setAttribute('aria-label', 'Close')
    x.innerHTML = '&#x2715;'
    x.addEventListener('click', () => this.dismiss())

    h.appendChild(brand)
    h.appendChild(x)
    return h
  }

  private buildBody() {
    switch (this.view) {
      case 'loading':    return this.buildLoading()
      case 'wallets':    return this.buildWallets()
      case 'qr':         return this.buildQr()
      case 'connecting': return this.buildConnecting()
      case 'connected':  return this.buildConnected()
      case 'error':      return this.buildError()
    }
  }

  private buildLoading() {
    const p = document.createElement('div')
    p.className = 'loading'
    for (let i = 0; i < 3; i++) {
      p.insertAdjacentHTML('beforeend', `
        <div class="shimmer-row">
          <div class="shimmer sh-icon"></div>
          <div class="sh-lines">
            <div class="shimmer sh-name"></div>
            <div class="shimmer sh-desc"></div>
          </div>
        </div>`)
    }
    return p
  }

  private buildWallets() {
    const wrap = document.createElement('div')

    const list = document.createElement('div')
    list.className = 'wlist'
    for (const w of this.wallets) {
      const row = document.createElement('div')
      row.className = 'wi-row'

      // Main area — opens deep link directly (or QR if no deep link)
      const btn = document.createElement('button')
      btn.className = 'wi'
      btn.innerHTML = `
        <div class="wico"><img src="${w.iconUrl}" alt="${w.name}"/></div>
        <div class="winfo">
          <div class="wn">${w.name}</div>
          <div class="wd">${w.description ?? ''}</div>
        </div>`
      btn.addEventListener('click', () => {
        this.selected = w
        this.startConnect()
        if (w.deepLinkScheme) {
          this.view = 'connecting'
          this.render()
        } else {
          this.view = 'qr'
          this.render()
        }
      })
      row.appendChild(btn)

      // Download icon button — shows store download links
      const dlBtn = document.createElement('button')
      dlBtn.className = 'qr-ico'
      dlBtn.setAttribute('aria-label', 'Download wallet')
      dlBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>`
      dlBtn.addEventListener('click', () => {
        this.selected = w
        this.view = 'qr'
        this.render()
      })
      row.appendChild(dlBtn)

      list.appendChild(row)
    }
    wrap.appendChild(list)
    wrap.appendChild(this.buildFooter())
    return wrap
  }

  private buildQr() {
    const wrap = document.createElement('div')
    const p = document.createElement('div')
    p.className = 'qrp'

    const back = document.createElement('button')
    back.className = 'back'
    back.innerHTML = '‹ All wallets'
    back.addEventListener('click', () => { this.view = 'wallets'; this.render() })
    p.appendChild(back)

    const w = this.selected
    if (w) {
      if (w.iconUrl) {
        const ico = document.createElement('div')
        ico.style.cssText = 'width:72px;height:72px;border-radius:18px;overflow:hidden;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center'
        ico.innerHTML = `<img src="${w.iconUrl}" style="width:100%;height:100%;object-fit:cover" alt="${w.name}"/>`
        p.appendChild(ico)
      }
      p.insertAdjacentHTML('beforeend', `
        <div class="ct">${w.name}</div>
        ${w.description ? `<div class="cs">${w.description}</div>` : ''}
        <div class="hint" style="margin-top:4px">Download the app to connect your wallet.</div>`)

      const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      const isAndroid = /Android/i.test(navigator.userAgent)

      if (w.playStoreUrl && !isIos) {
        const a = document.createElement('a')
        a.className = 'dlbtn'
        a.href = w.playStoreUrl
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'Get it on Google Play'
        p.appendChild(a)
      }
      if (w.appStoreUrl) {
        const a = document.createElement('a')
        a.className = (isIos || !w.playStoreUrl) ? 'dlbtn' : 'dlbtn2'
        a.href = w.appStoreUrl
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'Download on App Store'
        if (!isAndroid && !w.playStoreUrl) a.style.marginTop = '14px'
        p.appendChild(a)
      }
      if (!w.playStoreUrl && !w.appStoreUrl) {
        p.insertAdjacentHTML('beforeend', `<div class="cs">Visit the wallet's website to get started.</div>`)
      }
    }

    wrap.appendChild(p)
    wrap.appendChild(this.buildFooter())
    return wrap
  }

  private startConnect() {
    this.vc.connect()
      .then((s) => {
        if (this.selected) {
          this.vc.setWalletInfo(
            this.selected.deepLinkScheme ?? null,
            this.selected.name,
          )
        }
        this.session = s
        this.view = 'connected'
        this.render()
        setTimeout(() => { this.unmount(); this.resolve({ session: s, bridge: this.vc }) }, 1500)
      })
      .catch((e: Error) => {
        if (!e.message.includes('User closed')) this.showErr(e.message)
      })
  }

  private buildConnecting() {
    const p = document.createElement('div')
    p.className = 'ctr'
    p.innerHTML = `
      <div class="spin"></div>
      <div class="ct">Waiting for approval</div>
      ${this.selected ? `<div class="cwn">${this.selected.name}</div>` : ''}
      <div class="cs">Open ${this.selected?.name ?? 'your wallet'} and approve the connection request.</div>`

    if (this.selected?.deepLinkScheme) {
      const wallet = this.selected
      const uri = walletOpenUrl(wallet, this.vc.getUri())

      const openBtn = document.createElement('button')
      openBtn.className = 'dlbtn'
      openBtn.textContent = `Open ${wallet.name}`

      const tryOpen = () => {
        let appOpened = false
        const onVisibility = () => { if (document.hidden) appOpened = true }
        document.addEventListener('visibilitychange', onVisibility)
        window.location.href = uri
        setTimeout(() => {
          document.removeEventListener('visibilitychange', onVisibility)
          if (!appOpened && !this.session) {
            const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent)
            const storeUrl = isIos ? wallet.appStoreUrl : wallet.playStoreUrl
            if (storeUrl && !p.querySelector('.dlbtn2')) {
              const a = document.createElement('a')
              a.className = 'dlbtn2'
              a.href = storeUrl
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              a.textContent = `Get ${wallet.name}`
              p.appendChild(a)
            }
          }
        }, 2500)
      }

      openBtn.addEventListener('click', tryOpen)
      p.appendChild(openBtn)
    }

    return p
  }

  private buildConnected() {
    const p = document.createElement('div')
    p.className = 'ctr'
    const pubKey = this.session?.publicKey ?? ''
    const pubKeyTrunc = pubKey.length > 20 ? pubKey.slice(0, 10) + '…' + pubKey.slice(-8) : pubKey
    p.innerHTML = `
      <div class="chk">
        <svg class="chk-svg" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="13" cy="13" r="13" fill="rgba(52,211,153,0.15)"/>
          <polyline points="7,13 11,17 19,9" stroke="#34d399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="ct">Wallet Connected</div>
      <div class="ca">${this.session?.account ?? ''}</div>
      ${pubKey ? `<div class="ck">${pubKeyTrunc}</div>` : ''}
      <div class="auto-close">Closing automatically…</div>`
    return p
  }

  private buildError() {
    const p = document.createElement('div')
    p.className = 'ctr'
    p.innerHTML = `
      <div class="err-ic">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div class="et">Connection Failed</div>
      <div class="em">${this.errMsg}</div>`
    const r = document.createElement('button')
    r.className = 'rbtn'; r.textContent = 'Try Again'
    r.addEventListener('click', () => {
      this.vc = this.makeVc()
      this.view = 'wallets'; this.selected = null; this.errMsg = ''
      this.render()
    })
    p.appendChild(r)
    return p
  }

  private buildFooter() {
    const f = document.createElement('div')
    f.className = 'foot'
    f.innerHTML = `
      <img src="${NODESPARK_LOGO}" width="12" height="12" alt="" aria-hidden="true" style="border-radius:3px;object-fit:cover"/>
      Secured by VexConnect&nbsp;·&nbsp;nodespark.org`
    return f
  }

  private showErr(msg: string) { this.errMsg = msg; this.view = 'error'; this.render() }
}
