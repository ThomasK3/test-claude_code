import { create } from 'zustand';
import type {
  TimeRange,
  ChartType,
  DetailTab,
  IndicatorType,
  Alert,
  PortfolioPosition,
} from '../types/stock';

interface AppState {
  // Navigation
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;

  // Chart
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  activeIndicators: IndicatorType[];
  toggleIndicator: (indicator: IndicatorType) => void;

  // Detail
  activeTab: DetailTab;
  setActiveTab: (tab: DetailTab) => void;

  // Watchlist
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;

  // Compare
  compareSymbols: string[];
  addCompareSymbol: (symbol: string) => void;
  removeCompareSymbol: (symbol: string) => void;
  clearCompare: () => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;

  // Portfolio sandbox
  portfolio: PortfolioPosition[];
  addPosition: (pos: PortfolioPosition) => void;
  removePosition: (symbol: string) => void;
  updatePositionPrice: (symbol: string, price: number) => void;

  // Time simulation
  isSimulating: boolean;
  simulationSpeed: number;
  simBarIndex: number;
  setSimulating: (val: boolean) => void;
  setSimulationSpeed: (speed: number) => void;
  setSimBarIndex: (idx: number) => void;

  // Sidebar
  sidebarView: 'all' | 'watchlist';
  setSidebarView: (view: 'all' | 'watchlist') => void;

  // Active pro feature panel
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedSymbol: 'AAPL',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  timeRange: '1Y',
  setTimeRange: (range) => set({ timeRange: range }),
  chartType: 'candle',
  setChartType: (type) => set({ chartType: type }),
  activeIndicators: ['volume'],
  toggleIndicator: (indicator) =>
    set((s) => ({
      activeIndicators: s.activeIndicators.includes(indicator)
        ? s.activeIndicators.filter((i) => i !== indicator)
        : [...s.activeIndicators, indicator],
    })),

  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  watchlist: ['AAPL', 'NVDA', 'MSFT'],
  addToWatchlist: (symbol) =>
    set((s) => ({
      watchlist: s.watchlist.includes(symbol)
        ? s.watchlist
        : [...s.watchlist, symbol],
    })),
  removeFromWatchlist: (symbol) =>
    set((s) => ({
      watchlist: s.watchlist.filter((s2) => s2 !== symbol),
    })),

  compareSymbols: [],
  addCompareSymbol: (symbol) =>
    set((s) => ({
      compareSymbols: s.compareSymbols.includes(symbol)
        ? s.compareSymbols
        : [...s.compareSymbols, symbol].slice(0, 4),
    })),
  removeCompareSymbol: (symbol) =>
    set((s) => ({
      compareSymbols: s.compareSymbols.filter((s2) => s2 !== symbol),
    })),
  clearCompare: () => set({ compareSymbols: [] }),

  alerts: [],
  addAlert: (alert) => set((s) => ({ alerts: [...s.alerts, alert] })),
  removeAlert: (id) =>
    set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  triggerAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, triggered: true } : a)),
    })),

  portfolio: [
    { symbol: 'AAPL', shares: 50, avgCost: 145.0, currentPrice: 0 },
    { symbol: 'MSFT', shares: 30, avgCost: 280.0, currentPrice: 0 },
    { symbol: 'NVDA', shares: 20, avgCost: 220.0, currentPrice: 0 },
  ],
  addPosition: (pos) =>
    set((s) => ({
      portfolio: [...s.portfolio.filter((p) => p.symbol !== pos.symbol), pos],
    })),
  removePosition: (symbol) =>
    set((s) => ({
      portfolio: s.portfolio.filter((p) => p.symbol !== symbol),
    })),
  updatePositionPrice: (symbol, price) =>
    set((s) => ({
      portfolio: s.portfolio.map((p) =>
        p.symbol === symbol ? { ...p, currentPrice: price } : p
      ),
    })),

  isSimulating: false,
  simulationSpeed: 1,
  simBarIndex: 0,
  setSimulating: (val) => set({ isSimulating: val }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  setSimBarIndex: (idx) => set({ simBarIndex: idx }),

  sidebarView: 'all',
  setSidebarView: (view) => set({ sidebarView: view }),

  activePanel: null,
  setActivePanel: (panel) =>
    set((s) => ({
      activePanel: s.activePanel === panel ? null : panel,
    })),
}));
