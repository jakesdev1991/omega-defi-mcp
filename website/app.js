// Initialize Lucide Icons
lucide.createIcons();

// State Variables
let walletConnected = false;
let apiKeyGenerated = false;
let currentTier = "free"; // free, signal, premium
let realizedProfit = parseFloat(localStorage.getItem('omega_realized_profit')) || 46.50;
let txsAudited = parseInt(localStorage.getItem('omega_txs_audited')) || 142392;


let spreadsInterval = null;
let regimeInterval = null;
let logsInterval = null;
let profitInterval = null;
let throughputInterval = null;

const tokens = ["SOL", "USDC", "RAY", "BONK", "JUP", "ORCA", "WIF"];
const DEXs = ["Raydium", "Orca", "Meteora", "Phoenix", "OpenBook"];
const basePrices = {
  SOL: 146.25,
  USDC: 1.00,
  RAY: 1.84,
  BONK: 0.00002145,
  JUP: 0.852,
  ORCA: 3.12,
  WIF: 2.18
};

// Supported 17 chains list
const chainsList = [
  { name: "Solana", icon: "zap" },
  { name: "Ethereum", icon: "activity" },
  { name: "Arbitrum", icon: "layers" },
  { name: "Optimism", icon: "arrow-up-right" },
  { name: "Base", icon: "anchor" },
  { name: "Sui", icon: "wind" },
  { name: "Aptos", icon: "compass" },
  { name: "Cosmos Hub", icon: "orbit" },
  { name: "Osmosis", icon: "shuffle" },
  { name: "Celestia", icon: "shield" },
  { name: "dYdX", icon: "bar-chart-2" },
  { name: "Polygon", icon: "hexagon" },
  { name: "Avalanche", icon: "mountain" },
  { name: "BSC", icon: "grid" },
  { name: "Fantom", icon: "ghost" },
  { name: "Near", icon: "hash" },
  { name: "Thorchain", icon: "hammer" }
];

// --- DOM ELEMENTS ---
const connectWalletBtn = document.getElementById("connect-wallet-btn");
const walletBtnText = document.getElementById("wallet-btn-text");
const getApiKeyBtn = document.getElementById("get-api-key-btn");
const spreadsOverlay = document.getElementById("spreads-overlay");
const spreadsTbody = document.getElementById("spreads-tbody");
const rcodRegimeValue = document.getElementById("rcod-regime-value");
const dissonanceFill = document.getElementById("dissonance-fill");
const dissonanceVal = document.getElementById("dissonance-val");
const rcodRegimeDesc = document.getElementById("rcod-regime-desc");
const consoleLogs = document.getElementById("console-logs");
const calculateRouteBtn = document.getElementById("calculate-route-btn");
const visPlaceholder = document.getElementById("vis-placeholder");
const visFlow = document.getElementById("vis-flow");
const routeInput = document.getElementById("route-input");
const routeTarget = document.getElementById("route-target");
const routeAmount = document.getElementById("route-amount");
const networkGrid = document.getElementById("network-grid");

// New Dynamic Elements
const headerBankroll = document.getElementById("header-bankroll");
const shredsThroughput = document.getElementById("shreds-throughput");
const txsAuditedEl = document.getElementById("txs-audited");
const routingOverlay = document.getElementById("routing-overlay");
const optPlaygroundRoutes = document.getElementById("opt-playground-routes");
const chainsOnlineBadge = document.getElementById("chains-online-badge");

// Modals
const walletModal = document.getElementById("wallet-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const walletOptions = document.querySelectorAll(".wallet-option");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = document.getElementById("close-checkout-btn");
const checkoutPlanName = document.getElementById("checkout-plan-name");
const checkoutPlanPrice = document.getElementById("checkout-plan-price");
const txHashInput = document.getElementById("tx-hash-input");
const simulatePaymentBtn = document.getElementById("simulate-payment-btn");
const verifyPaymentBtn = document.getElementById("verify-payment-btn");
const copyWalletBtn = document.getElementById("copy-wallet-btn");

// Playground Elements
const apiSelect = document.getElementById("api-select");
const sendRequestBtn = document.getElementById("send-request-btn");
const responseStatus = document.getElementById("response-status");
const jsonCodeBox = document.getElementById("json-code-box");

// --- CANVAS BACKGROUND NODE ANIMATION ---
const canvas = document.getElementById("node-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
    ctx.fill();
  }
}

function initCanvas() {
  resizeCanvas();
  particles = [];
  const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
  window.addEventListener("resize", resizeCanvas);
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCanvas);
}

// --- GENERATE 17 CHAINS IN GRID ---
function renderNetworkRegistry() {
  networkGrid.innerHTML = "";
  chainsList.forEach(c => {
    const item = document.createElement("div");
    item.className = "network-item";
    
    const latency = Math.floor(Math.random() * 45) + 38;
    
    item.innerHTML = `
      <div class="ping-indicator"></div>
      <i data-lucide="${c.icon}" class="network-icon text-secondary"></i>
      <span class="network-name">${c.name}</span>
      <span class="network-latency">${latency}ms</span>
    `;
    networkGrid.appendChild(item);
  });
  lucide.createIcons();
}

function startNetworkPings() {
  setInterval(() => {
    const items = networkGrid.querySelectorAll(".network-item");
    if (items.length === 0) return;
    
    const targetIdx = Math.floor(Math.random() * items.length);
    const latSpan = items[targetIdx].querySelector(".network-latency");
    if (latSpan) {
      const newLat = Math.floor(Math.random() * 45) + 38;
      latSpan.textContent = `${newLat}ms`;
    }
  }, 2000);
}

// --- TELEMETRY CLOCK RUNNERS ---
function startTelemetryClock() {
  // Initialize values immediately from loaded state
  headerBankroll.textContent = `$${realizedProfit.toFixed(4)}`;
  txsAuditedEl.textContent = txsAudited.toLocaleString();

  // 1. Shreds throughput fluctuations
  throughputInterval = setInterval(() => {
    const baseThroughput = 5200;
    const diff = Math.floor(Math.random() * 140) - 70;
    shredsThroughput.textContent = `${(baseThroughput + diff).toLocaleString()} S/s`;
  }, 1000);

  // 2. Realized profit ticking upwards
  profitInterval = setInterval(() => {
    // Arbitrary micro-yield ticker to show activity
    const inc = (Math.random() * 0.04).toFixed(4);
    realizedProfit += parseFloat(inc);
    localStorage.setItem('omega_realized_profit', realizedProfit);
    headerBankroll.textContent = `$${realizedProfit.toFixed(4)}`;
    
    // Transactions audited increments
    txsAudited += Math.random() > 0.6 ? 1 : 0;
    localStorage.setItem('omega_txs_audited', txsAudited);
    txsAuditedEl.textContent = txsAudited.toLocaleString();
  }, 1800);
}

// --- UTILITY: Log Telemetry ---
function addLogLine(text, type = "system") {
  const timestamp = new Date().toISOString().split("T")[1].slice(0, -1);
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  line.textContent = `[${timestamp}] ${text}`;
  consoleLogs.appendChild(line);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
  
  while (consoleLogs.children.length > 25) {
    consoleLogs.removeChild(consoleLogs.firstChild);
  }
}

// --- SIMULATED DATA GENERATOR: SPREADS ---
function generateLiveSpreads() {
  const rows = [];
  const count = 5;
  
  for (let i = 0; i < count; i++) {
    const asset = tokens[Math.floor(Math.random() * tokens.length)];
    const buyDex = DEXs[Math.floor(Math.random() * DEXs.length)];
    let sellDex = DEXs[Math.floor(Math.random() * DEXs.length)];
    while (buyDex === sellDex) {
      sellDex = DEXs[Math.floor(Math.random() * DEXs.length)];
    }
    
    const base = basePrices[asset];
    const diff = (Math.random() * 0.004) * base;
    const priceA = base - (Math.random() * 0.5 * diff);
    const priceB = priceA + diff;
    const bps = ((priceB - priceA) / priceA * 10000).toFixed(1);
    
    rows.push({
      asset,
      buyDex,
      sellDex,
      priceA: priceA.toFixed(asset === "BONK" ? 8 : 4),
      priceB: priceB.toFixed(asset === "BONK" ? 8 : 4),
      bps: parseFloat(bps)
    });
  }
  
  rows.sort((a, b) => b.bps - a.bps);
  spreadsTbody.innerHTML = "";
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.className = "new-row-flash";
    tr.innerHTML = `
      <td class="font-mono text-muted" style="font-size: 0.72rem;">${timestamp}</td>
      <td class="font-mono" style="font-weight:700; color:#fff;">${r.asset}</td>
      <td>
        <span class="text-secondary">${r.buyDex}</span>
        <div class="font-mono" style="font-size:0.72rem; color:#64748b;">$${r.priceA}</div>
      </td>
      <td>
        <span class="text-secondary">${r.sellDex}</span>
        <div class="font-mono" style="font-size:0.72rem; color:#64748b;">$${r.priceB}</div>
      </td>
      <td class="text-right font-mono text-emerald" style="font-weight:700; font-size: 0.85rem;">+${r.bps.toFixed(1)}</td>
    `;
    spreadsTbody.appendChild(tr);
  });
}

// --- SIMULATED DATA GENERATOR: REGIME ---
function updateRegime() {
  const dissonance = Math.random() * 0.12;
  dissonanceFill.style.width = `${(dissonance / 0.12) * 100}%`;
  dissonanceVal.textContent = dissonance.toFixed(6);
  
  let regime = "VACUUM";
  let desc = "Low volatility regime. Spreads are highly mean-reverting. Optimizer operating with standard thresholds.";
  let logType = "system";
  
  if (dissonance > 0.08) {
    regime = "PHASE TRANSITION";
    desc = "CRITICAL METRIC TRIGGER: Highly turbulent mempool activity detected. Arb frequency surging. Risk levels elevated.";
    logType = "warning";
  } else if (dissonance > 0.04) {
    regime = "PRE-SHOCK";
    desc = "SYSTEM ALERT: Rate-of-change dissonance building. Micro-structural liquidity shifts underway.";
    logType = "warning";
  }
  
  rcodRegimeValue.textContent = regime;
  rcodRegimeValue.className = `regime-value ${regime.toLowerCase().replace(" ", "-")}`;
  rcodRegimeDesc.textContent = desc;
  
  addLogLine(`RCOD state evaluated: ${regime} (Dissonance: ${dissonance.toFixed(4)})`, logType);
}

// --- MOCK ENGINE TELEMETRY FEED ---
function startTelemetryFeed() {
  if (logsInterval) clearInterval(logsInterval);
  
  logsInterval = setInterval(() => {
    const actions = [
      () => addLogLine(`SHRED_INGEST: Processed ${Math.floor(Math.random() * 2000) + 3000} shreds | Latency: ${Math.floor(Math.random() * 10) + 35}ms`),
      () => addLogLine(`Omega core services active. Latency monitor operational.`),
      () => addLogLine(`Scanned 16 triangular candidate paths in ${Math.random().toFixed(2)}ms`, "success"),
      () => addLogLine(`Memory mapped register validation successful.`),
      () => {
        if (walletConnected) {
          addLogLine(`MCP API Server request from client. Authorized tier: ${currentTier.toUpperCase()}.`, "success");
        }
      }
    ];
    
    actions[Math.floor(Math.random() * actions.length)]();
  }, 3000);
}

// ---// --- INTERACTIVE WALLET CONNECTION ---
function openWalletModal() {
  if (walletConnected) return;
  walletModal.classList.remove("hidden");
}

function closeWalletModal() {
  walletModal.classList.add("hidden");
}

async function connectWallet(walletType) {
  closeWalletModal();
  addLogLine(`Requesting connection via browser extension (${walletType})...`, "system");
  connectWalletBtn.disabled = true;
  walletBtnText.textContent = "Verifying...";
  
  try {
    let address = "";
    if (walletType === "phantom") {
      if (typeof window.solana !== "undefined" && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        address = resp.publicKey.toString();
      } else {
        throw new Error("Phantom extension not detected in this browser.");
      }
    } else if (walletType === "solflare") {
      if (typeof window.solflare !== "undefined") {
        await window.solflare.connect();
        address = window.solflare.publicKey.toString();
      } else {
        throw new Error("Solflare extension not detected in this browser.");
      }
    } else if (walletType === "metamask") {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
      } else {
        throw new Error("MetaMask extension not detected in this browser.");
      }
    }
    
    // Success State
    walletConnected = true;
    connectWalletBtn.disabled = false;
    connectWalletBtn.className = "btn btn-secondary";
    
    const displayAddr = `${address.slice(0, 4)}...${address.slice(-4)}`;
    walletBtnText.textContent = `Linked: ${displayAddr}`;
    getApiKeyBtn.removeAttribute("disabled");
    
    // Unlock spreads stream
    spreadsOverlay.classList.add("hidden");
    generateLiveSpreads();
    spreadsInterval = setInterval(generateLiveSpreads, 4000);
    
    addLogLine(`Identity verification successful via ${walletType}. Address: ${address}`, "success");
    addLogLine("Free tier live metrics stream authorized.", "success");
    
  } catch (err) {
    addLogLine(`Wallet connection failed: ${err.message}`, "warning");
    connectWalletBtn.disabled = false;
    walletBtnText.textContent = "Connect Web3 Wallet";
    
    const useSim = confirm(`${err.message}\n\nWould you like to run in simulation mode instead?`);
    if (useSim) {
      runSimulatedConnection(walletType);
    }
  }
}

function runSimulatedConnection(walletType) {
  addLogLine(`Running simulated connection for ${walletType}...`, "system");
  connectWalletBtn.disabled = true;
  walletBtnText.textContent = "Verifying...";
  
  setTimeout(() => {
    walletConnected = true;
    connectWalletBtn.disabled = false;
    connectWalletBtn.className = "btn btn-secondary";
    
    const displayAddr = walletType === "metamask" ? "0x3fA9...d88C" : "JAJj...GSKJx";
    walletBtnText.textContent = `Linked: ${displayAddr}`;
    getApiKeyBtn.removeAttribute("disabled");
    
    spreadsOverlay.classList.add("hidden");
    generateLiveSpreads();
    spreadsInterval = setInterval(generateLiveSpreads, 4000);
    
    addLogLine(`Identity verification successful (Simulation). Address: ${displayAddr}`, "success");
    addLogLine("Free tier live metrics stream authorized.", "success");
  }, 1000);
}

// --- GENERATE MOCK API KEY ---
function generateApiKey() {
  if (apiKeyGenerated) return;
  
  addLogLine("Registering client signature on-chain...", "system");
  getApiKeyBtn.disabled = true;
  
  setTimeout(() => {
    apiKeyGenerated = true;
    const randomHex = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join("");
    const key = `omega_${currentTier}_${randomHex}`;
    
    getApiKeyBtn.className = "btn btn-secondary";
    getApiKeyBtn.innerHTML = `
      <i data-lucide="check" class="btn-icon text-emerald"></i>
      <span style="font-family:'JetBrains Mono', monospace; font-size: 0.72rem;">${key.slice(0, 16)}...</span>
    `;
    lucide.createIcons();
    
    addLogLine(`API Key generated and stored: ${key}`, "success");
    alert(`Successfully generated API Key for ${currentTier.toUpperCase()} tier:\n\n${key}\n\nAdd this to your environment as OMEGA_API_KEY to authenticate tools.`);
  }, 1000);
}

// --- PATHFINDER SIMULATION ---
function runPathfinder() {
  const inAsset = routeInput.value;
  const outAsset = routeTarget.value;
  const amount = parseFloat(routeAmount.value) || 1000;
  
  if (inAsset === outAsset) {
    alert("Please select different input and output assets.");
    return;
  }
  
  addLogLine(`Pathfinder request received: ${amount} ${inAsset} -> ${outAsset}`, "system");
  calculateRouteBtn.disabled = true;
  visPlaceholder.classList.add("hidden");
  visFlow.classList.add("hidden");
  
  const loader = document.createElement("div");
  loader.className = "vis-placeholder";
  loader.id = "vis-loader";
  loader.innerHTML = `
    <i data-lucide="loader-2" class="large-icon animate-spin"></i>
    <p>Solving multi-hop route matrices & pre-flighting bridge routes...</p>
  `;
  visPlaceholder.parentNode.appendChild(loader);
  lucide.createIcons();
  
  setTimeout(() => {
    const l = document.getElementById("vis-loader");
    if (l) l.remove();
    
    calculateRouteBtn.disabled = false;
    visFlow.classList.remove("hidden");
    
    const steps = visFlow.getElementsByClassName("flow-step");
    steps[0].querySelector(".step-asset:first-child").textContent = inAsset;
    steps[3].querySelector(".step-asset:last-child").textContent = outAsset;
    
    const pct = (0.15 + Math.random() * 0.15).toFixed(4);
    const residual = (0.95 + Math.random() * 0.049).toFixed(6);
    const latency = (3 + Math.random() * 2.5).toFixed(1);
    
    document.getElementById("residual-confidence").textContent = residual;
    document.getElementById("route-latency").textContent = `${latency} seconds`;
    document.getElementById("net-yield").textContent = `+${(pct * 100).toFixed(1)} bps`;
    
    addLogLine(`Optimized route discovered. Yield: +${(pct * 100).toFixed(1)} bps | Viability index: ${residual}`, "success");
  }, 1500);
}

// --- SUBSCRIPTION CHECKOUT HANDLERS ---
let selectedCheckoutPlan = "signal";

function openCheckoutModal(plan) {
  if (!walletConnected) {
    alert("Please connect your Web3 wallet in the header first to settle L2 subscriptions.");
    openWalletModal();
    return;
  }
  
  selectedCheckoutPlan = plan;
  checkoutPlanName.textContent = plan === "signal" ? "Signal Pro" : "Alpha Premium";
  checkoutPlanPrice.textContent = plan === "signal" ? "$99.00 USDC / mo" : "$499.00 USDC / mo";
  txHashInput.value = "";
  
  checkoutModal.classList.remove("hidden");
}

function closeCheckoutModal() {
  checkoutModal.classList.add("hidden");
}

function simulatePayment() {
  const randomHex = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join("");
  txHashInput.value = `0x${randomHex}`;
  addLogLine(`Checkout: simulated payment signature generated.`, "system");
}

function verifyPayment() {
  const txHash = txHashInput.value.trim();
  if (!txHash) {
    alert("Please enter or simulate a Base transaction hash before verifying.");
    return;
  }
  
  verifyPaymentBtn.disabled = true;
  verifyPaymentBtn.textContent = "Verifying...";
  addLogLine(`Checkout: auditing Base transaction hash: ${txHash}...`, "system");
  
  setTimeout(() => {
    verifyPaymentBtn.disabled = false;
    verifyPaymentBtn.textContent = "Verify Payment";
    closeCheckoutModal();
    
    currentTier = selectedCheckoutPlan;
    
    // Apply Tier Unlocks
    if (currentTier === "signal") {
      addLogLine("Payment verified! Signal Pro Plan Activated.", "success");
      document.getElementById("card-tier-free").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
      document.getElementById("card-tier-free").querySelector("button").textContent = "Downgrade";
      document.getElementById("card-tier-signal").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
      document.getElementById("card-tier-signal").querySelector("button").textContent = "Active Plan";
      
      // Upgrade free key displayed if generated
      if (apiKeyGenerated) {
        apiKeyGenerated = false; // Reset to force regenerations
        generateApiKey();
      }
    } else if (currentTier === "premium") {
      addLogLine("Payment verified! Alpha Premium Plan Activated.", "success");
      document.getElementById("card-tier-signal").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
      document.getElementById("card-tier-signal").querySelector("button").textContent = "Select Plan";
      document.getElementById("card-tier-premium").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
      document.getElementById("card-tier-premium").querySelector("button").textContent = "Active Plan";
      
      // Unlock premium pathfinder overlay
      routingOverlay.classList.add("hidden");
      optPlaygroundRoutes.removeAttribute("disabled");
      
      if (apiKeyGenerated) {
        apiKeyGenerated = false;
        generateApiKey();
      }
    }
    
    alert(`Success! Payment Verified.\n\nYour subscription tier is now: ${currentTier.toUpperCase()}.\nAll associated tools and keys have been upgraded.`);
  }, 1600);
}

// --- API PLAYGROUND HANDLER ---
function executePlaygroundRequest() {
  const endpoint = apiSelect.value;
  responseStatus.textContent = "pending";
  responseStatus.className = "badge badge-amber";
  
  addLogLine(`API Sandbox: executing ${endpoint}...`, "system");
  
  setTimeout(() => {
    responseStatus.textContent = "200 OK";
    responseStatus.className = "badge badge-emerald";
    
    let mockResponse = {};
    
    if (endpoint === "/spreads") {
      mockResponse = {
        success: true,
        chain: "solana",
        timestamp: Date.now(),
        data: [
          { asset: "SOL", buy: "Raydium", sell: "Orca", price_buy: 145.892, price_sell: 146.128, spread_bps: 16.2 },
          { asset: "WIF", buy: "Orca", sell: "Meteora", price_buy: 2.14, price_sell: 2.162, spread_bps: 10.3 }
        ]
      };
    } else if (endpoint === "/routes") {
      mockResponse = {
        success: true,
        input_token: "SOL",
        amount_usd: 1000.0,
        optimal_route: {
          hops: ["SOL (Raydium) -> USDC", "USDC (Wormhole) -> USDC (Arbitrum)", "USDC (Uniswap) -> WETH", "WETH (Across) -> SOL"],
          net_profit_bps: 19.8,
          viability_index: 0.9841,
          latency_seconds: 4.2
        }
      };
    } else if (endpoint === "/regime") {
      mockResponse = {
        success: true,
        chain: "solana",
        current_state: rcodRegimeValue.textContent,
        swarm_dissonance: parseFloat(dissonanceVal.textContent),
        timestamp: Date.now()
      };
    } else if (endpoint === "/status") {
      mockResponse = {
        success: true,
        server: "Omega Protocol DeFi Intelligence",
        version: "1.0.0",
        uptime: `${txsAudited * 2} seconds`,
        acceleration: "active (Hardware Optimized)",
        client_tier: walletConnected ? `${currentTier.toUpperCase()}_DEVELOPER` : "ANONYMOUS"
      };
    } else if (endpoint === "/memory") {
      mockResponse = {
        success: true,
        action: "STORE",
        agent: "Smith_01",
        content: "Solana volatility regimes shifted from VACUUM to PRE-SHOCK.",
        status: "COMMITTED_LTM_SUBSTRATE",
        qdrant_storage: "./qdrant_storage"
      };
    }
    
    jsonCodeBox.textContent = JSON.stringify(mockResponse, null, 2);
    addLogLine(`API Sandbox: request completed with status 200 OK`, "success");
  }, 800);
}

// --- QUICKSTART TABS ---
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    document.querySelector(".tab-pane.active").classList.remove("active");
    
    btn.classList.add("active");
    const target = btn.getAttribute("data-tab");
    document.getElementById(target).classList.add("active");
  });
});

// --- INITIALIZE DASHBOARD ---
function init() {
  initCanvas();
  animateCanvas();
  
  renderNetworkRegistry();
  startNetworkPings();
  startTelemetryClock();
  
  updateRegime();
  regimeInterval = setInterval(updateRegime, 8000);
  startTelemetryFeed();
  
  // Event Listeners
  connectWalletBtn.addEventListener("click", openWalletModal);
  closeModalBtn.addEventListener("click", closeWalletModal);
  getApiKeyBtn.addEventListener("click", generateApiKey);
  calculateRouteBtn.addEventListener("click", runPathfinder);
  sendRequestBtn.addEventListener("click", executePlaygroundRequest);
  
  // Subscription triggers
  document.querySelectorAll(".select-tier-btn").forEach(el => {
    el.addEventListener("click", () => {
      const tier = el.getAttribute("data-tier");
      if (tier === "free") {
        if (currentTier !== "free") {
          currentTier = "free";
          addLogLine("Subscription downgraded to FREE tier.", "warning");
          // Re-lock premiums
          routingOverlay.classList.remove("hidden");
          optPlaygroundRoutes.setAttribute("disabled", "true");
          
          document.getElementById("card-tier-free").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
          document.getElementById("card-tier-free").querySelector("button").textContent = "Active Plan";
          document.getElementById("card-tier-signal").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
          document.getElementById("card-tier-signal").querySelector("button").textContent = "Upgrade to Pro";
          document.getElementById("card-tier-premium").querySelector("button").className = "btn btn-secondary btn-block mt-4 select-tier-btn";
          document.getElementById("card-tier-premium").querySelector("button").textContent = "Upgrade to Premium";
          
          if (apiKeyGenerated) {
            apiKeyGenerated = false;
            generateApiKey();
          }
        }
      } else {
        openCheckoutModal(tier);
      }
    });
  });
  
  document.querySelector(".upgrade-premium-trigger").addEventListener("click", () => {
    openCheckoutModal("premium");
  });
  
  // Modal wallet choice
  walletOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const walletType = opt.getAttribute("data-wallet");
      connectWallet(walletType);
    });
  });
  
  document.querySelectorAll(".trigger-wallet-connect").forEach(el => {
    el.addEventListener("click", openWalletModal);
  });
  
  // Checkout actions
  closeCheckoutBtn.addEventListener("click", closeCheckoutModal);
  simulatePaymentBtn.addEventListener("click", simulatePayment);
  verifyPaymentBtn.addEventListener("click", verifyPayment);
  
  copyWalletBtn.addEventListener("click", () => {
    navigator.clipboard.writeText("0x53460A8C9E4574931a98075306917E96985C1C83");
    addLogLine("Checkout: wallet address copied to clipboard.", "success");
    alert("Base wallet address copied to clipboard!");
  });
  
  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === walletModal) closeWalletModal();
    if (e.target === checkoutModal) closeCheckoutModal();
  });
}

// Start
init();
