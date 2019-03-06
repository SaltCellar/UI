import axios from 'axios';
import { Omit } from 'react-redux';

export interface OcpOnAwsDatum {
  value: number;
  units: string;
}

// Todo: Remove capacity, limit, & request?
export interface OcpOnAwsReportValue {
  capacity?: OcpOnAwsDatum;
  cost?: OcpOnAwsDatum;
  cluster?: string;
  cluster_alias?: string;
  count?: OcpOnAwsDatum;
  date: string;
  delta_percent?: number;
  delta_value?: number;
  limit?: OcpOnAwsDatum;
  node?: string;
  project?: string;
  request?: OcpOnAwsDatum;
  usage: OcpOnAwsDatum;
}

export interface GroupByClusterData
  extends Omit<OcpOnAwsReportData, 'clusters'> {
  service: string;
}

export interface GroupByNodeData extends Omit<OcpOnAwsReportData, 'nodes'> {
  region: string;
}

export interface GroupByProjectData
  extends Omit<OcpOnAwsReportData, 'projects'> {
  account: string;
}

export interface OcpOnAwsReportData {
  clusters?: GroupByClusterData[];
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  nodes?: GroupByNodeData[];
  projects?: GroupByProjectData[];
  values?: OcpOnAwsReportValue[];
}

export interface OcpOnAwsReportMeta {
  delta?: {
    percent: number;
    value: number;
  };
  group_by?: {
    [group: string]: string[];
  };
  order_by?: {
    [order: string]: string;
  };
  filter?: {
    [filter: string]: any;
  };
  total?: {
    usage?: OcpOnAwsDatum;
    request?: OcpOnAwsDatum;
    limit?: OcpOnAwsDatum;
    capacity?: OcpOnAwsDatum;
    cost: OcpOnAwsDatum;
  };
  count: number;
}

export interface OcpOnAwsReportLinks {
  first: string;
  previous?: string;
  next?: string;
  last: string;
}

export interface OcpOnAwsReport {
  meta: OcpOnAwsReportMeta;
  links: OcpOnAwsReportLinks;
  data: OcpOnAwsReportData[];
}

export const enum OcpOnAwsReportType {
  cost = 'cost',
  cpu = 'cpu',
  instanceType = 'instance_type',
  memory = 'memory',
  storage = 'storage',
  tag = 'tag',
}

export const ocpOnAwsReportTypePaths: Record<OcpOnAwsReportType, string> = {
  [OcpOnAwsReportType.cost]: 'reports/openshift/charges/',
  [OcpOnAwsReportType.cpu]: 'reports/openshift/compute/',
  [OcpOnAwsReportType.instanceType]:
    'reports/openshift/infrastructures/aws/instance-types/',
  [OcpOnAwsReportType.memory]: 'reports/openshift/memory/',
  [OcpOnAwsReportType.storage]:
    'reports/openshift/infrastructures/aws/storage/',
  [OcpOnAwsReportType.tag]: 'tags/openshift/',
};

export function runReport(reportType: OcpOnAwsReportType, query: string) {
  const path = ocpOnAwsReportTypePaths[reportType];
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<OcpOnAwsReport>(`${path}?${query}`);
    });
  } else {
    return axios.get<OcpOnAwsReport>(`${path}?${query}`);
  }
}
