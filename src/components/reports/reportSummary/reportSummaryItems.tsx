import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { Report, ReportValue } from 'api/reports/report';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FetchStatus } from 'store/common';
import {
  ComputedReportItem,
  ComputedReportItemsParams,
  getComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import { styles } from './reportSummaryItems.styles';

interface ReportSummaryItemsRenderProps {
  items: ComputedReportItem[];
}

interface ReportSummaryItemsOwnProps
  extends ComputedReportItemsParams<Report, ReportValue> {
  computedReportItemValue?: string;
  children?(props: ReportSummaryItemsRenderProps): React.ReactNode;
  status?: number;
}

type ReportSummaryItemsProps = ReportSummaryItemsOwnProps &
  WrappedComponentProps;

class ReportSummaryItemsBase extends React.Component<ReportSummaryItemsProps> {
  public shouldComponentUpdate(nextProps: ReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const {
      computedReportItemValue = 'total',
      idKey,
      labelKey,
      report,
    } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey,
      labelKey,
      reportItemValue: computedReportItemValue,
    });

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    if (otherIndex !== -1) {
      return [
        ...computedItems.slice(0, otherIndex),
        ...computedItems.slice(otherIndex + 1),
        computedItems[otherIndex],
      ];
    }

    return computedItems;
  }

  public render() {
    const { children, status } = this.props;

    if (status === FetchStatus.inProgress) {
      return (
        <>
          <Skeleton size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
          <Skeleton size={SkeletonSize.md} style={styles.skeleton} />
        </>
      );
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const ReportSummaryItems = injectIntl(ReportSummaryItemsBase);

export {
  ReportSummaryItems,
  ReportSummaryItemsProps,
  ReportSummaryItemsRenderProps,
};
