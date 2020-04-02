import {IQueueProcessingService} from "./IQueueProcessingService";
import {EventType, IMessageBroker, INotifierComponent} from "../messageBroker/IMessageBroker";
import {IQueueService} from "../queue/IQueueService";
import {IActivityApi} from "../../api/IActivityApi";
import {ResponseResultEnum} from "../../enums/ResponseResultEnum";
import { logError } from "../../utils";
import { TIMER_EXECUTION } from "../../constants";

export class QueueProcessingService implements IQueueProcessingService, INotifierComponent {

    private readonly messageBroker: IMessageBroker;
    private readonly queueService: IQueueService;
    private readonly apiService: IActivityApi;
    private readonly timer: NodeJS.Timeout;

    constructor(messageBroker: IMessageBroker, queueService: IQueueService, apiService: IActivityApi) {
        this.messageBroker = messageBroker;
        this.messageBroker.subscribe(this);

        this.queueService = queueService;
        this.apiService = apiService;
    }

    async executeProcessingQueue(): Promise<void> {
        if (this.queueService == null || this.apiService == null)
            return;
        let allActivities = await this.queueService.popActiveActivities();
        let result = await this.apiService.trackActivity(allActivities);
        if (result == ResponseResultEnum.FAILED) {
            logError("Request to backend failed, re-add everything to queue");
            await this.queueService.pushActivitiesToQueue(allActivities);
        }
    }

    eventTriggered(eventType: EventType, data?: object): void {
        switch (eventType) {
            case EventType.QUEUE_MIN_LIMIT_REACHED:
            case EventType.APPLICATION_INIT:
            case EventType.APPLICATION_CLOSE:
                this.executeProcessingQueue();
                break;
        }
    }

}
