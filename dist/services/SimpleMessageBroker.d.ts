import { EventType, INotifierComponent, IMessageBroker } from "./IMessageBroker";
export declare class SimpleMessageBroker implements IMessageBroker {
    listOfSubscribers: Array<INotifierComponent>;
    constructor();
    subscribe(notifier: INotifierComponent): void;
    unsubscribe(notifier: INotifierComponent): void;
    invokeEvent(event: EventType, data: object): void;
}
