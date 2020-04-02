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

export class FakeTinij extends Tinij{

    constructor() {
        super("testKey");
        super.isInit = true;
    }


    public async initServices() : Promise<boolean> {
        await this.initMainModules();
        this.simpleMessageBroker = new SimpleMessageBroker();
        var factory = new QueueFactory(this.simpleMessageBroker);

        this.languageDetector = new DetectLanguageService();
        this.activityApi = new FakeApiService();
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
