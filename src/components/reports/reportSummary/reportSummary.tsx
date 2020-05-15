import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Title,
} from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FetchStatus } from 'store/common';
import { styles } from './reportSummary.styles';

interface ReportSummaryProps extends WrappedComponentProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  title: string;
}

const ReportSummaryBase: React.SFC<ReportSummaryProps> = ({
  children,
  detailsLink,
  title,
  subTitle,
  status,
  intl,
}) => (
  <Card style={styles.reportSummary}>
    <CardHeader>
      <Title size="lg">{title}</Title>
      {Boolean(subTitle) && <p style={styles.subtitle}>{subTitle}</p>}
    </CardHeader>
    <CardBody>
      {status === FetchStatus.inProgress ? (
        <>
          <Skeleton size={SkeletonSize.xs} />
          <Skeleton style={styles.chartSkeleton} size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.sm} />
          <Skeleton style={styles.legendSkeleton} size={SkeletonSize.xs} />
        </>
      ) : (
        children
      )}
    </CardBody>
    {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
  </Card>
);

const ReportSummary = injectIntl(ReportSummaryBase);

export { ReportSummary, ReportSummaryProps };
