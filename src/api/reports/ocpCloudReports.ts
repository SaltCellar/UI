import axios from 'axios';
import { Omit } from 'react-redux';
import {
  Report,
  ReportCostTypeDatum,
  ReportData,
  ReportDatum,
  ReportMeta,
  ReportType,
  ReportValue,
} from './report';

// Todo: Remove capacity, limit, & request?
export interface OcpCloudReportValue extends ReportValue {
  account?: string;
  account_alias?: string;
  capacity?: ReportDatum;
  cluster?: string;
  clusters?: string[];
  instance_type?: string;
  limit?: ReportDatum;
  node?: string;
  project?: string;
  region?: string;
  request?: ReportDatum;
  service?: string;
}

export interface GroupByAccountData
  extends Omit<OcpCloudReportData, 'accounts'> {
  account: string;
}

export interface GroupByClusterData
  extends Omit<OcpCloudReportData, 'clusters'> {
  service: string;
}

export interface GroupByInstanceTypeData
  extends Omit<OcpCloudReportData, 'instance_types'> {
  instance_type: string;
}

export interface GroupByNodeData extends Omit<OcpCloudReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpCloudReportData, 'projects'> {
  account: string;
}

export interface GroupByRegionData extends Omit<OcpCloudReportData, 'regions'> {
  region: string;
}

export interface GroupByServiceData
  extends Omit<OcpCloudReportData, 'services'> {
  service: string;
}

export interface OcpCloudReportData extends ReportData {
  accounts?: GroupByAccountData[];
  clusters?: GroupByClusterData[];
  instance_types?: GroupByInstanceTypeData[];
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  regions?: GroupByRegionData[];
  services?: GroupByServiceData[];
}

export interface OcpCloudReportMeta extends ReportMeta {
  total?: {
    cost: ReportCostTypeDatum;
    infrastructure: ReportCostTypeDatum;
    supplementary: ReportCostTypeDatum;
    capacity?: ReportDatum;
    limit?: ReportDatum;
    request?: ReportDatum;
    usage?: ReportDatum;
  };
}

export interface OcpCloudReport extends Report {
  meta: OcpCloudReportMeta;
  data: OcpCloudReportData[];
}

export const ReportTypePaths: Partial<Record<ReportType, string>> = {
  [ReportType.cost]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.cpu]: 'reports/openshift/compute/',
  [ReportType.database]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.instanceType]:
    'reports/openshift/infrastructures/all/instance-types/',
  [ReportType.memory]: 'reports/openshift/memory/',
  [ReportType.network]: 'reports/openshift/infrastructures/all/costs/',
  [ReportType.storage]: 'reports/openshift/infrastructures/all/storage/',
  [ReportType.tag]: 'tags/openshift/infrastructures/all/',
  [ReportType.volume]: 'reports/openshift/volumes/',
};

export function runReport(reportType: ReportType, query: string) {
  const path = ReportTypePaths[reportType];
  return axios.get<OcpCloudReport>(`${path}?${query}`);
}
