import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getAllSymbols, getStockData } from '../../data/stocks';
import { formatCurrency, formatPercent, cn } from '../../utils/format';

export function PortfolioPanel() {
  const { portfolio, addPosition, removePosition, setActivePanel } = useStore();
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [cost, setCost] = useState('');

  const handleAdd = () => {
    if (!symbol || !shares || !cost) return;
    const currentPrice = getStockData(symbol)?.quote.price ?? 0;
    addPosition({
      symbol,
      shares: Number(shares),
      avgCost: Number(cost),
      currentPrice,
    });
    setSymbol('');
    setShares('');
    setCost('');
  };

  // Compute values with current prices
  const positions = portfolio.map((pos) => {
    const currentPrice = getStockData(pos.symbol)?.quote.price ?? pos.currentPrice;
    const marketValue = currentPrice * pos.shares;
    const costBasis = pos.avgCost * pos.shares;
    const pnl = marketValue - costBasis;
    const pnlPercent = ((currentPrice - pos.avgCost) / pos.avgCost) * 100;
    return { ...pos, currentPrice, marketValue, costBasis, pnl, pnlPercent };
  });

  const totalValue = positions.reduce((s, p) => s + p.marketValue, 0);
  const totalCost = positions.reduce((s, p) => s + p.costBasis, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  return (
    <div className="pro-panel">
      <div className="pro-panel-header">
        <span className="pro-panel-title">Portfolio Sandbox</span>
        <button className="pro-panel-close" onClick={() => setActivePanel(null)}>
          <X size={16} />
        </button>
      </div>
      <div className="pro-panel-content">
        <div className="portfolio-summary">
          <div className="portfolio-stat">
            <div className="portfolio-stat-label">Value</div>
            <div className="portfolio-stat-value">{formatCurrency(totalValue)}</div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-label">P&L</div>
            <div
              className="portfolio-stat-value"
              style={{ color: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }}
            >
              {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
            </div>
          </div>
          <div className="portfolio-stat">
            <div className="portfolio-stat-label">Return</div>
            <div
              className="portfolio-stat-value"
              style={{ color: totalPnlPercent >= 0 ? 'var(--green)' : 'var(--red)' }}
            >
              {formatPercent(totalPnlPercent)}
            </div>
          </div>
        </div>

        <div className="section-heading">Positions</div>
        {positions.map((pos) => (
          <div key={pos.symbol} className="position-row">
            <div className="position-left">
              <span className="position-symbol">{pos.symbol}</span>
              <span className="position-shares">
                {pos.shares} shares @ {formatCurrency(pos.avgCost)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="position-right">
                <div className="position-value">{formatCurrency(pos.marketValue)}</div>
                <div
                  className={cn('position-pnl')}
                  style={{ color: pos.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}
                >
                  {pos.pnl >= 0 ? '+' : ''}{formatCurrency(pos.pnl)} ({formatPercent(pos.pnlPercent)})
                </div>
              </div>
              <button
                className="alert-delete"
                onClick={() => removePosition(pos.symbol)}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        <div className="section-heading" style={{ marginTop: 16 }}>
          Add Position
        </div>
        <div className="form-row">
          <select
            className="form-select"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="">Symbol...</option>
            {getAllSymbols().map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <input
            type="number"
            className="form-input"
            placeholder="Shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Avg Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <button className="form-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
