import { IMessageBroker, INotifierComponent, EventType } from "../../src/services/messageBroker/IMessageBroker";
import { logInfo, logTrace } from "../../src/utils";
import { SimpleMessageBroker } from "../../src/services/messageBroker/SimpleMessageBroker";

export class FakeBrokerService extends SimpleMessageBroker {

    public invokedEvent: boolean;

    constructor() {
        super();
    }

    subscribe(notifier: INotifierComponent) {
        super.subscribe(notifier);
    }

    unsubscribe(notifier: INotifierComponent) {
        super.unsubscribe(notifier);
    }

    invokeEvent(event: EventType, data?: object) {
        this.invokedEvent = true;
        super.invokeEvent(event, data);
    }
}