import {logTrace} from "../utils";
import {EventType, INotifierComponent, IMessageBroker} from "./IMessageBroker";

export class SimpleMessageBroker implements IMessageBroker{

    listOfSubscribers: Array<INotifierComponent>;

    constructor() {
        this.listOfSubscribers = new Array<INotifierComponent>();
    }

    subscribe(notifier: INotifierComponent) {
        this.listOfSubscribers.push(notifier);
    }

    unsubscribe(notifier: INotifierComponent) {
        const index = this.listOfSubscribers.indexOf(notifier, 0);
        if (index > -1) {
            this.listOfSubscribers.splice(index, 1);
        }
    }

    invokeEvent(event: EventType, data: object) {
        if (this.listOfSubscribers == null) {
            logTrace("No subscribers for event: " + event);
            return;
        }
        for (let subscriber of this.listOfSubscribers) {
            subscriber.eventTriggered(event, data);
        }
    }
}
