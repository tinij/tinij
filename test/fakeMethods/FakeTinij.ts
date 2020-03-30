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

export class FakeTinij extends Tinij{

    constructor() {
        super("testKey");

        this.simpleMessageBroker = new SimpleMessageBroker();
        this.languageDetector = new DetectLanguageService();
        this.activityApi = new FakeApiService();
        this.queueService = new QueueService(this.simpleMessageBroker);
        this.queueProcessingService = new QueueProcessingService(this.simpleMessageBroker, this.queueService, this.activityApi);
        this.validationService = new Validator();
        this.fileService = new FileService();
        this.machineInfoService = new MachineInfoService();
        this.formattedService = new FormatterService();

        this.initModules();

    }
}
