import { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { getAllQuotes } from '../../data/stocks';
import { formatCurrency, formatPercent, cn } from '../../utils/format';

export function Sidebar() {
  const {
    selectedSymbol,
    setSelectedSymbol,
    sidebarView,
    setSidebarView,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useStore();

  const [search, setSearch] = useState('');
  const allQuotes = useMemo(() => getAllQuotes(), []);

  const filteredQuotes = useMemo(() => {
    let quotes = allQuotes;
    if (sidebarView === 'watchlist') {
      quotes = quotes.filter((q) => watchlist.includes(q.symbol));
    }
    if (search) {
      const s = search.toLowerCase();
      quotes = quotes.filter(
        (q) =>
          q.symbol.toLowerCase().includes(s) ||
          q.name.toLowerCase().includes(s)
      );
    }
    return quotes;
  }, [allQuotes, sidebarView, watchlist, search]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">A</div>
          Apex Terminal
        </div>
      </div>

      <div className="sidebar-tabs">
        <button
          className={cn('sidebar-tab', sidebarView === 'all' && 'active')}
          onClick={() => setSidebarView('all')}
        >
          Markets
        </button>
        <button
          className={cn('sidebar-tab', sidebarView === 'watchlist' && 'active')}
          onClick={() => setSidebarView('watchlist')}
        >
          Watchlist
        </button>
      </div>

      <div className="sidebar-search">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search symbols..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stock-list">
        <AnimatePresence mode="popLayout">
          {filteredQuotes.map((quote) => (
            <motion.div
              key={quote.symbol}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'stock-item',
                selectedSymbol === quote.symbol && 'active'
              )}
              onClick={() => setSelectedSymbol(quote.symbol)}
            >
              <div className="stock-item-left">
                <div className="stock-symbol">{quote.symbol}</div>
                <div className="stock-name">{quote.name}</div>
              </div>
              <div className="stock-item-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="stock-price">
                    {formatCurrency(quote.price)}
                  </span>
                  <button
                    className={cn(
                      'watchlist-star',
                      watchlist.includes(quote.symbol) && 'active'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (watchlist.includes(quote.symbol)) {
                        removeFromWatchlist(quote.symbol);
                      } else {
                        addToWatchlist(quote.symbol);
                      }
                    }}
                  >
                    <Star size={12} fill={watchlist.includes(quote.symbol) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <span
                  className={cn(
                    'stock-change',
                    quote.changePercent >= 0 ? 'positive' : 'negative'
                  )}
                >
                  {formatPercent(quote.changePercent)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </aside>
  );
}
