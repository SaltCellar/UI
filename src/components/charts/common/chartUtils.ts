import { getInteractiveLegendItemStyles } from '@patternfly/react-charts';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory-core';

import { getMaxMinValues, getTooltipContent } from './chartDatumUtils';

export interface ChartData {
  childName?: string;
  units?: string;
}

export interface ChartLegendItem {
  childName?: string;
  name?: string;
  symbol?: any;
  tooltip?: string;
}

export interface ChartSeries {
  childName?: string;
  data?: [ChartData];
  isBar?: boolean; // Used with daily charts
  isForecast?: boolean; // Used with daily charts
  isLine?: boolean; // Used with daily charts
  legendItem?: ChartLegendItem;
  style?: VictoryStyleInterface;
}

const intl = createIntlEnv();

// Returns groups of chart names associated with each data series
export const getChartNames = (series: ChartSeries[]) => {
  const result = [];

  if (series) {
    series.map(serie => {
      // Each group of chart names are hidden / shown together
      result.push(serie.childName);
    });
  }
  return result as any;
};

export const getDomain = (series: ChartSeries[], hiddenSeries: Set<number>) => {
  const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };
  let maxValue = -1;
  let minValue = -1;

  if (series) {
    series.forEach((s: any, index) => {
      if (!isSeriesHidden(hiddenSeries, index) && s.data && s.data.length !== 0) {
        const { max, min } = getMaxMinValues(s.data);
        maxValue = Math.max(maxValue, max);
        if (minValue === -1) {
          minValue = min;
        } else {
          minValue = Math.min(minValue, min);
        }
      }
    });
  }

  const threshold = maxValue * 0.1;
  const max = maxValue > 0 ? Math.ceil(maxValue + threshold) : 0;
  const _min = minValue > 0 ? Math.max(0, Math.floor(minValue - threshold)) : 0;
  const min = _min > 0 ? _min : 0;

  if (max > 0) {
    domain.y = [min, max];
  }
  return domain;
};

// Returns legend data styled per hiddenSeries
export const getLegendData = (series: ChartSeries[], hiddenSeries: Set<number>, tooltip: boolean = false) => {
  if (!series) {
    return undefined;
  }
  const result = series.map((s, index) => {
    const data = {
      childName: s.childName,
      ...s.legendItem, // name property
      ...(tooltip && { name: s.legendItem.tooltip }), // Override name property for tooltip
      ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
    };
    return data;
  });
  return result;
};

// Note: Forecast is expected to use both datum.y and datum.y0
export const getTooltipLabel = (datum: any, formatDatumValue: ValueFormatter, formatDatumOptions: FormatOptions) => {
  const formatter = getTooltipContent(formatDatumValue);
  const dy =
    datum.y !== undefined && datum.y !== null ? formatter(datum.y, datum.units, formatDatumOptions) : undefined;
  const dy0 =
    datum.y0 !== undefined && datum.y0 !== null ? formatter(datum.y0, datum.units, formatDatumOptions) : undefined;

  if (dy !== undefined && dy0 !== undefined) {
    return intl.formatMessage(messages.ChartCostForecastConeTooltip, { value0: dy0, value1: dy });
  }
  return dy !== undefined ? dy : intl.formatMessage(messages.ChartNoData);
};

export const getResizeObserver = (containerRef: HTMLDivElement, handleResize: () => void) => {
  const containerElement = containerRef;
  const { ResizeObserver } = window as any;
  let _navToggle;
  let _resizeObserver;

  if (containerElement && ResizeObserver) {
    const resizeObserver = new ResizeObserver(entries => {
      // We wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        handleResize();
      });
    });
    resizeObserver.observe(containerElement);
    _resizeObserver = () => resizeObserver.unobserve(containerElement);
  } else {
    handleResize();
    window.addEventListener('resize', handleResize);
    _resizeObserver = () => window.removeEventListener('resize', handleResize);
    _navToggle = insights.chrome.on('NAVIGATION_TOGGLE', setTimeout(handleResize, 500));
  }

  return () => {
    if (_resizeObserver) {
      _resizeObserver();
    }
    if (_navToggle) {
      _navToggle();
    }
  };
};

export const initHiddenSeries = (series: ChartSeries[], hiddenSeries: Set<number>, index: number) => {
  const result = new Set(hiddenSeries);
  if (!result.delete(index)) {
    result.add(index);
  }
  return result;
};

// Returns true if at least one data series is available
export const isDataAvailable = (series: ChartSeries[], hiddenSeries: Set<number>) => {
  const unavailable = []; // API data may not be available (e.g., on 1st of month)

  if (series) {
    series.forEach((s: any, index) => {
      if (isSeriesHidden(hiddenSeries, index) || (s.data && s.data.length === 0)) {
        unavailable.push(index);
      }
    });
  }
  return unavailable.length !== (series ? series.length : 0);
};

// Returns true if data series is hidden
export const isDataHidden = (series: ChartSeries[], hiddenSeries: Set<number>, data: any) => {
  if (data && data.length) {
    for (let keys = hiddenSeries.keys(), key; !(key = keys.next()).done; ) {
      let dataChildName;
      let serieChildName;

      for (const item of data) {
        if (item.childName) {
          dataChildName = item.childName;
          break;
        }
      }
      for (const item of series[key.value].data) {
        if (item.childName) {
          serieChildName = item.childName;
          break;
        }
      }
      if (serieChildName && dataChildName && serieChildName === dataChildName) {
        return true;
      }
    }
  }
  return false;
};

// Returns true if data series is hidden
export const isSeriesHidden = (hiddenSeries: Set<number>, index: number) => {
  return hiddenSeries.has(index);
};
