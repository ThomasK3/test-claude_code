import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/format';
import type { DetailTab } from '../../types/stock';
import { OverviewTab } from './OverviewTab';
import { FinancialsTab } from './FinancialsTab';
import { ValuationTab } from './ValuationTab';
import { TechnicalsTab } from './TechnicalsTab';

const TABS: DetailTab[] = ['overview', 'financials', 'valuation', 'technicals'];

const tabComponents: Record<DetailTab, React.FC> = {
  overview: OverviewTab,
  financials: FinancialsTab,
  valuation: ValuationTab,
  technicals: TechnicalsTab,
};

export function DetailPanel() {
  const { activeTab, setActiveTab, selectedSymbol } = useStore();
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="detail-section">
      <div className="detail-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={cn('detail-tab', activeTab === tab && 'active')}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="detail-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedSymbol}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
