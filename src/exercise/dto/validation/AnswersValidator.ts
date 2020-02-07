import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { QuestionConstants } from '../../../constants/exercise';

@ValidatorConstraint({ async: false })
export class AnswersValidator implements ValidatorConstraintInterface {

    validate(arr: [], args: ValidationArguments) {
        if (!arr || arr.length <= 0) {
            return false;
        }
        // 最多可以有多少个选项
        const maxCount = QuestionConstants.OptionMaxValue - QuestionConstants.OptionMinValue + 1;
        if (arr.length > maxCount) {
            return false;
        }
        for (const value of arr) {
            const optionValue: any = value;
            if (!optionValue) {
                return false;
            }
            if (optionValue.length !== 1) {
                return false;
            }
            const code = optionValue.charCodeAt(0);
            if (!(code >= QuestionConstants.OptionMinValue && code <= QuestionConstants.OptionMaxValue)) {
                return false;
            }
        }
        return true;
    }

    // here you can provide default error message if validation failed
    defaultMessage(args: ValidationArguments) {
        return '';
    }
}