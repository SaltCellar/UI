import { MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Action } from 'redux';
import { ThunkAction as ReduxThunkAction } from 'redux-thunk';
import { RootState } from './rootReducer';

export const enum FetchStatus {
  'none',
  'inProgress',
  'complete',
}

export function createMapStateToProps<OwnProps, StateProps>(
  mapStateToProps: MapStateToProps<StateProps, OwnProps, RootState>
) {
  return mapStateToProps;
}

export function createMapDispatchToProps<OwnProps, DispatchProps>(
  mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps>
) {
  return mapDispatchToProps;
}

export type ThunkAction<A extends Action = any, R = any> = ReduxThunkAction<
  R,
  RootState,
  void,
  A
>;
