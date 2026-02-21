import { useStore } from '../../store/useStore';
import { getStockData } from '../../data/stocks';
import { formatCurrency, formatLargeNumber, formatVolume, formatPercent } from '../../utils/format';

export function OverviewTab() {
  const { selectedSymbol } = useStore();
  const data = getStockData(selectedSymbol);
  if (!data) return null;
  const { quote } = data;

  const metrics = [
    { label: 'Market Cap', value: formatLargeNumber(quote.marketCap) },
    { label: 'P/E Ratio', value: quote.pe.toFixed(2) },
    { label: 'EPS', value: formatCurrency(quote.eps) },
    { label: 'Beta', value: quote.beta.toFixed(2) },
    { label: '52W High', value: formatCurrency(quote.high52w) },
    { label: '52W Low', value: formatCurrency(quote.low52w) },
    { label: 'Volume', value: formatVolume(quote.volume) },
    { label: 'Avg Volume', value: formatVolume(quote.avgVolume) },
    { label: 'Dividend', value: formatCurrency(quote.dividend) },
    { label: 'Div Yield', value: formatPercent(quote.dividendYield) },
    { label: 'Sector', value: quote.sector },
    { label: 'Exchange', value: quote.exchange },
  ];

  return (
    <div className="metrics-grid">
      {metrics.map(({ label, value }) => (
        <div key={label} className="metric-card">
          <div className="metric-label">{label}</div>
          <div className="metric-value">{value}</div>
        </div>
      ))}
    </div>
  );
}
