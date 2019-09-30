import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import {
  ComputedOcpReportItem,
  getComputedOcpReportItems,
  GetComputedOcpReportItemsParams,
} from 'utils/getComputedOcpReportItems';
import { styles } from './ocpReportSummaryItems.styles';

interface OcpReportSummaryItemsRenderProps {
  items: ComputedOcpReportItem[];
}

interface OcpReportSummaryItemsOwnProps
  extends GetComputedOcpReportItemsParams {
  children?(props: OcpReportSummaryItemsRenderProps): React.ReactNode;
  status: number;
}

type OcpReportSummaryItemsProps = OcpReportSummaryItemsOwnProps &
  InjectedTranslateProps;

class OcpReportSummaryItemsBase extends React.Component<
  OcpReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: OcpReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedOcpReportItems({
      report,
      idKey,
      labelKey,
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
          <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
          <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
          <Skeleton size={SkeletonSize.md} className={css(styles.skeleton)} />
        </>
      );
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const OcpReportSummaryItems = translate()(OcpReportSummaryItemsBase);

export {
  OcpReportSummaryItems,
  OcpReportSummaryItemsProps,
  OcpReportSummaryItemsRenderProps,
};
