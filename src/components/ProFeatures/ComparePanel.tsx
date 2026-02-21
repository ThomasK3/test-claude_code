import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getAllSymbols, getStockData } from '../../data/stocks';
import { formatCurrency, formatPercent } from '../../utils/format';

const COMPARE_COLORS = ['#f97316', '#06b6d4', '#ec4899', '#eab308'];

export function ComparePanel() {
  const {
    selectedSymbol,
    compareSymbols,
    addCompareSymbol,
    removeCompareSymbol,
    clearCompare,
    setActivePanel,
  } = useStore();
  const [addSymbol, setAddSymbol] = useState('');
  const allSymbols = getAllSymbols().filter(
    (s) => s !== selectedSymbol && !compareSymbols.includes(s)
  );

  const handleAdd = () => {
    const sym = addSymbol.toUpperCase().trim();
    if (sym && getAllSymbols().includes(sym)) {
      addCompareSymbol(sym);
      setAddSymbol('');
    }
  };

  return (
    <div className="pro-panel">
      <div className="pro-panel-header">
        <span className="pro-panel-title">Compare Stocks</span>
        <button className="pro-panel-close" onClick={() => setActivePanel(null)}>
          <X size={16} />
        </button>
      </div>
      <div className="pro-panel-content">
        <div className="section-heading">Base Symbol</div>
        <div className="alert-item" style={{ marginBottom: 16 }}>
          <div className="alert-info">
            <span className="alert-symbol">{selectedSymbol}</span>
            <span className="alert-condition">
              {getStockData(selectedSymbol)?.quote.name}
            </span>
          </div>
          <span
            className="tech-value"
            style={{
              color:
                (getStockData(selectedSymbol)?.quote.changePercent ?? 0) >= 0
                  ? 'var(--green)'
                  : 'var(--red)',
            }}
          >
            {formatCurrency(getStockData(selectedSymbol)?.quote.price ?? 0)}
          </span>
        </div>

        <div className="section-heading">Comparing With</div>
        {compareSymbols.map((sym, idx) => {
          const d = getStockData(sym);
          return (
            <div key={sym} className="alert-item" style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  className="compare-dot"
                  style={{
                    backgroundColor: COMPARE_COLORS[idx % COMPARE_COLORS.length],
                  }}
                />
                <div className="alert-info">
                  <span className="alert-symbol">{sym}</span>
                  <span className="alert-condition">{d?.quote.name}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="tech-value">
                  {formatPercent(d?.quote.changePercent ?? 0)}
                </span>
                <button
                  className="alert-delete"
                  onClick={() => removeCompareSymbol(sym)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {compareSymbols.length < 4 && (
          <div className="form-row" style={{ marginTop: 12 }}>
            <select
              className="form-select"
              value={addSymbol}
              onChange={(e) => setAddSymbol(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Add symbol...</option>
              {allSymbols.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="form-btn" onClick={handleAdd}>
              <Plus size={14} />
            </button>
          </div>
        )}

        {compareSymbols.length > 0 && (
          <button
            className="form-btn"
            style={{
              marginTop: 12,
              width: '100%',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
            onClick={clearCompare}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
