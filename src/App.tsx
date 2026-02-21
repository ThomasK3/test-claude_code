import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Layout/Header';
import { ChartControls } from './components/Layout/ChartControls';
import { SimulationBar } from './components/Layout/SimulationBar';
import { StockChart } from './components/Chart/StockChart';
import { DetailPanel } from './components/StockDetail/DetailPanel';
import { ComparePanel } from './components/ProFeatures/ComparePanel';
import { AlertsPanel } from './components/ProFeatures/AlertsPanel';
import { PortfolioPanel } from './components/ProFeatures/PortfolioPanel';
import { EarningsPanel } from './components/ProFeatures/EarningsPanel';
import { useStore } from './store/useStore';

const panelComponents: Record<string, React.FC> = {
  compare: ComparePanel,
  alerts: AlertsPanel,
  portfolio: PortfolioPanel,
  earnings: EarningsPanel,
};

function App() {
  const { activePanel, isSimulating, compareSymbols } = useStore();
  const PanelComponent = activePanel ? panelComponents[activePanel] : null;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <ChartControls />
        {isSimulating && <SimulationBar />}
        {compareSymbols.length > 0 && <CompareLegend />}
        <StockChart />
        <DetailPanel />
      </div>

      <AnimatePresence>
        {PanelComponent && (
          <motion.div
            key={activePanel}
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 100 }}
          >
            <PanelComponent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompareLegend() {
  const { selectedSymbol, compareSymbols, removeCompareSymbol } = useStore();
  const colors = ['#3b82f6', '#f97316', '#06b6d4', '#ec4899', '#eab308'];
  const allSymbols = [selectedSymbol, ...compareSymbols];

  return (
    <div className="compare-legend">
      {allSymbols.map((sym, idx) => (
        <div key={sym} className="compare-legend-item">
          <div
            className="compare-dot"
            style={{ backgroundColor: colors[idx % colors.length] }}
          />
          <span>{sym}</span>
          {idx > 0 && (
            <button
              style={{ color: 'var(--text-dim)', marginLeft: -2 }}
              onClick={() => removeCompareSymbol(sym)}
            >
              x
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
