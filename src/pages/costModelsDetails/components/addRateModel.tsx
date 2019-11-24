import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { CostModel } from 'api/costModels';
import { Rate } from 'api/rates';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from '../../createCostModelWizard/wizard.styles';
import { units } from './priceListTier';

interface RateOption {
  measurement: string;
  metric: string;
}

const rateOpts = {
  cpu_core_usage_per_hour: { measurement: 'usage', metric: 'cpu' },
  memory_gb_usage_per_hour: { measurement: 'usage', metric: 'memory' },
  storage_gb_usage_per_month: { measurement: 'usage', metric: 'storage' },
  cpu_core_request_per_hour: { measurement: 'request', metric: 'cpu' },
  memory_gb_request_per_hour: { measurement: 'request', metric: 'memory' },
  storage_gb_request_per_month: { measurement: 'request', metric: 'storage' },
};

export const freeAvialableRates = (rates: Rate[]): RateOption[] => {
  const occupied = rates.reduce((acc, curr) => {
    return { ...acc, [curr.metric.name]: curr };
  }, {});
  return Object.keys(rateOpts)
    .filter(kOpt => occupied[kOpt] === undefined)
    .map(kOpt => rateOpts[kOpt]);
};

interface Props extends InjectedTranslateProps {
  current: CostModel;
  isProcessing?: boolean;
  onClose: () => void;
  onProceed: (metric: string, measurement: string, rate: string) => void;
  updateError: string;
}

interface State {
  rate: string;
  metric: string;
  measurement: string;
  dirtyRate: boolean;
}

const defaultState: State = {
  metric: '',
  measurement: '',
  rate: '',
  dirtyRate: false,
};

class AddRateModelBase extends React.Component<Props, State> {
  public state = defaultState;
  public render() {
    const {
      updateError,
      current,
      onClose,
      onProceed,
      isProcessing,
      t,
    } = this.props;
    const freeAvailOpts = freeAvialableRates(current.rates);
    const opts = freeAvailOpts.reduce((acc, cur) => {
      const measurements = acc[cur.metric] === undefined ? [] : acc[cur.metric];
      return { ...acc, [cur.metric]: [...measurements, cur.measurement] };
    }, {});
    return (
      <Modal
        isFooterLeftAligned
        title={t('cost_models_details.add_rate_modal.title', {
          name: current.name,
        })}
        isSmall
        isOpen
        onClose={onClose}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={() => {
              onClose();
              this.setState(defaultState);
            }}
            isDisabled={isProcessing}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() =>
              onProceed(
                this.state.metric,
                this.state.measurement,
                this.state.rate
              )
            }
            isDisabled={
              isNaN(Number(this.state.rate)) ||
              Number(this.state.rate) <= 0 ||
              isProcessing
            }
          >
            {t('cost_models_details.add_rate')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form className={css(styles.form)}>
                <FormGroup
                  label={t('cost_models_wizard.price_list.metric_label')}
                  fieldId="metric-selector"
                >
                  <FormSelect
                    value={this.state.metric}
                    onChange={(metric: string) => this.setState({ metric })}
                    aria-label={t(
                      'cost_models_wizard.price_list.metric_selector_aria_label'
                    )}
                    id="metric-selector"
                  >
                    <FormSelectOption
                      isDisabled
                      value=""
                      label={t(
                        'cost_models_wizard.price_list.default_selector_label'
                      )}
                    />
                    {Object.keys(opts).map(mtc => (
                      <FormSelectOption
                        key={mtc}
                        value={mtc}
                        label={t(`cost_models_wizard.price_list.${mtc}_metric`)}
                      />
                    ))}
                  </FormSelect>
                </FormGroup>
                {this.state.metric !== '' && (
                  <FormGroup
                    label={t('cost_models_wizard.price_list.measurement_label')}
                    fieldId="measurement-selector"
                  >
                    <FormSelect
                      value={this.state.measurement}
                      onChange={(measurement: string) =>
                        this.setState({ measurement })
                      }
                      aria-label={t(
                        'cost_models_wizard.price_list.measurement_selector_aria_label'
                      )}
                      id="measurement-selector"
                    >
                      <FormSelectOption
                        isDisabled
                        value=""
                        label={t(
                          'cost_models_wizard.price_list.default_selector_label'
                        )}
                      />
                      {opts[this.state.metric] &&
                        opts[this.state.metric].map(msr => (
                          <FormSelectOption
                            key={msr}
                            value={msr}
                            label={t(`cost_models_wizard.price_list.${msr}`, {
                              units: units(this.state.metric),
                            })}
                          />
                        ))}
                    </FormSelect>
                  </FormGroup>
                )}
                {this.state.measurement !== '' && (
                  <FormGroup
                    label={t('cost_models_wizard.price_list.rate_label')}
                    fieldId="rate-input-box"
                    helperTextInvalid={t(
                      'cost_models_wizard.price_list.rate_error'
                    )}
                    isValid={
                      (!isNaN(Number(this.state.rate)) &&
                        Number(this.state.rate) > 0) ||
                      !this.state.dirtyRate
                    }
                  >
                    <InputGroup style={{ width: '150px' }}>
                      <InputGroupText style={{ borderRight: '0' }}>
                        <DollarSignIcon />
                      </InputGroupText>
                      <TextInput
                        style={{ borderLeft: '0' }}
                        type="text"
                        aria-label={t(
                          'cost_models_wizard.price_list.rate_aria_label'
                        )}
                        id="rate-input-box"
                        placeholder="0.00"
                        value={this.state.rate}
                        onChange={(rate: string) =>
                          this.setState({ rate, dirtyRate: true })
                        }
                        isValid={
                          (!isNaN(Number(this.state.rate)) &&
                            Number(this.state.rate) > 0) ||
                          !this.state.dirtyRate
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                )}
              </Form>
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default translate()(AddRateModelBase);
