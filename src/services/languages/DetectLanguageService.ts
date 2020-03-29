import {IDetectLanguageService} from "./IDetectLanguageService";
import { logError } from "../../utils";
// @ts-ignore
import * as detect from "language-detect";

export class DetectLanguageService implements IDetectLanguageService{
    detectLanguageByFileName(filename: string): string {
        try {
            return detect.filename(filename);
        } catch (e) {
            logError(e);
            return "unknown";
        }
    }
}
