export interface INotifierComponent {
    eventTriggered(eventType: EventType, data: object): void;
}
export declare enum EventType {
    QUEUE_MIN_LIMIT_REACHED = 0,
    APPLICATION_INIT = 1
}
export interface IMessageBroker {
    subscribe(notifier: INotifierComponent): void;
    unsubscribe(notifier: INotifierComponent): void;
    invokeEvent(event: EventType, data: object): void;
}
