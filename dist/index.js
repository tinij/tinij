"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DetectLanguageService_1 = require("./services/languages/DetectLanguageService");
const ActivityApi_1 = require("./api/implementation/ActivityApi");
const QueueService_1 = require("./services/queue/QueueService");
const Validator_1 = require("./utils/Validator");
const ActivityEntity_1 = require("./entities/ActivityEntity");
const HeartbeatsTypeEnum_1 = require("./enums/HeartbeatsTypeEnum");
const FileService_1 = require("./services/fileService/FileService");
const utils_1 = require("./utils");
const SimpleMessageBroker_1 = require("./services/SimpleMessageBroker");
const QueueProcessingService_1 = require("./services/queueProcessing/QueueProcessingService");
class Tinij {
    constructor() {
        this.simpleMessageBroker = new SimpleMessageBroker_1.SimpleMessageBroker();
        this.languageDetector = new DetectLanguageService_1.DetectLanguageService();
        this.activityApi = new ActivityApi_1.ActivityApi();
        this.queueService = new QueueService_1.QueueService(this.simpleMessageBroker);
        this.queueProcessingService = new QueueProcessingService_1.QueueProcessingService(this.simpleMessageBroker, this.queueService, this.activityApi);
        this.validationService = new Validator_1.Validator();
        this.fileService = new FileService_1.FileService();
    }
    trackActivity(plugin, system, time, entity, category, is_write = false, project = null, branch = null, lineNumber = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let activityType = this.getActivityType(entity);
            let activityEntity = new ActivityEntity_1.ActivityEntity();
            activityEntity.system = system;
            activityEntity.plugin = plugin;
            activityEntity.time = time;
            activityEntity.branch = branch;
            activityEntity.project = project;
            activityEntity.category = category;
            activityEntity.is_write = is_write;
            activityEntity.type = activityType;
            activityEntity.language = this.languageDetector.detectLanguageByFileName(entity);
            if (activityType == HeartbeatsTypeEnum_1.HeartbeatsTypeEnum.File) {
                activityEntity.lineno = lineNumber;
                activityEntity.lines = yield this.fileService.getLinesCount(entity);
            }
            let validationResult = yield this.validationService.validateActivityEntity(activityEntity);
            if (!validationResult) {
                utils_1.logError("Activity validation error");
            }
            yield this.queueService.pushActivityToQueue(activityEntity);
        });
    }
    getActivityType(entity) {
        if (entity != null && entity.startsWith("http")) {
            return HeartbeatsTypeEnum_1.HeartbeatsTypeEnum.Domain;
        }
        else {
            return HeartbeatsTypeEnum_1.HeartbeatsTypeEnum.File;
        }
    }
}
exports.Tinij = Tinij;
//# sourceMappingURL=index.js.map