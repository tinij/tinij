import { Tinij } from '../src';
import 'mocha';
import {describe} from "mocha";
import { assert } from "chai";
import {ActivityEntity} from "../src/entities/ActivityEntity";

describe('Base test',
    () => {
        it('should return true', () => {
            const tinij = new Tinij();
            assert.isNotNull(tinij);
        });
});

describe('Language test',
    () => {
        it('should return JS', () => {
            const tinij = new Tinij();
            let language = tinij.languageDetector.detectLanguageByFileName("alex.js");
            assert.equal(language, "JavaScript");
        });
});


describe('Validation test',
    () => {
        it('should return false for empty activity', async () => {
            const tinij = new Tinij();
            let activity = new ActivityEntity();
            let result = await tinij.validationService.validateActivityEntity(activity);
            assert.equal(result, false);
        });
});
