import {describe} from "mocha";
import {assert} from "chai";
import {DetectLanguageService} from "../src/services/languages/DetectLanguageService";
import {generateTinijTestInstance} from "./utils";

describe('Language test test',
    () => {
        it('should return C#', async () => {
            let languageTest = new DetectLanguageService();
            let language = languageTest.detectLanguageByFileName("test.cs");
            assert.isTrue("C#" == language, "Returned: " + language + " expected C#");
        });
        it('should return JS', async () => {
            let tinij = await generateTinijTestInstance(0);
            let language = tinij.languageDetector.detectLanguageByFileName("alex.js");
            assert.equal(language, "JavaScript");
        });
});
