"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = (s) => console.error(s);
exports.logInfo = (s) => console.log(s);
exports.logDetail = (s) => console.log(s);
exports.logTrace = (s) => console.trace(s);
function validateTime(time) {
    return (new Date(time)).getTime() > 0;
}
exports.validateTime = validateTime;
//# sourceMappingURL=index.js.map