import {IDetectLanguageService} from "./services/languages/IDetectLanguageService";
import {IActivityApi} from "./api/IActivityApi";
import {IQueueService} from "./services/queue/IQueueService";
import {DetectLanguageService} from "./services/languages/DetectLanguageService";
import {ActivityApi} from "./api/implementation/ActivityApi";
import {QueueService} from "./services/queue/QueueService";
import {IValidator, Validator} from "./utils/Validator";
import {ActivityEntity} from "./entities/ActivityEntity";
import {HeartbeatsTypeEnum} from "./enums/HeartbeatsTypeEnum";
import {IFileService} from "./services/fileService/IFileService";
import {FileService} from "./services/fileService/FileService";
import {logError} from "./utils";
import {SimpleMessageBroker} from "./services/SimpleMessageBroker";
import {IMessageBroker} from "./services/IMessageBroker";
import {IQueueProcessingService} from "./services/queueProcessing/IQueueProcessingService";
import {QueueProcessingService} from "./services/queueProcessing/QueueProcessingService";

export class Tinij {
    readonly languageDetector: IDetectLanguageService;
    readonly activityApi: IActivityApi;
    readonly queueService: IQueueService;
    readonly validationService: IValidator;
    readonly fileService: IFileService;
    readonly simpleMessageBroker: IMessageBroker;
    readonly queueProcessingService: IQueueProcessingService;

    constructor() {
        this.simpleMessageBroker = new SimpleMessageBroker();
        this.languageDetector = new DetectLanguageService();
        this.activityApi = new ActivityApi();
        this.queueService = new QueueService(this.simpleMessageBroker);
        this.queueProcessingService = new QueueProcessingService(this.simpleMessageBroker, this.queueService, this.activityApi);
        this.validationService = new Validator();
        this.fileService = new FileService();
    }

    public async trackActivity(
        plugin: string,
        system: string,
        time: number,
        entity: string,
        category: string,
        is_write: boolean = false,
        project: string = null,
        branch: string = null,
        lineNumber: number = null
    ) {
        let activityType = this.getActivityType(entity);
        let activityEntity = new ActivityEntity();
        activityEntity.system = system;
        activityEntity.plugin = plugin;
        activityEntity.time = time;
        activityEntity.branch = branch;
        activityEntity.project = project;
        activityEntity.category = category;
        activityEntity.is_write = is_write;
        activityEntity.type = activityType;
        activityEntity.language = this.languageDetector.detectLanguageByFileName(entity);
        if (activityType == HeartbeatsTypeEnum.File) {
            activityEntity.lineno = lineNumber;
            activityEntity.lines = await this.fileService.getLinesCount(entity);
        }
        let validationResult = await this.validationService.validateActivityEntity(activityEntity);
        if (!validationResult) {
            logError("Activity validation error");
        }
        await this.queueService.pushActivityToQueue(activityEntity);
    }

    private getActivityType(entity: string) : HeartbeatsTypeEnum {
        if (entity != null && entity.startsWith("http")) {
           return HeartbeatsTypeEnum.Domain;
        } else {
            return HeartbeatsTypeEnum.File;
        }
    }
}
