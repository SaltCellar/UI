import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { getQuery, parseQuery, Query, tagKeyPrefix } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { uniq, uniqBy } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { intl } from '../../../../components/i18nProvider';
import { styles } from './groupBy.styles';

interface GroupByOwnProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onItemClicked(value: string);
  options: {
    label: string;
    value: string;
  }[];
  queryString?: string;
  reportPathsType: ReportPathsType;
}

interface GroupByStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface GroupByDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface GroupByState {
  currentItem?: string;
  defaultItem: string;
  isGroupByOpen: boolean;
}

type GroupByProps = GroupByOwnProps & GroupByStateProps & GroupByDispatchProps;

const reportType = ReportType.tag;

class GroupByBase extends React.Component<GroupByProps> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByOpen: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleGroupByClick = this.handleGroupByClick.bind(this);
    this.handleGroupBySelect = this.handleGroupBySelect.bind(this);
    this.handleGroupByToggle = this.handleGroupByToggle.bind(this);
  }

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
    this.setState({
      currentItem: this.getGroupBy(),
    });
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const { fetchReport, groupBy, queryString, reportPathsType } = this.props;
    if (
      prevProps.queryString !== queryString ||
      prevProps.groupBy !== groupBy
    ) {
      fetchReport(reportPathsType, reportType, queryString);
      this.setState({ currentItem: this.getGroupBy() });
    }
  }

  public handleGroupByClick = value => {
    const { onItemClicked } = this.props;
    if (onItemClicked) {
      this.setState({
        currentItem: value,
      });
      onItemClicked(value);
    }
  };

  private getDropDownItems = () => {
    const { options } = this.props;

    return options.map(option => (
      <DropdownItem
        component="button"
        key={option.value}
        onClick={() => this.handleGroupByClick(option.value)}
      >
        {intl.formatMessage({ id: `group_by.values.${option.label}` })}
      </DropdownItem>
    ));
  };

  private getDropDownTags = () => {
    const { report } = this.props;

    if (!(report && report.data)) {
      return [];
    }

    // If the key_only param is used, we have an array of strings
    let hasTagKeys = false;
    for (const item of report.data) {
      if (item.hasOwnProperty('key')) {
        hasTagKeys = true;
        break;
      }
    }

    // Workaround for https://github.com/project-koku/koku/issues/1797
    let data = [];
    if (hasTagKeys) {
      const keepData = report.data.map(
        ({ type, ...keepProps }: any) => keepProps
      );
      data = uniqBy(keepData, 'key');
    } else {
      data = uniq(report.data);
    }

    return data.map(tag => {
      const tagKey = hasTagKeys ? tag.key : tag;
      return (
        <DropdownItem
          component="button"
          key={`${tagKeyPrefix}${tag.key}`}
          onClick={() => this.handleGroupByClick(`${tagKeyPrefix}${tagKey}`)}
        >
          {intl.formatMessage({ id: 'group_by.tag_key' }, { value: tagKey })}
        </DropdownItem>
      );
    });
  };

  private getGroupBy = () => {
    const { getIdKeyForGroupBy } = this.props;
    const { defaultItem } = this.state;
    const queryFromRoute = parseQuery<Query>(location.search);

    if (!(queryFromRoute && queryFromRoute.group_by)) {
      return defaultItem;
    }

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys =
      queryFromRoute && queryFromRoute.group_by
        ? Object.keys(queryFromRoute.group_by)
        : [];

    for (const key of groupByKeys) {
      const index = key.indexOf(tagKeyPrefix);
      if (index !== -1) {
        groupBy = key;
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : defaultItem;
  };

  private handleGroupBySelect = event => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  private handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  public render() {
    const { isDisabled = false } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const dropdownItems = [
      ...this.getDropDownItems(),
      ...this.getDropDownTags(),
    ];

    const index = currentItem ? currentItem.indexOf(tagKeyPrefix) : -1;
    const label =
      index !== -1
        ? intl.formatMessage(
            { id: 'group_by.tag_key' },
            {
              value: currentItem.slice(tagKeyPrefix.length),
            }
          )
        : intl.formatMessage({ id: `group_by.values.${currentItem}` });

    return (
      <div style={styles.groupBySelector}>
        <label style={styles.groupBySelectorLabel}>
          {intl.formatMessage({ id: 'group_by.cost' })}:
        </label>
        <Dropdown
          onSelect={this.handleGroupBySelect}
          toggle={
            <DropdownToggle
              isDisabled={isDisabled}
              onToggle={this.handleGroupByToggle}
            >
              {label}
            </DropdownToggle>
          }
          isOpen={isGroupByOpen}
          dropdownItems={dropdownItems}
        />
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  GroupByOwnProps,
  GroupByStateProps
>((state, { reportPathsType }) => {
  const queryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    // key_only: true
  });
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  return {
    queryString,
    report,
    reportFetchStatus,
  };
});

const mapDispatchToProps: GroupByDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const GroupBy = connect(mapStateToProps, mapDispatchToProps)(GroupByBase);

export { GroupBy, GroupByProps };
