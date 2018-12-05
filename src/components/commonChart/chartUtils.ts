import { AwsReport } from 'api/awsReports';
import { OcpReport } from 'api/ocpReports';
import format from 'date-fns/format';
import getDate from 'date-fns/get_date';
import startOfMonth from 'date-fns/start_of_month';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
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
  key: any = 'date'
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
    return computedItems.map(i => createDatum(i.total, i, key));
  }
  if (type === ChartType.monthly) {
    return computedItems.map(i => createDatum(i.total, i, key));
  }

  return computedItems.reduce<ChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d.total, d, key)];
  }, []);
}

export function transformOcpReport(
  report: OcpReport,
  type: ChartType = ChartType.daily,
  reportItem: any = 'charge',
  key: any = 'date'
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
  const idKey = reportItem === 'charge' ? key : ''; // Uses computed item label instead of day for x value

  if (type === ChartType.daily) {
    return computedItems.map(i => createDatum(i[reportItem], i, idKey));
  }
  if (type === ChartType.monthly) {
    return computedItems.map(i => createDatum(i[reportItem], i, idKey));
  }

  return computedItems.reduce<ChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d[reportItem], d, idKey)];
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

export function getDateRangeString(datums: ChartDatum[]) {
  const [start, end] = getDatumDateRange(datums);
  const monthName = format(start, 'MMM');
  const startDate = getDate(start);
  const endDate = getDate(end);
  return `${monthName} ${getDate(start)}${
    startDate !== endDate ? ` - ${endDate}` : ''
  }`;
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
