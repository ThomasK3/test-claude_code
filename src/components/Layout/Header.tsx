import {
  Star,
  GitCompareArrows,
  Bell,
  Briefcase,
  Calendar,
  Clock,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getStockData } from '../../data/stocks';
import { formatCurrency, formatPercent, cn } from '../../utils/format';

export function Header() {
  const {
    selectedSymbol,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    activePanel,
    setActivePanel,
    isSimulating,
    setSimulating,
  } = useStore();

  const data = getStockData(selectedSymbol);
  if (!data) return null;
  const { quote } = data;
  const isPositive = quote.changePercent >= 0;

  const panels = [
    { id: 'compare', icon: GitCompareArrows, label: 'Compare' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio' },
    { id: 'earnings', icon: Calendar, label: 'Earnings' },
  ];

  return (
    <header className="main-header">
      <div className="header-left">
        <div>
          <span className="header-symbol">{quote.symbol}</span>
          <span className="header-name" style={{ marginLeft: 10 }}>
            {quote.name}
          </span>
        </div>
        <div className="header-price-group">
          <span className="header-price">{formatCurrency(quote.price)}</span>
          <span
            className="header-change"
            style={{ color: isPositive ? 'var(--green)' : 'var(--red)' }}
          >
            {isPositive ? '+' : ''}
            {quote.change.toFixed(2)} ({formatPercent(quote.changePercent)})
          </span>
        </div>
      </div>

      <div className="header-right">
        <button
          className={cn('header-btn', isSimulating && 'active')}
          onClick={() => setSimulating(!isSimulating)}
        >
          <Clock size={14} />
          Simulate
        </button>

        <button
          className={cn(
            'header-btn',
            watchlist.includes(selectedSymbol) && 'active'
          )}
          onClick={() =>
            watchlist.includes(selectedSymbol)
              ? removeFromWatchlist(selectedSymbol)
              : addToWatchlist(selectedSymbol)
          }
        >
          <Star
            size={14}
            fill={
              watchlist.includes(selectedSymbol) ? 'currentColor' : 'none'
            }
          />
          Watchlist
        </button>

        {panels.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={cn('header-btn', activePanel === id && 'active')}
            onClick={() => setActivePanel(id)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
