import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Blocks, TrendingUp, Cpu, Award, Wallet, ArrowRightLeft, Database, Terminal, CheckCircle, Lock } from 'lucide-react';
import useSubscriptionStore, { SubscriptionTier } from '../../store/subscriptionStore';
import { SubscriptionUpgradeModal } from '../../components/Shared/SubscriptionUpgradeModal';

const mockTokens = [
  { name: 'Bitcoin', symbol: 'BTC', price: 67240, change: 2.4, color: '#f7931a' },
  { name: 'Ethereum', symbol: 'ETH', price: 3480, change: -1.2, color: '#627eea' },
  { name: 'Technova Gas', symbol: 'TNV', price: 1.25, change: 12.8, color: '#8b5cf6' },
  { name: 'Heart Token', symbol: 'HEART', price: 0.85, change: 8.3, color: '#e02840' }
];

const solidityTemplates = {
  erc20: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CustomizedToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) 
        Ownable(msg.sender) 
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`,
  staking: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingVault {
    IERC20 public stakingToken;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakingTimestamp;

    constructor(address _token) {
        stakingToken = IERC20(_token);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
    }
}`
};

export const BlockchainHome: React.FC = () => {
  const { tier } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<'academy' | 'trading' | 'forge' | 'contracts'>('academy');
  
  // Subscription state
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [neededTier, setNeededTier] = useState<SubscriptionTier>('pro');
  const [targetFeature, setTargetFeature] = useState('');

  // Demo Trading State
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<Record<string, number>>({ BTC: 0, ETH: 0, TNV: 0, HEART: 0 });
  const [prices, setPrices] = useState(mockTokens);
  const [tradeLogs, setTradeLogs] = useState<string[]>(['Wallet initialized with $10,000.00 USD.']);
  const [selectedToken, setSelectedToken] = useState('BTC');
  const [tradeAmount, setTradeAmount] = useState('0.1');

  // Token Forge State
  const [tokenName, setTokenName] = useState('Heartcode Elite');
  const [tokenSymbol, setTokenSymbol] = useState('HCE');
  const [tokenSupply, setTokenSupply] = useState('1000000');
  const [forgedTokens, setForgedTokens] = useState<any[]>([]);
  const [isForging, setIsForging] = useState(false);

  // Contract Lab State
  const [selectedContract, setSelectedContract] = useState<'erc20' | 'staking'>('erc20');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Price Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setPrices(prev => prev.map(t => {
        const volatility = t.symbol === 'BTC' ? 80 : t.symbol === 'ETH' ? 6 : 0.02;
        const drift = (Math.random() - 0.49) * volatility;
        const newPrice = Math.max(0.01, t.price + drift);
        const change = ((newPrice - (t.price - drift)) / t.price) * 100;
        return { ...t, price: Number(newPrice.toFixed(2)), change: Number(change.toFixed(2)) };
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleBuy = () => {
    const amt = parseFloat(tradeAmount);
    if (isNaN(amt) || amt <= 0) return;
    const token = prices.find(t => t.symbol === selectedToken);
    if (!token) return;
    const cost = amt * token.price;
    if (cost > balance) {
      setTradeLogs(prev => [`Error: Insufficient balance to buy ${amt} ${selectedToken} (Cost: $${cost.toLocaleString()})`, ...prev]);
      return;
    }
    setBalance(prev => prev - cost);
    setPortfolio(prev => ({ ...prev, [selectedToken]: (prev[selectedToken] || 0) + amt }));
    setTradeLogs(prev => [`Bought ${amt} ${selectedToken} at $${token.price.toLocaleString()} per unit (Total: $${cost.toLocaleString()})`, ...prev]);
  };

  const handleSell = () => {
    const amt = parseFloat(tradeAmount);
    if (isNaN(amt) || amt <= 0) return;
    const owned = portfolio[selectedToken] || 0;
    if (amt > owned) {
      setTradeLogs(prev => [`Error: Insufficient asset quantity to sell ${amt} ${selectedToken} (Owned: ${owned})`, ...prev]);
      return;
    }
    const token = prices.find(t => t.symbol === selectedToken);
    if (!token) return;
    const payout = amt * token.price;
    setBalance(prev => prev + payout);
    setPortfolio(prev => ({ ...prev, [selectedToken]: owned - amt }));
    setTradeLogs(prev => [`Sold ${amt} ${selectedToken} at $${token.price.toLocaleString()} per unit (Total: $${payout.toLocaleString()})`, ...prev]);
  };

  const handleForgeToken = () => {
    if (!tokenName || !tokenSymbol || !tokenSupply) return;
    setIsForging(true);
    setTimeout(() => {
      const newToken = {
        name: tokenName,
        symbol: tokenSymbol.toUpperCase(),
        supply: parseInt(tokenSupply).toLocaleString(),
        address: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        date: new Date().toLocaleDateString()
      };
      setForgedTokens(prev => [newToken, ...prev]);
      setIsForging(false);
      setTradeLogs(prev => [`Forged token ${newToken.name} (${newToken.symbol}) deployed to Virtual Sandbox at ${newToken.address}`, ...prev]);
    }, 1500);
  };

  const handleSimulateContract = () => {
    setIsSimulating(true);
    setSimulationLog(['[COMPILER] Launching Solidity Compiler v0.8.20...', '[COMPILER] Analyzing AST rules...']);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '[COMPILER] Code compilation successful.', '[BLOCKCHAIN] Broadcasting deployment transaction...']);
    }, 800);
    setTimeout(() => {
      setSimulationLog(prev => [...prev, '[LEDGER] Deploy transaction verified. Block #1982736.', `[LEDGER] Contract deployed at: 0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`, '✓ SIMULATION SUCCESSFUL']);
      setIsSimulating(false);
    }, 2000);
  };

  const handleTabClick = (tabId: 'academy' | 'trading' | 'forge' | 'contracts', required: SubscriptionTier, featureName: string) => {
    if (tier === 'free' && required !== 'free') {
      setNeededTier(required);
      setTargetFeature(featureName);
      setUpgradeOpen(true);
      return;
    }
    if (tier === 'pro' && required === 'premium') {
      setNeededTier('premium');
      setTargetFeature(featureName);
      setUpgradeOpen(true);
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e8e2e2] flex flex-col font-sans">
      <Header />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* Banner */}
        <section className="mb-8 bg-gradient-to-r from-[#f7931a]/10 to-[#8b5cf6]/10 border border-[#f7931a]/30 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#f7931a]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#f7931a] to-[#ffb347] rounded-xl flex items-center justify-center shadow-lg">
              <Blocks size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-display" style={{ fontFamily: "'Outfit', sans-serif" }}>BLOCKCHAINVERSE</h1>
              <p className="text-xs text-[#6e6868] font-mono tracking-wider">SECURE DIGITAL LEDGER ENGINE</p>
            </div>
          </div>
          <p className="text-sm text-[#8a8080] max-w-2xl leading-relaxed">
            Welcome to the Blockchain Sandbox & Academy. Learn the mechanisms of Web3, run paper trading simulations on live market data, forge your own smart contracts, and deploy simulated tokens.
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2a2a2e] mb-6 gap-1 overflow-x-auto">
          {[
            { id: 'academy' as const, name: 'Crypto Academy', icon: Award, tier: 'free' as const },
            { id: 'trading' as const, name: 'Demo Trading', icon: TrendingUp, tier: 'pro' as const },
            { id: 'forge' as const, name: 'Token Forge', icon: Wallet, tier: 'pro' as const },
            { id: 'contracts' as const, name: 'Contract Lab', icon: Cpu, tier: 'premium' as const }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isLocked = (tier === 'free' && tab.tier !== 'free') || (tier === 'pro' && tab.tier === 'premium');
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.tier, tab.name)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive ? 'border-[#f7931a] text-white bg-white/2' : 'border-transparent text-[#6e6868] hover:text-white'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#f7931a]' : ''} />
                {tab.name}
                {isLocked && <Lock size={10} className="text-[#6e6868]" />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {/* TAB 1: ACADEMY */}
          {activeTab === 'academy' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Module 1: Blockchain Basics',
                  level: 'Beginner',
                  desc: 'Understand hashes, cryptography, peer-to-peer architecture, and the double-spending problem.',
                  points: ['Satoshi Nakamoto & Whitepaper', 'Blocks and Consensus Mechanics', 'Proof of Work vs Proof of Stake']
                },
                {
                  title: 'Module 2: Smart Contract Dev',
                  level: 'Intermediate',
                  desc: 'Learn Solidity basics, state variables, visibility modifiers, mapping, and transfer logs.',
                  points: ['Solidity Grammar & Types', 'State Mutability & Functions', 'ERC-20 & ERC-721 Standards']
                },
                {
                  title: 'Module 3: Decentralised Finance',
                  level: 'Advanced',
                  desc: 'Deep dive into liquidity pools, automated market makers (AMMs), staking yields, and flash loans.',
                  points: ['Liquidity Mining & Yields', 'DeFi Governance Models', 'Flash Loan Attack Vectors']
                }
              ].map((m, idx) => (
                <div key={idx} className="bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl hover:border-[#f7931a]/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[0.62rem] font-mono text-[#f7931a] border border-[#f7931a]/30 px-2 py-0.5 rounded bg-[#f7931a]/5 uppercase tracking-wider">
                      {m.level}
                    </span>
                    <span className="text-xs text-[#6e6868] font-semibold">{idx * 25 + 25} XP</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-[#8a8080] mb-4 leading-relaxed">{m.desc}</p>
                  <ul className="text-xs space-y-2 text-[#b0a8a8]">
                    {m.points.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f7931a]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full py-2 bg-[#f7931a]/10 hover:bg-[#f7931a] text-[#f7931a] hover:text-white border border-[#f7931a]/30 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer">
                    Start Learning
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: DEMO TRADING */}
          {activeTab === 'trading' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Asset Prices */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Database size={16} className="text-[#f7931a]" /> Real-Time Paper Sandbox Tickers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {prices.map(token => (
                      <div key={token.symbol} className="bg-[#0c0c0e] border border-[#222226] p-4 rounded-lg flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: token.color }} />
                            <h4 className="font-bold text-white text-sm">{token.name}</h4>
                          </div>
                          <span className="text-[0.68rem] font-mono text-[#6e6868]">{token.symbol}/USD</span>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold text-white">${token.price.toLocaleString()}</div>
                          <span className={`text-[0.68rem] font-mono ${token.change >= 0 ? 'text-[#2ea86a]' : 'text-[#e02840]'}`}>
                            {token.change >= 0 ? '+' : ''}{token.change}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ledger Terminal logs */}
                <div className="bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Terminal size={16} className="text-[#f7931a]" /> Transaction Audit Log
                  </h3>
                  <div className="bg-[#0a0a0b] p-3 rounded-lg border border-[#222226] font-mono text-[0.7rem] text-[#8a8080] h-48 overflow-y-auto space-y-1.5">
                    {tradeLogs.map((log, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-[#6e6868] select-none">&gt;</span>
                        <span className={log.startsWith('Error') ? 'text-[#e02840]' : log.startsWith('Bought') || log.startsWith('Sold') ? 'text-[#2ea86a]' : ''}>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order execution form */}
              <div className="space-y-4">
                <div className="bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Wallet size={16} className="text-[#f7931a]" /> Portfolio Balance
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="bg-[#0c0c0e] p-4 rounded-lg text-center border border-[#222226]">
                      <span className="text-[0.62rem] font-mono text-[#6e6868] uppercase tracking-wider block">USD Balance</span>
                      <span className="text-xl font-bold font-mono text-[#2ea86a]">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#b0a8a8]">
                      {Object.entries(portfolio).map(([sym, qty]) => (
                        <div key={sym} className="bg-[#0c0c0e] p-2 rounded border border-[#222226] flex justify-between">
                          <span className="font-semibold text-white">{sym}</span>
                          <span className="font-mono">{qty.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase text-[#6e6868] tracking-wider mb-2">Execute Order</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        value={selectedToken}
                        onChange={(e) => setSelectedToken(e.target.value)}
                        className="flex-1 bg-[#0c0c0e] border border-[#2a2a2e] text-white p-2.5 rounded-lg text-xs outline-none focus:border-[#f7931a]"
                      >
                        {prices.map(t => (
                          <option key={t.symbol} value={t.symbol}>{t.name} ({t.symbol})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-24 bg-[#0c0c0e] border border-[#2a2a2e] text-white p-2.5 rounded-lg text-xs outline-none focus:border-[#f7931a]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleBuy}
                        className="w-full py-2.5 bg-[#2ea86a] hover:bg-[#2ea86a]/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Buy (Long)
                      </button>
                      <button
                        onClick={handleSell}
                        className="w-full py-2.5 bg-[#e02840] hover:bg-[#e02840]/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Sell (Short)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOKEN FORGE */}
          {activeTab === 'forge' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Creator Form */}
              <div className="lg:col-span-1 bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl h-fit">
                <h3 className="text-sm font-semibold mb-4">Forge Custom Asset</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[0.62rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-1">Token Name</label>
                    <input
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g. Heartcode Premium"
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-white p-2.5 rounded-lg text-xs outline-none focus:border-[#f7931a]"
                    />
                  </div>
                  <div>
                    <label className="text-[0.62rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-1">Token Symbol</label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      placeholder="e.g. HCP"
                      maxLength={5}
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-white p-2.5 rounded-lg text-xs outline-none focus:border-[#f7931a]"
                    />
                  </div>
                  <div>
                    <label className="text-[0.62rem] font-mono text-[#6e6868] uppercase tracking-wider block mb-1">Initial Supply</label>
                    <input
                      type="number"
                      value={tokenSupply}
                      onChange={(e) => setTokenSupply(e.target.value)}
                      placeholder="1,000,000"
                      className="w-full bg-[#0c0c0e] border border-[#2a2a2e] text-white p-2.5 rounded-lg text-xs outline-none focus:border-[#f7931a]"
                    />
                  </div>
                  <button
                    onClick={handleForgeToken}
                    disabled={isForging}
                    className="w-full py-3 bg-[#f7931a] hover:bg-[#f7931a]/95 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isForging ? 'MINTING ASSETS...' : 'FORGE TOKEN'}
                  </button>
                </div>
              </div>

              {/* Created Assets Display */}
              <div className="lg:col-span-2 bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-4">Simulated Deployed Contracts</h3>
                  {forgedTokens.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-[#0c0c0e] rounded-lg border border-[#222226]">
                      <Database size={32} className="text-[#3a3535] mb-2" />
                      <p className="text-xs text-[#6e6868] font-mono">No deployed tokens in sandbox registry.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {forgedTokens.map((token, i) => (
                        <div key={i} className="bg-[#0c0c0e] border border-[#222226] p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white text-sm">{token.name} ({token.symbol})</h4>
                              <span className="text-[0.62rem] font-mono text-[#8b5cf6] block mt-0.5">{token.address}</span>
                            </div>
                            <span className="text-[0.62rem] font-mono text-[#6e6868]">{token.date}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#8a8080] border-t border-[#222226]/50 pt-2 mt-2">
                            <span>Supply: <b>{token.supply}</b></span>
                            <span className="text-[#2ea86a] flex items-center gap-1"><CheckCircle size={12} /> Active</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-[#8b5cf6]/5 border border-[#8b5cf6]/20 p-4 rounded-lg mt-6">
                  <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#8b5cf6]" /> Sandbox Ledger Rules
                  </h4>
                  <p className="text-[0.68rem] text-[#8a8080] leading-relaxed">
                    Virtual Sandbox utilizes standard ERC20 contracts. Deployed tokens will immediately reflect in the mock portfolio above. They are not broadcast to real blockchain networks (Ethereum Mainnet / Base).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTRACT LAB */}
          {activeTab === 'contracts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Template selector & Solidity Editor */}
              <div className="lg:col-span-2 bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Solidity Compiler Sandbox</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedContract('erc20')}
                      className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                        selectedContract === 'erc20' ? 'bg-[#f7931a]/10 border-[#f7931a] text-[#f7931a]' : 'border-[#2a2a2e] text-[#6e6868] hover:text-white'
                      }`}
                    >
                      ERC-20 Token
                    </button>
                    <button
                      onClick={() => setSelectedContract('staking')}
                      className={`px-3 py-1.5 text-[0.65rem] font-bold tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                        selectedContract === 'staking' ? 'bg-[#f7931a]/10 border-[#f7931a] text-[#f7931a]' : 'border-[#2a2a2e] text-[#6e6868] hover:text-white'
                      }`}
                    >
                      Staking Vault
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre className="bg-[#0c0c0e] border border-[#222226] p-4 rounded-lg font-mono text-[0.68rem] text-[#a78bfa] overflow-x-auto h-96 leading-relaxed select-text">
                    {solidityTemplates[selectedContract]}
                  </pre>
                  <button
                    onClick={handleSimulateContract}
                    disabled={isSimulating}
                    className="absolute bottom-4 right-4 py-2 px-4 bg-[#f7931a] hover:bg-[#f7931a]/95 text-white font-bold text-[0.65rem] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    {isSimulating ? 'COMPILING...' : 'SIMULATE DEPLOY'}
                  </button>
                </div>
              </div>

              {/* Deployment logger output */}
              <div className="bg-[#141416] border border-[#2a2a2e] p-5 rounded-xl h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Terminal size={16} className="text-[#f7931a]" /> Deployment Output logs
                  </h3>
                  {simulationLog.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-[#0c0c0e] rounded-lg border border-[#222226] h-80">
                      <Terminal size={24} className="text-[#3a3535] mb-2" />
                      <p className="text-[0.68rem] text-[#6e6868] font-mono text-center">Hit &quot;SIMULATE DEPLOY&quot; to initialize test blockchain pipeline.</p>
                    </div>
                  ) : (
                    <div className="bg-[#0a0a0b] p-3 rounded-lg border border-[#222226] font-mono text-[0.65rem] text-[#8a8080] h-80 overflow-y-auto space-y-2">
                      {simulationLog.map((log, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className={log.startsWith('✓') ? 'text-[#2ea86a]' : log.startsWith('[COMPILER]') ? 'text-[#00d4ff]' : log.startsWith('[BLOCKCHAIN]') ? 'text-[#8b5cf6]' : 'text-[#8a8080]'}>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlockchainHome;
