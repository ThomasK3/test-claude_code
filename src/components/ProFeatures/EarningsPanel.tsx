import { useMemo } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getEarningsCalendar } from '../../data/stocks';
import { cn } from '../../utils/format';

export function EarningsPanel() {
  const { setActivePanel, setSelectedSymbol } = useStore();
  const earnings = useMemo(() => getEarningsCalendar(), []);

  // Group by month
  const byMonth = useMemo(() => {
    const map = new Map<string, typeof earnings>();
    for (const e of earnings) {
      const month = e.date.slice(0, 7);
      if (!map.has(month)) map.set(month, []);
      map.get(month)!.push(e);
    }
    return Array.from(map.entries());
  }, [earnings]);

  const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="pro-panel">
      <div className="pro-panel-header">
        <span className="pro-panel-title">Earnings Calendar</span>
        <button className="pro-panel-close" onClick={() => setActivePanel(null)}>
          <X size={16} />
        </button>
      </div>
      <div className="pro-panel-content">
        {byMonth.map(([month, events]) => {
          const [year, m] = month.split('-');
          return (
            <div key={month} className="earnings-month">
              <div className="earnings-month-title">
                {monthNames[Number(m)]} {year}
              </div>
              {events.map((e) => (
                <div
                  key={`${e.symbol}-${e.quarter}`}
                  className="earnings-item"
                  onClick={() => setSelectedSymbol(e.symbol)}
                >
                  <div className="earnings-left">
                    <span className="earnings-date">
                      {e.date.split('-').slice(1).join('/')}
                    </span>
                    <span className="earnings-symbol-tag">{e.symbol}</span>
                    <span className="earnings-time">{e.time}</span>
                  </div>
                  <div className="earnings-right">
                    <span style={{ color: 'var(--text-muted)' }}>
                      Est: ${e.estimatedEps.toFixed(2)}
                    </span>
                    {e.actualEps !== undefined && (
                      <>
                        <span style={{ color: 'var(--text-primary)' }}>
                          Act: ${e.actualEps.toFixed(2)}
                        </span>
                        <span
                          className={cn('earnings-surprise')}
                          style={{
                            background:
                              (e.surprise ?? 0) >= 0
                                ? 'var(--green-bg)'
                                : 'var(--red-bg)',
                            color:
                              (e.surprise ?? 0) >= 0
                                ? 'var(--green)'
                                : 'var(--red)',
                          }}
                        >
                          {(e.surprise ?? 0) >= 0 ? '+' : ''}
                          {e.surprise?.toFixed(1)}%
                        </span>
                      </>
                    )}
                    {e.actualEps === undefined && (
                      <span
                        style={{
                          color: 'var(--accent-cyan)',
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
