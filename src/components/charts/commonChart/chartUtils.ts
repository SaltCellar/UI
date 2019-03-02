import { AwsReport } from 'api/awsReports';
import { OcpReport } from 'api/ocpReports';
import endOfMonth from 'date-fns/end_of_month';
import format from 'date-fns/format';
import getDate from 'date-fns/get_date';
import startOfMonth from 'date-fns/start_of_month';
import i18next from 'i18next';
import {
  FormatOptions,
  unitLookupKey,
  ValueFormatter,
} from 'utils/formatValue';
import {
  ComputedAwsReportItem,
  getComputedAwsReportItems,
} from 'utils/getComputedAwsReportItems';
import {
  ComputedOcpReportItem,
  getComputedOcpReportItems,
} from 'utils/getComputedOcpReportItems';
import { SortDirection } from 'utils/sort';

export interface ChartDatum {
  x: string | number;
  y: number;
  key: string | number;
  name?: string | number;
  show?: boolean;
  units: string;
}

export const enum ChartType {
  rolling,
  daily,
  monthly,
}

export function transformAwsReport(
  report: AwsReport,
  type: ChartType = ChartType.daily,
  key: any = 'date',
  reportItem: any = 'total'
): ChartDatum[] {
  if (!report) {
    return [];
  }
  const items = {
    report,
    idKey: key,
    sortKey: 'id',
    sortDirection: SortDirection.desc,
  } as any;
  const computedItems = getComputedAwsReportItems(items);
  if (type === ChartType.daily) {
    return computedItems.map(i => createDatum(i[reportItem], i, key));
  }
  if (type === ChartType.monthly) {
    return computedItems.map(i => createDatum(i[reportItem], i, key));
  }

  return computedItems.reduce<ChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d[reportItem], d, key)];
  }, []);
}

export function transformOcpReport(
  report: OcpReport,
  type: ChartType = ChartType.daily,
  key: any = 'date',
  reportItem: any = 'cost'
): ChartDatum[] {
  if (!report) {
    return [];
  }
  const items = {
    report,
    idKey: key,
    sortKey: 'id',
    sortDirection: SortDirection.desc,
  } as any;
  const computedItems = getComputedOcpReportItems(items);

  if (type === ChartType.daily) {
    return computedItems.map(i => createDatum(i[reportItem], i, key));
  }
  if (type === ChartType.monthly) {
    return computedItems.map(i => createDatum(i[reportItem], i, key));
  }

  return computedItems.reduce<ChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d[reportItem], d, key)];
  }, []);
}

export function createDatum(
  value: number,
  computedItem: ComputedAwsReportItem | ComputedOcpReportItem,
  idKey = 'date'
): ChartDatum {
  const xVal = idKey === 'date' ? getDate(computedItem.id) : computedItem.label;
  const yVal = isFloat(value)
    ? parseFloat(value.toFixed(2))
    : isInt(value)
    ? value
    : 0;
  return {
    x: xVal,
    y: yVal,
    key: computedItem.id,
    name: computedItem.id,
    units: computedItem.units,
  };
}

export function getDatumDateRange(datums: ChartDatum[]): [Date, Date] {
  if (!(datums && datums.length)) {
    const today = new Date();
    const firstOfMonth = startOfMonth(today);
    return [firstOfMonth, today];
  }

  const start = new Date(datums[0].key + 'T00:00:00');
  const end = new Date(datums[datums.length - 1].key + 'T00:00:00');
  return [start, end];
}

export function getDateRange(
  datums: ChartDatum[],
  firstOfMonth: boolean = true,
  lastOfMonth: boolean = false
): [Date, Date] {
  const [start, end] = getDatumDateRange(datums);

  // Show the date range we are trying to cover (i.e., days 1-30/31)
  if (firstOfMonth && start.setDate) {
    start.setDate(1);
  }
  if (lastOfMonth && start.setDate) {
    const lastDate = endOfMonth(start).getDate();
    end.setDate(lastDate);
  }
  return [start, end];
}

export function getDateRangeString(
  datums: ChartDatum[],
  firstOfMonth: boolean = false,
  lastOfMonth: boolean = false,
  current: boolean = false
) {
  const [start, end] = getDateRange(datums, firstOfMonth, lastOfMonth);

  const monthName = format(start, 'MMM');
  const startDate = getDate(start);
  const endDate = getDate(end);

  if (current) {
    return i18next.t(`date.range_current`, {
      date: getDateString(startDate),
      month: startDate !== endDate ? monthName : '',
    });
  }
  return i18next.t(`date.range_full`, {
    endDate: getDateString(endDate),
    startDate: getDateString(startDate),
    month: startDate !== endDate ? monthName : '',
  });
}

export function getMaxValue(datums: ChartDatum[]) {
  let max = 0;
  if (datums && datums.length) {
    datums.forEach(datum => {
      if (datum.y > max) {
        max = datum.y;
      }
    });
  }
  return max;
}

export function getTooltipContent(formatValue) {
  return function labelFormatter(
    value: number,
    unit: string = null,
    options: FormatOptions = {}
  ) {
    const lookup = unitLookupKey(unit);
    switch (lookup) {
      case 'hrs':
      case 'gb':
        return i18next.t(`units.${lookup}`, {
          value: `${formatValue(value, unit, options)}`,
        });
      default:
        return `${formatValue(value, unit, options)}`;
    }
  };
}

export function getTooltipLabel(
  datum: ChartDatum,
  formatValue: ValueFormatter,
  formatOptions?: FormatOptions,
  idKey: any = 'date'
) {
  if (!datum.key) {
    return '';
  }
  if (idKey === 'date') {
    const date = format(datum.key, 'MMM D YYYY');
    return `${date}: ${formatValue(datum.y, datum.units, formatOptions)}`;
  }
  return datum.key.toString();
}

function isInt(n) {
  return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function getDateString(date) {
  const day = date % 10;
  if (day === 1) {
    return i18next.t(`date.first`, { date });
  } else if (day === 2) {
    return i18next.t(`date.second`, { date });
  } else if (day === 3) {
    return i18next.t(`date.third`, { date });
  }
  return i18next.t(`date.tenth`, { date });
}
