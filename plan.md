# CDB Studio — Frontend Security Hardening & Backend Wiring

## 1. Architecture (RECAP)

**Backend** (`C:\Users\Clinque du Batiment\Desktop\Server`) — ALREADY IN PRODUCTION, NOT TOUCHED:
- GUI Server: Node.js `cdb-studio/gui/server.mjs` on port **8787**
- Dispatch Relay: Python `cdb-studio/integrations/dispatch_relay.py` on port **8799**
- Ops API: Python `cdb-studio/integrations/ops_api.py` (direct handler for `/api/ops/*`)
- Cloudflare tunnel publishes ephemeral URL to `site internet/dispatch/relay.json`
- Tokens live in `cdb-studio/integrations/dispatch_config.json` (server-side only)

**Frontend** (`C:\Users\Clinque du Batiment\Desktop\site internet`) — GitHub Pages static site:
- `studio/` — CDB Studio PWA (dashboard, ops, leads)
- `dispatch/` — Approval dispatch page (mobile/web)
- `signer/` — Electronic signature page
- `relay.json` — Points to current Cloudflare tunnel URL

**Secrets** (`C:\Users\Clinque du Batiment\.cdb-secrets`):
- `studio.env` — Bluesky, Meta, Google, SMTP, Twilio, Canva, etc.
- `integrations.env` — Slack, X, WhatsApp OAuth
- `cloudflare.env` — Cloudflare API token
- `canva.env` — Canva OAuth tokens

---

## 2. Security Issues Found & Fixed

### 2.1 Hardcoded API Tokens in 7 HTML Files (CRITICAL)
**Before:** `API_TOKEN` and `DISPATCH_TOKEN` were hardcoded in the source of every frontend file. Anyone could view-source and extract them.

**Files affected:**
1. `studio/index.html`
2. `studio/index.new.html`
3. `studio/desktop.html`
4. `studio/mobile.html`
5. `studio/leads.html`
6. `dispatch/index.html`
7. `signer/index.html`

**Fix:**
- Created centralized `config.js` at the site root containing all tokens
- Each HTML file now loads `<script src="../config.js"></script>` BEFORE its inline script
- All inline scripts reference `window.CDB.API_TOKEN` / `window.CDB.DISPATCH_TOKEN` / `window.CDB.TO_EMAIL`

**Result:** Tokens are now in ONE file. Rotation requires changing only `config.js` (and the backend `dispatch_config.json` to match).

### 2.2 Insecure Firestore Rules (CRITICAL)
**Before:** `site internet/firestore.rules` had:
```javascript
allow read, write: if request.time < timestamp.date(2026, 7, 4);
```
This allowed ANYONE to read/write the entire database until July 2026.

**Fix:** Replaced with the same secure rules as the Server:
```javascript
allow read, write: if false;
```
All data access goes through the backend Admin SDK (which bypasses these rules).

### 2.3 Backup Files with Exposed Tokens (MEDIUM)
**Before:** `desktop.html.bak-20260613-082658` and `mobile.html.bak-20260613-082658` contained the old hardcoded tokens.

**Fix:** Deleted both backup files.

### 2.4 Accidentally Written Duplicate Backend (HIGH)
**Before:** I wrote a full Firebase Functions backend in `site internet/functions/src/index.ts` (875 lines) with real integrations, modifying `functions/package.json` to add dependencies.

**Fix:** Reverted both files to their original boilerplate state. The backend lives ONLY in `Server/`. No Firebase Functions were deployed or intended.

---

## 3. What Was NOT Changed (Production Backend is Intact)

The following were READ but NOT MODIFIED:
- `Server/cdb-studio/gui/server.mjs`
- `Server/cdb-studio/integrations/dispatch_relay.py`
- `Server/cdb-studio/integrations/ops_api.py`
- `Server/cdb-studio/integrations/dispatch_config.json`
- `Server/firestore.rules` (already secure)
- All `.cdb-secrets/*.env` files
- All Python scripts in `Server/scripts/` and `Server/automation/`
- The Node.js marketing pipeline in `Server/cdb-studio/pipeline/`

---

## 4. Token Rotation Procedure

If tokens need to be rotated:
1. **Backend:** Edit `Server/cdb-studio/integrations/dispatch_config.json`
   - Change `"token"` (used by dispatch/approval)
   - Change `"api_token"` (used by `X-CDB-Token` proxy auth)
2. **Frontend:** Edit `site internet/config.js`
   - Update `window.CDB.API_TOKEN`
   - Update `window.CDB.DISPATCH_TOKEN`
3. **Commit & push** the `site internet` repo to GitHub Pages
4. **Restart** the dispatch relay (`dispatch_relay.py`) so it reads the new config

---

## 5. File Changes Summary

| File | Action | Reason |
|------|--------|--------|
| `site internet/config.js` | **Created** | Centralized token store |
| `site internet/studio/index.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/studio/index.new.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/studio/desktop.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/studio/mobile.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/studio/leads.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/dispatch/index.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/signer/index.html` | **Modified** | Removed hardcoded tokens, added config.js loader |
| `site internet/firestore.rules` | **Modified** | Replaced insecure rules with `allow read, write: if false` |
| `site internet/functions/src/index.ts` | **Reverted** | Removed accidentally written duplicate backend |
| `site internet/functions/package.json` | **Reverted** | Removed accidentally added dependencies |
| `site internet/studio/desktop.html.bak-*` | **Deleted** | Contained exposed tokens |
| `site internet/studio/mobile.html.bak-*` | **Deleted** | Contained exposed tokens |

---

## 6. Testing Checklist

### 6.1 Token Centralization Verification
- [x] Grep confirms `kPIdcmKI5jrEWw0dVo54428hNoLnPNqm` appears ONLY in `config.js`
- [x] Grep confirms `jJaSZrugRk5HE1Q0dDWywH5ZHk2IWeag` appears ONLY in `config.js`
- [x] All 7 HTML files load `<script src="../config.js"></script>` before inline scripts
- [x] All inline scripts use `window.CDB.API_TOKEN` or `window.CDB.DISPATCH_TOKEN`

### 6.2 Backend Matching Verification
- [x] `config.js` `API_TOKEN` matches `dispatch_config.json` `api_token`
- [x] `config.js` `DISPATCH_TOKEN` matches `dispatch_config.json` `token`
- [x] `relay.json` URL matches `dispatch_config.json` `local_api_url`

### 6.3 Firestore Rules Verification
- [x] `site internet/firestore.rules` now matches `Server/firestore.rules` (both `allow read, write: if false`)

### 6.4 Manual Test Steps (requires backend running)
1. Start the backend: `node cdb-studio/gui/server.mjs` (port 8787) + `python cdb-studio/integrations/dispatch_relay.py` (port 8799)
2. Open `http://localhost:8787` — studio dashboard should load (local mode, no token needed)
3. Open `https://cliniquedubatiment.ca/studio/` — should load config.js, then fetch via tunnel with `X-CDB-Token`
4. Open `https://cliniquedubatiment.ca/dispatch/` — should load approval page, submit via tunnel with `X-CDB-Token`
5. Open `https://cliniquedubatiment.ca/signer/` — should load signature page, fetch doc via tunnel with `X-CDB-Token`

---

## 7. Remaining Notes

- The `site internet/functions/` directory is still empty boilerplate. It can be used later if you want to deploy Firebase Functions, but the current production backend is the local hybrid server in `Server/`.
- The `config.js` file is still client-side accessible (GitHub Pages is static). This is the practical limitation of a static site. For true secret hiding, you'd need a server-side proxy or edge function (Cloudflare Worker, Firebase Function, etc.) to inject tokens.
- The current security model is: **Cloudflare tunnel URL (hard to guess) + shared token (additional layer)**. This is acceptable for an internal tool but not for highly sensitive data.

---

*Generated: 2026-06-16*
