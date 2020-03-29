import {IQueueProcessingService} from "./IQueueProcessingService";
import {EventType, IMessageBroker, INotifierComponent} from "../IMessageBroker";
import {IQueueService} from "../queue/IQueueService";
import {IActivityApi} from "../../api/IActivityApi";
import {ResponseResultEnum} from "../../enums/ResponseResultEnum";

export class QueueProcessingService implements IQueueProcessingService, INotifierComponent {

    private readonly messageBroker: IMessageBroker;
    private readonly queueService: IQueueService;
    private readonly apiService: IActivityApi;

    constructor(messageBroker: IMessageBroker, queueService: IQueueService, apiService: IActivityApi) {
        this.messageBroker = messageBroker;
        this.messageBroker.subscribe(this);

        this.queueService = queueService;
        this.apiService = apiService;
    }

    async executeProcessingQueue(): Promise<void> {
        let allActivities = await this.queueService.popActiveActivities();
        let result = await this.apiService.trackActivity(allActivities);
        if (result != ResponseResultEnum.OK) {
            await this.queueService.pushActivitiesToQueue(allActivities);
        }
    }

    eventTriggered(eventType: EventType, data: object): void {
        if (eventType == EventType.QUEUE_MIN_LIMIT_REACHED || eventType == EventType.APPLICATION_INIT) {
            this.executeProcessingQueue();
        }
    }
}
