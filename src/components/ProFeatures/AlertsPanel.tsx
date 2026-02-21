import { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getAllSymbols } from '../../data/stocks';
import { formatCurrency } from '../../utils/format';
import type { Alert } from '../../types/stock';

export function AlertsPanel() {
  const { alerts, addAlert, removeAlert, setActivePanel, selectedSymbol } =
    useStore();
  const [symbol, setSymbol] = useState(selectedSymbol);
  const [type, setType] = useState<Alert['type']>('price_above');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value || isNaN(Number(value))) return;
    addAlert({
      id: `alert-${Date.now()}`,
      symbol: symbol,
      type,
      value: Number(value),
      triggered: false,
      createdAt: new Date().toISOString(),
    });
    setValue('');
  };

  const typeLabels: Record<Alert['type'], string> = {
    price_above: 'Price Above',
    price_below: 'Price Below',
    percent_change: '% Change',
    volume_spike: 'Volume Spike',
  };

  const formatCondition = (alert: Alert) => {
    switch (alert.type) {
      case 'price_above':
        return `Price rises above ${formatCurrency(alert.value)}`;
      case 'price_below':
        return `Price drops below ${formatCurrency(alert.value)}`;
      case 'percent_change':
        return `${alert.value}% change in price`;
      case 'volume_spike':
        return `Volume exceeds ${alert.value.toLocaleString()}`;
    }
  };

  return (
    <div className="pro-panel">
      <div className="pro-panel-header">
        <span className="pro-panel-title">Price Alerts</span>
        <button className="pro-panel-close" onClick={() => setActivePanel(null)}>
          <X size={16} />
        </button>
      </div>
      <div className="pro-panel-content">
        <div className="section-heading">Create Alert</div>
        <div className="form-row">
          <select
            className="form-select"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {getAllSymbols().map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value as Alert['type'])}
          >
            {Object.entries(typeLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <input
            type="number"
            className="form-input"
            placeholder="Value..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="form-btn" onClick={handleAdd}>
            Add
          </button>
        </div>

        <div className="section-heading" style={{ marginTop: 20 }}>
          Active Alerts ({alerts.length})
        </div>
        {alerts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 24,
              color: 'var(--text-dim)',
            }}
          >
            <Bell size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div>No alerts configured</div>
          </div>
        )}
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-item${alert.triggered ? ' triggered' : ''}`}
          >
            <div className="alert-info">
              <span className="alert-symbol">{alert.symbol}</span>
              <span className="alert-condition">{formatCondition(alert)}</span>
            </div>
            <button
              className="alert-delete"
              onClick={() => removeAlert(alert.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
