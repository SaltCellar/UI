import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';

import { OcpCostOverviewWidget } from './ocpCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: OcpCostOverviewWidget = {
  id: getId(),
  cluster: {
    reportGroupBy: 'project',
    showWidgetOnGroupBy: ['project'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cluster,
};

export const costWidget: OcpCostOverviewWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const cpuUsageWidget: OcpCostOverviewWidget = {
  id: getId(),
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: OcpCostOverviewWidget = {
  id: getId(),
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: OcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    showWidgetOnGroupBy: ['cluster'],
    usePlaceholder: true,
  },
  reportType: ReportType.cost,
  reportPathsType: ReportPathsType.ocp,
  type: CostOverviewWidgetType.reportSummary,
};
