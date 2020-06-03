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
import {logError, logInfo, InitLogService, logDetail} from "./utils";
import {SimpleMessageBroker} from "./services/messageBroker/SimpleMessageBroker";
import {IMessageBroker, EventType} from "./services/messageBroker/IMessageBroker";
import {IQueueProcessingService} from "./services/queueProcessing/IQueueProcessingService";
import {QueueProcessingService} from "./services/queueProcessing/QueueProcessingService";
import {IMachineInfoService} from "./services/machineInfoService/IMachineInfoService";
import {MachineInfoService} from "./services/machineInfoService/MachineInfoService";
import {IFormatterService} from "./services/fomatterService/IFormatterService";
import {FormatterService} from "./services/fomatterService/FormatterService";
import {ConfigService} from "./configService";
import {IProjectService} from "./services/projects/IProjectService";
import {BaseProjectService} from "./services/projects/BaseProjectService";
import {CategoryEnum} from "./enums/CategoryEnum";
import { PluginTypeEnum } from "./enums/PluginTypeEnum";
import { QueueFactory } from "./services/queue/QueueFactory";

export class Tinij {

    public isInit = false;
    protected _storedApiKey = "";

    languageDetector: IDetectLanguageService;
    activityApi: IActivityApi;
    queueService: IQueueService;
    validationService: IValidator;
    fileService: IFileService;
    simpleMessageBroker: IMessageBroker;
    queueProcessingService: IQueueProcessingService;
    machineInfoService: IMachineInfoService;
    formattedService: IFormatterService;
    projectService: IProjectService;

    constructor(apiKey?: string) {
        this._storedApiKey = apiKey;
    }


    public getConfig() : ConfigService {
        return ConfigService.getInstance();
    }

    public async initServices() : Promise<boolean> {
        try {
            await this.initMainModules();
            this.simpleMessageBroker = new SimpleMessageBroker();
            var factory = new QueueFactory(this.simpleMessageBroker);

            this.languageDetector = new DetectLanguageService();
            this.activityApi = new ActivityApi();
            this.validationService = new Validator();
            this.fileService = new FileService();
            this.machineInfoService = new MachineInfoService();
            this.formattedService = new FormatterService();
            this.projectService = new BaseProjectService();

            this.queueService = await factory.getService();
            this.queueProcessingService = new QueueProcessingService(this.simpleMessageBroker, this.queueService, this.activityApi);

            await this.queueService.initQueue();
            this.initModules();
            this.isInit = true;

            return true;
        } catch (err) {
            logError("Failed:" + err);
            return false;
        }
    }

    protected async initMainModules() : Promise<boolean> {
        await this.getConfig().InitSettingsStorage();
        if (this._storedApiKey != null && this._storedApiKey != "") {
            await ConfigService.getInstance().SetUserToken(this._storedApiKey);
        }
        InitLogService();
        return true;
    }

    protected async initModules() {
        logInfo("Init completed");
        this.simpleMessageBroker.invokeEvent(EventType.APPLICATION_INIT);
    }

    public async trackActivity(
        plugin: PluginTypeEnum | number,
        time: Date | string | number,
        entity: string,
        category: CategoryEnum = CategoryEnum.CODING,
        is_write?: boolean,
        project?: string,
        branch?: string,
        lineNumber?: number,
        type?: number
    ) {
        if (!this.isInit)
        {
            logError("Please init the service first");
            return;
        }
        let activityType = this.getActivityType(entity, type);
        let machineInfo = this.machineInfoService.getMachineInfo();
        let currentBranch = branch ?? await this.projectService.getBranch(entity);

        let activityEntity = new ActivityEntity();
        activityEntity.entity = entity;
        activityEntity.plugin = plugin;
        activityEntity.time = new Date(time);
        activityEntity.branch = currentBranch;
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

    private getActivityType(entity: string, def: HeartbeatsTypeEnum | undefined) : HeartbeatsTypeEnum {
        if (def)
            return def;
        if (entity != null && entity.startsWith("http")) {
            return HeartbeatsTypeEnum.Domain;
        } else {
            return HeartbeatsTypeEnum.File;
        }
    }

    public async isApiKeyExist() : Promise<boolean> {
        var config = ConfigService.getInstance();
        var key = await config.GetApiKey();
        if (key == null || key == undefined || key === "" || key.startsWith("xxxx-")) {
            return false;
        }
        return true;
    }

    public async setApiKey(token: string) : Promise<boolean> {
        var config = ConfigService.getInstance();
        return config.SetUserToken(token);
    }

    public resetSettingsToDefault() : Promise<boolean> {
        var config = ConfigService.getInstance();
        return config.ResetSettingsToDefault();
    }

    public async clearRecordedLogs() : Promise<boolean> {
        var logs = await this.queueService.popActiveActivities();
        if (logs == null)
            return false;
        return true;
    }
}
