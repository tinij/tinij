import { IDetectLanguageService } from "./services/languages/IDetectLanguageService";
import { IActivityApi } from "./api/IActivityApi";
import { IQueueService } from "./services/queue/IQueueService";
import { IValidator } from "./utils/Validator";
import { IFileService } from "./services/fileService/IFileService";
import { IMessageBroker } from "./services/IMessageBroker";
import { IQueueProcessingService } from "./services/queueProcessing/IQueueProcessingService";
export declare class Tinij {
    readonly languageDetector: IDetectLanguageService;
    readonly activityApi: IActivityApi;
    readonly queueService: IQueueService;
    readonly validationService: IValidator;
    readonly fileService: IFileService;
    readonly simpleMessageBroker: IMessageBroker;
    readonly queueProcessingService: IQueueProcessingService;
    constructor();
    trackActivity(plugin: string, system: string, time: number, entity: string, category: string, is_write?: boolean, project?: string, branch?: string, lineNumber?: number): Promise<void>;
    private getActivityType;
}
