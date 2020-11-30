export interface PushEvent {
    ref: string;
    before: string;
    after: string;
};

/**
 * Converts a GitHub push event in the form of a json payload into
 * a native PushEvent.
 * 
 * @param jsonFormatted A json formatted string containing the push event.
 */
export function unmarshalPushEvent(jsonFormatted: string): PushEvent {
    const rawUnmarshalledPushEvent = JSON.parse(jsonFormatted);
    return {
        ref: rawUnmarshalledPushEvent.ref,
        before: rawUnmarshalledPushEvent.before,
        after: rawUnmarshalledPushEvent.after
    };
}
