import { useEffect, useRef, useMemo } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getStockData, generateFutureBars } from '../../data/stocks';
import { cn } from '../../utils/format';

const TOTAL_SIM_BARS = 120;

export function SimulationBar() {
  const {
    isSimulating,
    setSimulating,
    simulationSpeed,
    setSimulationSpeed,
    simBarIndex,
    setSimBarIndex,
    selectedSymbol,
  } = useStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const futureBars = useMemo(() => {
    const data = getStockData(selectedSymbol);
    if (!data || !data.history.length) return [];
    const lastBar = data.history[data.history.length - 1];
    const volatility = 0.02;
    return generateFutureBars(lastBar, TOTAL_SIM_BARS * 2, volatility, 777);
  }, [selectedSymbol]);

  useEffect(() => {
    if (isSimulating && simBarIndex < futureBars.length) {
      intervalRef.current = setInterval(() => {
        setSimBarIndex(
          useStore.getState().simBarIndex + 1
        );
      }, 1000 / simulationSpeed);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating, simulationSpeed, simBarIndex, futureBars.length, setSimBarIndex]);

  // Pause when finished
  useEffect(() => {
    if (simBarIndex >= futureBars.length) {
      setSimulating(false);
    }
  }, [simBarIndex, futureBars.length, setSimulating]);

  const progress = futureBars.length > 0 ? (simBarIndex / futureBars.length) * 100 : 0;
  const currentDate = futureBars[simBarIndex - 1]?.time ?? '—';
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="sim-bar">
      <span className="sim-badge">Simulation</span>

      <div className="sim-controls">
        <button
          className={cn('sim-btn')}
          onClick={() => {
            setSimBarIndex(0);
            setSimulating(false);
          }}
          title="Reset"
        >
          <RotateCcw size={13} />
        </button>
        <button
          className={cn('sim-btn', isSimulating && 'active')}
          onClick={() => setSimulating(!isSimulating)}
          title={isSimulating ? 'Pause' : 'Play'}
        >
          {isSimulating ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <button
          className="sim-btn"
          onClick={() =>
            setSimBarIndex(Math.min(simBarIndex + 5, futureBars.length))
          }
          title="Skip Forward"
        >
          <SkipForward size={13} />
        </button>
      </div>

      <div className="sim-progress">
        <div className="sim-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <span className="sim-date">{currentDate}</span>

      <div className="sim-controls">
        {speeds.map((s) => (
          <button
            key={s}
            className={cn('sim-btn', simulationSpeed === s && 'active')}
            onClick={() => setSimulationSpeed(s)}
            style={{ fontSize: 10, fontWeight: 700, width: 'auto', padding: '0 6px' }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
