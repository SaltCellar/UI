import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  GridItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { styles } from './ocpReportSummaryAlt.styles';

interface OcpReportSummaryAltProps extends InjectedTranslateProps {
  children?: React.ReactNode;
  detailsLink?: React.ReactNode;
  status: number;
  subTitle?: string;
  subTitleTooltip?: string;
  tabs?: React.ReactNode;
  title: string;
}

const OcpReportSummaryAltBase: React.SFC<OcpReportSummaryAltProps> = ({
  children,
  detailsLink,
  status,
  subTitle,
  subTitleTooltip = subTitle,
  t,
  tabs,
  title,
}) => (
  <Card className={css(styles.reportSummary)}>
    <Grid gutter="md">
      <GridItem lg={5} xl={6}>
        <div className={css(styles.cost)}>
          <CardHeader>
            <Title size="lg">{title}</Title>
            {Boolean(subTitle) && (
              <Tooltip content={subTitleTooltip} enableFlip>
                <p className={css(styles.subtitle)}>{subTitle}</p>
              </Tooltip>
            )}
          </CardHeader>
          <CardBody>
            {status === FetchStatus.inProgress ? (
              <>
                <Skeleton size={SkeletonSize.xs} />
                <Skeleton
                  size={SkeletonSize.md}
                  className={css(styles.chartSkeleton)}
                />
                <Skeleton size={SkeletonSize.sm} />
                <Skeleton
                  size={SkeletonSize.xs}
                  className={css(styles.legendSkeleton)}
                />
              </>
            ) : (
              children
            )}
          </CardBody>
        </div>
      </GridItem>
      <GridItem lg={7} xl={6}>
        <div className={css(styles.container)}>
          <div className={css(styles.tops)}>
            {status !== FetchStatus.inProgress && (
              <>
                {Boolean(tabs) && <CardBody>{tabs}</CardBody>}
                {Boolean(detailsLink) && <CardFooter>{detailsLink}</CardFooter>}
              </>
            )}
          </div>
        </div>
      </GridItem>
    </Grid>
  </Card>
);

const OcpReportSummaryAlt = translate()(OcpReportSummaryAltBase);

export { OcpReportSummaryAlt, OcpReportSummaryAltProps };
