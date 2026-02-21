import { useStore } from '../../store/useStore';
import { getStockData } from '../../data/stocks';
import { formatCurrency, formatPercent } from '../../utils/format';

export function ValuationTab() {
  const { selectedSymbol } = useStore();
  const data = getStockData(selectedSymbol);
  if (!data) return null;

  const { valuation, quote } = data;

  const metrics = [
    {
      label: 'P/E Ratio',
      value: valuation.peRatio.toFixed(2),
      bar: Math.min(valuation.peRatio / 60, 1),
      color: valuation.peRatio > 30 ? 'var(--red)' : 'var(--green)',
    },
    {
      label: 'Forward P/E',
      value: valuation.forwardPE.toFixed(2),
      bar: Math.min(valuation.forwardPE / 50, 1),
      color: valuation.forwardPE > 25 ? 'var(--orange)' : 'var(--green)',
    },
    {
      label: 'PEG Ratio',
      value: valuation.pegRatio.toFixed(2),
      bar: Math.min(valuation.pegRatio / 3, 1),
      color: valuation.pegRatio > 2 ? 'var(--red)' : 'var(--green)',
    },
    {
      label: 'Price/Sales',
      value: valuation.priceToSales.toFixed(2),
      bar: Math.min(valuation.priceToSales / 15, 1),
      color: 'var(--accent-blue)',
    },
    {
      label: 'Price/Book',
      value: valuation.priceToBook.toFixed(2),
      bar: Math.min(valuation.priceToBook / 20, 1),
      color: 'var(--accent-cyan)',
    },
    {
      label: 'EV/EBITDA',
      value: valuation.evToEbitda.toFixed(2),
      bar: Math.min(valuation.evToEbitda / 30, 1),
      color: 'var(--accent-purple)',
    },
    {
      label: 'EV/Revenue',
      value: valuation.evToRevenue.toFixed(2),
      bar: Math.min(valuation.evToRevenue / 15, 1),
      color: 'var(--accent-purple)',
    },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div className="section-heading">Valuation Multiples</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {metrics.map(({ label, value, bar, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="tech-label">{label}</span>
                  <span className="tech-value">{value}x</span>
                </div>
                <div className="val-bar-container">
                  <div
                    className="val-bar-fill"
                    style={{
                      width: `${bar * 100}%`,
                      background: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-heading">Fair Value Analysis</div>
          <div className="metrics-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="metric-card">
              <div className="metric-label">Current Price</div>
              <div className="metric-value">{formatCurrency(quote.price)}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">DCF Intrinsic Value</div>
              <div className="metric-value">{formatCurrency(valuation.dcfValue)}</div>
              <div
                className="metric-sub"
                style={{
                  color:
                    valuation.dcfValue > quote.price
                      ? 'var(--green)'
                      : 'var(--red)',
                }}
              >
                {valuation.dcfValue > quote.price ? 'Undervalued' : 'Overvalued'}{' '}
                by{' '}
                {formatPercent(
                  ((valuation.dcfValue - quote.price) / quote.price) * 100
                )}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Analyst Target</div>
              <div className="metric-value">
                {formatCurrency(valuation.analystTarget)}
              </div>
              <div
                className="metric-sub"
                style={{
                  color: valuation.upside > 0 ? 'var(--green)' : 'var(--red)',
                }}
              >
                {formatPercent(valuation.upside)} upside
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
