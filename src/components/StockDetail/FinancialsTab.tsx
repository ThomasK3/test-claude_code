import { useStore } from '../../store/useStore';
import { getStockData } from '../../data/stocks';
import { formatLargeNumber } from '../../utils/format';

export function FinancialsTab() {
  const { selectedSymbol } = useStore();
  const data = getStockData(selectedSymbol);
  if (!data) return null;

  const { financials } = data;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="fin-table">
        <thead>
          <tr>
            <th>Metric</th>
            {financials.map((f) => (
              <th key={f.year}>{f.year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Revenue</td>
            {financials.map((f) => (
              <td key={f.year}>{formatLargeNumber(f.revenue)}</td>
            ))}
          </tr>
          <tr>
            <td>Net Income</td>
            {financials.map((f) => (
              <td key={f.year}>{formatLargeNumber(f.netIncome)}</td>
            ))}
          </tr>
          <tr>
            <td>Gross Margin</td>
            {financials.map((f) => (
              <td key={f.year}>{(f.grossMargin * 100).toFixed(1)}%</td>
            ))}
          </tr>
          <tr>
            <td>Operating Margin</td>
            {financials.map((f) => (
              <td key={f.year}>{(f.operatingMargin * 100).toFixed(1)}%</td>
            ))}
          </tr>
          <tr>
            <td>Net Margin</td>
            {financials.map((f) => (
              <td key={f.year}>{(f.netMargin * 100).toFixed(1)}%</td>
            ))}
          </tr>
          <tr>
            <td>EPS</td>
            {financials.map((f) => (
              <td key={f.year}>${f.eps.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td>Free Cash Flow</td>
            {financials.map((f) => (
              <td key={f.year}>{formatLargeNumber(f.freeCashFlow)}</td>
            ))}
          </tr>
          <tr>
            <td>Total Debt</td>
            {financials.map((f) => (
              <td key={f.year}>{formatLargeNumber(f.totalDebt)}</td>
            ))}
          </tr>
          <tr>
            <td>Cash & Equiv</td>
            {financials.map((f) => (
              <td key={f.year}>{formatLargeNumber(f.totalCash)}</td>
            ))}
          </tr>
          <tr>
            <td>ROE</td>
            {financials.map((f) => (
              <td key={f.year}>{(f.roe * 100).toFixed(1)}%</td>
            ))}
          </tr>
          <tr>
            <td>ROA</td>
            {financials.map((f) => (
              <td key={f.year}>{(f.roa * 100).toFixed(1)}%</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
