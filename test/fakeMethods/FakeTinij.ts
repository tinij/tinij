import {Tinij} from "../../src";
import {SimpleMessageBroker} from "../../src/services/messageBroker/SimpleMessageBroker";
import {DetectLanguageService} from "../../src/services/languages/DetectLanguageService";
import {QueueService} from "../../src/services/queue/QueueService";
import {QueueProcessingService} from "../../src/services/queueProcessing/QueueProcessingService";
import {Validator} from "../../src/utils/Validator";
import {FileService} from "../../src/services/fileService/FileService";
import {MachineInfoService} from "../../src/services/machineInfoService/MachineInfoService";
import {FormatterService} from "../../src/services/fomatterService/FormatterService";
import {FakeApiService} from "./FakeApiService";
import { BaseProjectService } from "../../src/services/projects/BaseProjectService";
import { QueueFactory } from "../../src/services/queue/QueueFactory";
import { isBoolean } from "util";
import { ActivityApi } from "../../src/api/implementation/ActivityApi";
import { FakeBrokerService } from "./FakeBrokerService";

export class FakeTinij extends Tinij{

    private _isRealAPI: boolean;

    constructor(isRealApi: boolean) {
        super("testKey");
        super.isInit = true;
        this._isRealAPI = isRealApi;
    }


    public async initServices() : Promise<boolean> {
        await this.initMainModules();
        if (this._isRealAPI) {
            this.simpleMessageBroker = new SimpleMessageBroker();
        } else {
            this.simpleMessageBroker = new FakeBrokerService();
        }
        var factory = new QueueFactory(this.simpleMessageBroker);

        this.languageDetector = new DetectLanguageService();
        if (this._isRealAPI) {
            this.activityApi = new ActivityApi();
        } else {
            this.activityApi = new FakeApiService();
        }
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
    }
}
