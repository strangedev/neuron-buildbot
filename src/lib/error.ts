import { defekt } from 'defekt';

export const errors = defekt({
  UnableToLoadSecrets: {},
  ResultNotChecked: {},
  ErrorDoesNotExist: {},
  ValueDoesNotExist: {},
  UnableToLoadConfiguration: {},
  AuthenticationMisconfigured: {},
  ProviderIsUnknown: {},
  NeuronBuildError: {},
  CloningRepositoryFailed: {},
  PullingRepositoryFailed: {},
  UnmarshallingPullEventFailed: {}
});
