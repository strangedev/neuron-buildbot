import { CustomError } from 'defekt';
import { errors } from '../lib/error';
import { fail, okay, Result } from '../lib/result';

interface PushEvent {
  ref: string;
  before: string;
  after: string;
}

/**
 * Converts a GitHub push event in the form of a json payload into
 * a native PushEvent.
 *
 * @param jsonFormatted A json formatted string containing the push event.
 */
const unmarshalPushEvent = function (payload: any): Result<PushEvent, CustomError> {
  try {
    return okay({
      ref: payload.ref,
      before: payload.before,
      after: payload.after
    });
  } catch (ex: unknown) {
    return fail(new errors.UnmarshallingPullEventFailed(undefined, { cause: ex }));
  }
};

export type {
  PushEvent
};
export {
  unmarshalPushEvent
};
