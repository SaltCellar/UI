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
import { HistoricalModal } from 'pages/details/components/historicalChart/historicalModal';
import { Tag } from 'pages/details/components/tag/tag';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { DetailsSummary } from './detailsSummary';
import { styles } from './detailsTableItem.styles';

interface DetailsTableItemOwnProps {
  groupBy: string;
  item: ComputedReportItem;
}

interface DetailsTableItemState {
  isHistoricalModalOpen: boolean;
}

type DetailsTableItemProps = DetailsTableItemOwnProps & WrappedComponentProps;

const reportPathsType = ReportPathsType.azure;

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
                {intl.formatMessage({
                  id: 'azure_details.historical.view_data',
                })}
              </Button>
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div style={styles.leftPane}>
              <DetailsSummary
                groupBy={groupBy}
                item={item}
                reportPathsType={reportPathsType}
              />
            </div>
          </GridItem>
          <GridItem lg={12} xl={6}>
            <div style={styles.rightPane}>
              {Boolean(groupBy === 'subscription_guid') && (
                <div style={styles.tagsContainer}>
                  <Form>
                    <FormGroup
                      label={intl.formatMessage({
                        id: 'azure_details.tags_label',
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
            </div>
          </GridItem>
        </Grid>
        <HistoricalModal
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

const mapStateToProps = createMapStateToProps<DetailsTableItemOwnProps, {}>(
  state => {
    return {};
  }
);

const DetailsTableItem = injectIntl(
  connect(mapStateToProps, {})(DetailsTableItemBase)
);

export { DetailsTableItem, DetailsTableItemProps };
