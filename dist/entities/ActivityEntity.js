"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
class ActivityEntity {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 50)
], ActivityEntity.prototype, "entity", void 0);
__decorate([
    class_validator_1.IsInt()
], ActivityEntity.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 50)
], ActivityEntity.prototype, "category", void 0);
__decorate([
    class_validator_1.IsString()
], ActivityEntity.prototype, "plugin", void 0);
__decorate([
    class_validator_1.IsString()
], ActivityEntity.prototype, "system", void 0);
__decorate([
    class_validator_1.IsInt()
], ActivityEntity.prototype, "time", void 0);
exports.ActivityEntity = ActivityEntity;
//# sourceMappingURL=ActivityEntity.js.map