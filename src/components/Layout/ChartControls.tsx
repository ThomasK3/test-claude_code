import { useStore } from '../../store/useStore';
import { cn } from '../../utils/format';
import type { TimeRange, ChartType, IndicatorType } from '../../types/stock';

const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y'];
const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'candle', label: 'Candle' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
];
const INDICATORS: { value: IndicatorType; label: string }[] = [
  { value: 'sma', label: 'SMA' },
  { value: 'ema', label: 'EMA' },
  { value: 'bollinger', label: 'BB' },
  { value: 'rsi', label: 'RSI' },
  { value: 'macd', label: 'MACD' },
  { value: 'volume', label: 'Vol' },
];

export function ChartControls() {
  const {
    timeRange,
    setTimeRange,
    chartType,
    setChartType,
    activeIndicators,
    toggleIndicator,
  } = useStore();

  return (
    <div className="chart-controls">
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div className="control-group">
          <span className="control-group-label">Period</span>
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              className={cn('control-btn', timeRange === range && 'active')}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="control-group">
          <span className="control-group-label">Type</span>
          {CHART_TYPES.map(({ value, label }) => (
            <button
              key={value}
              className={cn('control-btn', chartType === value && 'active')}
              onClick={() => setChartType(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-group-label">Indicators</span>
        {INDICATORS.map(({ value, label }) => (
          <button
            key={value}
            className={cn(
              'control-btn',
              activeIndicators.includes(value) && 'active'
            )}
            onClick={() => toggleIndicator(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
