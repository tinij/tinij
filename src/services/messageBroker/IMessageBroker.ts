
export interface INotifierComponent {
    eventTriggered(eventType: EventType, data: object) : void;
}

export enum EventType {
    QUEUE_MIN_LIMIT_REACHED,
    APPLICATION_INIT,
    APPLICATION_CLOSE
}

export interface IMessageBroker {
    subscribe(notifier: INotifierComponent) : void;
    unsubscribe(notifier: INotifierComponent) : void;
    invokeEvent(event: EventType, data?: object) : void;
}
