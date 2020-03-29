"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class SimpleMessageBroker {
    constructor() {
        this.listOfSubscribers = new Array();
    }
    subscribe(notifier) {
        this.listOfSubscribers.push(notifier);
    }
    unsubscribe(notifier) {
        const index = this.listOfSubscribers.indexOf(notifier, 0);
        if (index > -1) {
            this.listOfSubscribers.splice(index, 1);
        }
    }
    invokeEvent(event, data) {
        if (this.listOfSubscribers == null) {
            utils_1.logTrace("No subscribers for event: " + event);
            return;
        }
        for (let subscriber of this.listOfSubscribers) {
            subscriber.eventTriggered(event, data);
        }
    }
}
exports.SimpleMessageBroker = SimpleMessageBroker;
//# sourceMappingURL=SimpleMessageBroker.js.map