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
const constants_1 = require("../../constants");
const IMessageBroker_1 = require("../IMessageBroker");
class QueueService {
    constructor(messageBroker) {
        this.messageBroker = messageBroker;
    }
    popActiveActivities() {
        return __awaiter(this, void 0, void 0, function* () {
            let activeActivities = this.activeQueue;
            activeActivities = new Array();
            return activeActivities;
        });
    }
    initQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeQueue = new Array();
            return true;
        });
    }
    pushActivityToQueue(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeQueue.push(activity);
            if (this.activeQueue.length >= constants_1.MAX_ACTIVITIES_BEFORE_SEND)
                this.messageBroker.invokeEvent(IMessageBroker_1.EventType.QUEUE_MIN_LIMIT_REACHED, this.activeQueue);
            return true;
        });
    }
    pushActivitiesToQueue(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (activity == null || activity.length == 0)
                return true;
            for (let active of activity) {
                this.activeQueue.push(active);
            }
            return true;
        });
    }
}
exports.QueueService = QueueService;
//# sourceMappingURL=QueueService.js.map