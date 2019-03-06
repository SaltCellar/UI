import { AwsReport, AwsReportType, runReport } from 'api/awsReports';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';
import { dropCurrentMonthData } from 'utils/dropCurrentMonthData';
import { getReportId } from './awsReportsCommon';
import { selectReport, selectReportFetchStatus } from './awsReportsSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface AwsReportActionMeta {
  reportId: string;
}

export const fetchAwsReportRequest = createStandardAction('awsReports/request')<
  AwsReportActionMeta
>();
export const fetchAwsReportSuccess = createStandardAction('awsReports/success')<
  AwsReport,
  AwsReportActionMeta
>();
export const fetchAwsReportFailure = createStandardAction('awsReports/failure')<
  AxiosError,
  AwsReportActionMeta
>();

export function fetchReport(
  reportType: AwsReportType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isReportExpired(getState(), reportType, query)) {
      return;
    }

    const meta: AwsReportActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchAwsReportRequest(meta));
    runReport(reportType, query)
      .then(res => {
        const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchAwsReportSuccess(repsonseData, meta));
      })
      .catch(err => {
        dispatch(fetchAwsReportFailure(err, meta));
      });
  };
}

function isReportExpired(
  state: RootState,
  reportType: AwsReportType,
  query: string
) {
  const report = selectReport(state, reportType, query);
  const fetchStatus = selectReportFetchStatus(state, reportType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!report) {
    return true;
  }

  const now = Date.now();
  return now > report.timeRequested + expirationMS;
}
