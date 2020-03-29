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
const IMessageBroker_1 = require("../IMessageBroker");
const ResponseResultEnum_1 = require("../../enums/ResponseResultEnum");
class QueueProcessingService {
    constructor(messageBroker, queueService, apiService) {
        this.messageBroker = messageBroker;
        this.messageBroker.subscribe(this);
        this.queueService = queueService;
        this.apiService = apiService;
    }
    executeProcessingQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            let allActivities = yield this.queueService.popActiveActivities();
            let result = yield this.apiService.trackActivity(allActivities);
            if (result != ResponseResultEnum_1.ResponseResultEnum.OK) {
                yield this.queueService.pushActivitiesToQueue(allActivities);
            }
        });
    }
    eventTriggered(eventType, data) {
        if (eventType == IMessageBroker_1.EventType.QUEUE_MIN_LIMIT_REACHED || eventType == IMessageBroker_1.EventType.APPLICATION_INIT) {
            this.executeProcessingQueue();
        }
    }
}
exports.QueueProcessingService = QueueProcessingService;
//# sourceMappingURL=QueueProcessingService.js.map