export interface IQueueProcessingService {
    executeProcessingQueue() : Promise<void>;
}
