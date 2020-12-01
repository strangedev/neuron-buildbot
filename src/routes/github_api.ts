import { NamedError } from "../lib/error";
import { Okay, Result, Fail } from "../lib/result";

export interface PushEvent {
    ref: string;
    before: string;
    after: string;
};

export class CannotUnmarshalPushEvent extends NamedError("CannotUnmarshalPushEvent") {};

/**
 * Converts a GitHub push event in the form of a json payload into
 * a native PushEvent.
 * 
 * @param jsonFormatted A json formatted string containing the push event.
 */
export function unmarshalPushEvent(jsonFormatted: string): Result<PushEvent, CannotUnmarshalPushEvent> {
    try {
        const rawUnmarshalledPushEvent = JSON.parse(jsonFormatted);
        return Okay({
            ref: rawUnmarshalledPushEvent.ref,
            before: rawUnmarshalledPushEvent.before,
            after: rawUnmarshalledPushEvent.after
        });
    } catch (error) {
        return Fail(new CannotUnmarshalPushEvent(error));
    }
}
