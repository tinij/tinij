import { IQueueProcessingService } from "./IQueueProcessingService";
import { EventType, IMessageBroker, INotifierComponent } from "../IMessageBroker";
import { IQueueService } from "../queue/IQueueService";
import { IActivityApi } from "../../api/IActivityApi";
export declare class QueueProcessingService implements IQueueProcessingService, INotifierComponent {
    private readonly messageBroker;
    private readonly queueService;
    private readonly apiService;
    constructor(messageBroker: IMessageBroker, queueService: IQueueService, apiService: IActivityApi);
    executeProcessingQueue(): Promise<void>;
    eventTriggered(eventType: EventType, data: object): void;
}
