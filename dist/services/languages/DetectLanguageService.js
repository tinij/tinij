"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
// @ts-ignore
const detect = __importStar(require("language-detect"));
class DetectLanguageService {
    detectLanguageByFileName(filename) {
        try {
            return detect.filename(filename);
        }
        catch (e) {
            utils_1.logError(e);
            return "unknown";
        }
    }
}
exports.DetectLanguageService = DetectLanguageService;
//# sourceMappingURL=DetectLanguageService.js.map