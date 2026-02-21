import { useEffect, useRef, useCallback } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
} from 'lightweight-charts';
import { useStore } from '../../store/useStore';
import { getStockHistory, getStockData } from '../../data/stocks';

export function StockChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRefs = useRef<ISeriesApi<SeriesType>[]>([]);

  const {
    selectedSymbol,
    timeRange,
    chartType,
    activeIndicators,
    compareSymbols,
  } = useStore();

  const buildChart = useCallback(() => {
    if (!containerRef.current) return;

    // Clean up old chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRefs.current = [];
    }

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0e17' },
        textColor: '#64748b',
        fontFamily: "'SF Mono', 'Cascadia Code', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.5)' },
        horzLines: { color: 'rgba(30, 41, 59, 0.5)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: 'rgba(59, 130, 246, 0.3)',
          labelBackgroundColor: '#3b82f6',
        },
        horzLine: {
          color: 'rgba(59, 130, 246, 0.3)',
          labelBackgroundColor: '#3b82f6',
        },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    });

    chartRef.current = chart;

    const history = getStockHistory(selectedSymbol, timeRange);
    if (!history.length) return;

    // Main series
    if (chartType === 'candle') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#22c55e',
        wickDownColor: '#ef4444',
        wickUpColor: '#22c55e',
      });
      series.setData(
        history.map((d) => ({
          time: d.time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }))
      );
      seriesRefs.current.push(series as unknown as ISeriesApi<SeriesType>);
    } else if (chartType === 'line') {
      const series = chart.addSeries(LineSeries, {
        color: '#3b82f6',
        lineWidth: 2,
      });
      series.setData(history.map((d) => ({ time: d.time, value: d.close })));
      seriesRefs.current.push(series as unknown as ISeriesApi<SeriesType>);
    } else {
      const series = chart.addSeries(AreaSeries, {
        topColor: 'rgba(59, 130, 246, 0.3)',
        bottomColor: 'rgba(59, 130, 246, 0.02)',
        lineColor: '#3b82f6',
        lineWidth: 2,
      });
      series.setData(history.map((d) => ({ time: d.time, value: d.close })));
      seriesRefs.current.push(series as unknown as ISeriesApi<SeriesType>);
    }

    // Volume
    if (activeIndicators.includes('volume')) {
      const volSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol',
      });
      chart.priceScale('vol').applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volSeries.setData(
        history.map((d) => ({
          time: d.time,
          value: d.volume,
          color:
            d.close >= d.open
              ? 'rgba(34, 197, 94, 0.25)'
              : 'rgba(239, 68, 68, 0.25)',
        }))
      );
      seriesRefs.current.push(volSeries as unknown as ISeriesApi<SeriesType>);
    }

    // SMA overlay
    if (activeIndicators.includes('sma') && getStockData(selectedSymbol)) {
      const closes = history.map((d) => d.close);
      for (const period of [20, 50]) {
        const smaData = closes
          .map((_, i) => {
            if (i < period - 1) return null;
            const slice = closes.slice(i - period + 1, i + 1);
            return {
              time: history[i].time,
              value: +(slice.reduce((a, b) => a + b, 0) / period).toFixed(2),
            };
          })
          .filter(Boolean) as { time: string; value: number }[];

        const smaSeries = chart.addSeries(LineSeries, {
          color: period === 20 ? '#f97316' : '#8b5cf6',
          lineWidth: 1,
          title: `SMA ${period}`,
        });
        smaSeries.setData(smaData);
        seriesRefs.current.push(smaSeries as unknown as ISeriesApi<SeriesType>);
      }
    }

    // EMA overlay
    if (activeIndicators.includes('ema')) {
      const closes = history.map((d) => d.close);
      for (const period of [12, 26]) {
        const k = 2 / (period + 1);
        const emaData: { time: string; value: number }[] = [];
        let emaVal = closes[0];
        for (let i = 0; i < closes.length; i++) {
          emaVal = closes[i] * k + emaVal * (1 - k);
          emaData.push({ time: history[i].time, value: +emaVal.toFixed(2) });
        }
        const emaSeries = chart.addSeries(LineSeries, {
          color: period === 12 ? '#06b6d4' : '#ec4899',
          lineWidth: 1,
          title: `EMA ${period}`,
        });
        emaSeries.setData(emaData);
        seriesRefs.current.push(emaSeries as unknown as ISeriesApi<SeriesType>);
      }
    }

    // Bollinger Bands
    if (activeIndicators.includes('bollinger')) {
      const closes = history.map((d) => d.close);
      const period = 20;
      const upperData: { time: string; value: number }[] = [];
      const lowerData: { time: string; value: number }[] = [];

      for (let i = period - 1; i < closes.length; i++) {
        const slice = closes.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const std = Math.sqrt(
          slice.reduce((s, c) => s + (c - mean) ** 2, 0) / period
        );
        upperData.push({
          time: history[i].time,
          value: +(mean + 2 * std).toFixed(2),
        });
        lowerData.push({
          time: history[i].time,
          value: +(mean - 2 * std).toFixed(2),
        });
      }

      const upperSeries = chart.addSeries(LineSeries, {
        color: 'rgba(139, 92, 246, 0.5)',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Upper',
      });
      upperSeries.setData(upperData);
      seriesRefs.current.push(upperSeries as unknown as ISeriesApi<SeriesType>);

      const lowerSeries = chart.addSeries(LineSeries, {
        color: 'rgba(139, 92, 246, 0.5)',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Lower',
      });
      lowerSeries.setData(lowerData);
      seriesRefs.current.push(lowerSeries as unknown as ISeriesApi<SeriesType>);
    }

    // Compare symbols
    const compareColors = ['#f97316', '#06b6d4', '#ec4899', '#eab308'];
    compareSymbols.forEach((sym, idx) => {
      const compHistory = getStockHistory(sym, timeRange);
      if (!compHistory.length) return;

      const basePrice = history[0]?.close || 1;
      const compBasePrice = compHistory[0]?.close || 1;

      const compSeries = chart.addSeries(LineSeries, {
        color: compareColors[idx % compareColors.length],
        lineWidth: 2,
        title: sym,
      });
      compSeries.setData(
        compHistory.map((d) => ({
          time: d.time,
          value: (d.close / compBasePrice) * basePrice,
        }))
      );
      seriesRefs.current.push(compSeries as unknown as ISeriesApi<SeriesType>);
    });

    chart.timeScale().fitContent();

    // Resize handler
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedSymbol, timeRange, chartType, activeIndicators, compareSymbols]);

  useEffect(() => {
    const cleanup = buildChart();
    return () => {
      cleanup?.();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [buildChart]);

  return (
    <div className="chart-area">
      <div ref={containerRef} className="chart-container" />
    </div>
  );
}
