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
const index_1 = require("./index");
const class_validator_1 = require("class-validator");
class Validator {
    validateActivityEntity(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let entityDate = entity.time;
            if (!index_1.validateTime(entityDate))
                return;
            let validationResult = yield class_validator_1.validate(entity);
            if (validationResult == null || validationResult.length == 0)
                return true;
            index_1.logError(JSON.stringify(validationResult));
            return false;
        });
    }
}
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map