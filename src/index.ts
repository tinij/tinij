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
import {SimpleMessageBroker} from "./services/messageBroker/SimpleMessageBroker";
import {IMessageBroker} from "./services/messageBroker/IMessageBroker";
import {IQueueProcessingService} from "./services/queueProcessing/IQueueProcessingService";
import {QueueProcessingService} from "./services/queueProcessing/QueueProcessingService";
import {IMachineInfoService} from "./services/machineInfoService/IMachineInfoService";
import {MachineInfoService} from "./services/machineInfoService/MachineInfoService";
import {IFormatterService} from "./services/fomatterService/IFormatterService";
import {FormatterService} from "./services/fomatterService/FormatterService";
import {ConfigSingleton} from "./configSingleton";

export class Tinij {

    languageDetector: IDetectLanguageService;
    activityApi: IActivityApi;
    queueService: IQueueService;
    validationService: IValidator;
    fileService: IFileService;
    simpleMessageBroker: IMessageBroker;
    queueProcessingService: IQueueProcessingService;
    machineInfoService: IMachineInfoService;
    formattedService: IFormatterService;

    constructor(apiKey: string) {
        if (apiKey == null)
        {
            logError("No API key found. Exit");
            return;
        }
        ConfigSingleton.getInstance().SetUserToken(apiKey);
        this.simpleMessageBroker = new SimpleMessageBroker();
        this.languageDetector = new DetectLanguageService();
        this.activityApi = new ActivityApi();
        this.queueService = new QueueService(this.simpleMessageBroker);
        this.queueProcessingService = new QueueProcessingService(this.simpleMessageBroker, this.queueService, this.activityApi);
        this.validationService = new Validator();
        this.fileService = new FileService();
        this.machineInfoService = new MachineInfoService();
        this.formattedService = new FormatterService();

        this.initModules();
    }

    protected async initModules() {
        await this.queueService.initQueue();
    }

    public async trackActivity(
        plugin: string,
        time: number,
        entity: string,
        category: number,
        is_write: boolean = false,
        project: string = null,
        branch: string = null,
        lineNumber: number = null
    ) {
        let activityType = this.getActivityType(entity);
        let machineInfo = this.machineInfoService.getMachineInfo();
        let activityEntity = new ActivityEntity();
        activityEntity.entity = entity;
        activityEntity.plugin = plugin;
        activityEntity.time = time;
        activityEntity.branch = branch;
        activityEntity.project = project;
        activityEntity.category = category;
        activityEntity.is_write = is_write;
        activityEntity.type = activityType;
        activityEntity.system = machineInfo.operationSystem;
        activityEntity.machine = machineInfo.machineName;
        activityEntity.language = this.languageDetector.detectLanguageByFileName(entity);
        if (activityType == HeartbeatsTypeEnum.File) {
            activityEntity.lineno = lineNumber;
            activityEntity.lines = await this.fileService.getLinesCount(entity);
        }
        let formattedActivity = this.formattedService.formatActivity(activityEntity);
        let validationResult = await this.validationService.validateActivityEntity(formattedActivity);
        if (!validationResult) {
            logError("Activity validation error");
            return;
        }
        await this.queueService.pushActivityToQueue(formattedActivity);
    }

    private getActivityType(entity: string) : HeartbeatsTypeEnum {
        if (entity != null && entity.startsWith("http")) {
           return HeartbeatsTypeEnum.Domain;
        } else {
            return HeartbeatsTypeEnum.File;
        }
    }
}
