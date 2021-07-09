import './reportSummaryItem.scss';

import { Progress, ProgressSize } from '@patternfly/react-core';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';

interface ReportSummaryItemProps {
  formatValue: ValueFormatter;
  formatOptions?: FormatOptions;
  label: string;
  totalValue: number;
  units: string;
  value: number;
}

const ReportSummaryItemBase: React.SFC<ReportSummaryItemProps> = ({
  label,
  formatOptions,
  formatValue,
  totalValue,
  units,
  value,
}) => {
  const intl = createIntlEnv();
  const lookup = unitLookupKey(units);
  const unitsLabel = lookup !== 'usd' ? intl.formatMessage(messages.Units, { units: lookup }) : undefined;
  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = Number(percent.toFixed(2));
  const percentLabel = intl.formatMessage(messages.PercentTotalCost, {
    percent: percentVal,
    unit: unitsLabel,
    value: formatValue(value, units, formatOptions),
  });

  return (
    <li className="reportSummaryItem">
      <Progress label={percentLabel} value={percentVal} title={label} size={ProgressSize.sm} />
    </li>
  );
};

ReportSummaryItemBase.defaultProps = {
  formatValue: v => v,
};

const ReportSummaryItem = ReportSummaryItemBase;

export { ReportSummaryItem, ReportSummaryItemProps };
