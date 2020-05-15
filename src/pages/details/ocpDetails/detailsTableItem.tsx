import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import { BulletChart } from 'pages/details/components/bulletChart/bulletChart';
import { Cluster } from 'pages/details/components/cluster/cluster';
import { HistoricalModal } from 'pages/details/components/historicalChart/historicalModal';
import { Tag } from 'pages/details/components/tag/tag';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { styles } from './detailsTableItem.styles';
import { HistoricalChart } from './historicalChart';
import { Summary } from './summary';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsTableItemState {
  isHistoricalModalOpen: boolean;
}

type DetailsTableItemProps = DetailsTableItemOwnProps & WrappedComponentProps;

const reportPathsType = ReportPathsType.ocp;

class DetailsTableItemBase extends React.Component<DetailsTableItemProps> {
  public state: DetailsTableItemState = {
    isHistoricalModalOpen: false,
  };

  constructor(props: DetailsTableItemProps) {
    super(props);
    this.handleHistoricalModalClose = this.handleHistoricalModalClose.bind(
      this
    );
    this.handleHistoricalModalOpen = this.handleHistoricalModalOpen.bind(this);
  }

  public handleHistoricalModalClose = (isOpen: boolean) => {
    this.setState({ isHistoricalModalOpen: isOpen });
  };

  public handleHistoricalModalOpen = () => {
    this.setState({ isHistoricalModalOpen: true });
  };

  public render() {
    const { item, groupBy, intl } = this.props;
    const { isHistoricalModalOpen } = this.state;

    return (
      <>
        <Grid>
          <GridItem sm={12}>
            <div style={styles.historicalContainer}>
              <Button
                {...getTestProps(testIds.details.historical_data_btn)}
                onClick={this.handleHistoricalModalOpen}
                type={ButtonType.button}
                variant={ButtonVariant.secondary}
              >
                {intl.formatMessage({ id: 'ocp_details.historical.view_data' })}
              </Button>
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div style={styles.leftPane}>
              {Boolean(groupBy !== 'cluster') && (
                <div style={styles.clusterContainer}>
                  <Form>
                    <FormGroup
                      label={intl.formatMessage({
                        id: 'ocp_details.cluster_label',
                      })}
                      fieldId="cluster-name"
                    >
                      <Cluster groupBy={groupBy} item={item} />
                    </FormGroup>
                  </Form>
                </div>
              )}
              {Boolean(groupBy === 'cluster') && (
                <Summary groupBy={groupBy} item={item} />
              )}
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div style={styles.rightPane}>
              {Boolean(groupBy === 'project') && (
                <div style={styles.tagsContainer}>
                  <Form>
                    <FormGroup
                      label={intl.formatMessage({
                        id: 'ocp_details.tags_label',
                      })}
                      fieldId="tags"
                    >
                      <Tag
                        groupBy={groupBy}
                        id="tags"
                        item={item}
                        account={item.label || item.id}
                        reportPathsType={reportPathsType}
                      />
                    </FormGroup>
                  </Form>
                </div>
              )}
              <BulletChart
                groupBy={groupBy}
                item={item}
                reportPathsType={reportPathsType}
              />
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
          chartComponent={<HistoricalChart />}
          groupBy={groupBy}
          isOpen={isHistoricalModalOpen}
          item={item}
          onClose={this.handleHistoricalModalClose}
          reportPathsType={reportPathsType}
        />
      </>
    );
  }
}

const DetailsTableItem = injectIntl(connect()(DetailsTableItemBase));

export { DetailsTableItem, DetailsTableItemProps };
