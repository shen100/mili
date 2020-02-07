import {
    Validator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { QuestionConstants } from '../../../constants/exercise';

@ValidatorConstraint({ async: false })
export class OptionsValidator implements ValidatorConstraintInterface {

    validate(arr: [], args: ValidationArguments) {
        const validator = new Validator();
        if (!arr || arr.length <= 0) {
            return false;
        }

        // 最多可以有多少个选项
        const maxCount = QuestionConstants.OptionMaxValue - QuestionConstants.OptionMinValue + 1;
        if (arr.length > maxCount) {
            return false;
        }
        for (const opt of arr) {
            // {
            //     optionDesc: "aaaaaaa"
            //     optionValue: "A"
            // }
            const option: any = opt;
            if (!option) {
                return false;
            }
            if (!option.optionValue) {
                return false;
            }
            if (option.optionValue.length !== 1) {
                return false;
            }
            const code = option.optionValue.charCodeAt(0);
            if (!(code >= QuestionConstants.OptionMinValue && code <= QuestionConstants.OptionMaxValue)) {
                return false;
            }
            if (!option.optionDesc) {
                return false;
            }
            if (!option.optionDesc.trim()) {
                return false;
            }
            // 编辑习题时，之前的选项会有id
            if (typeof option.id !== 'undefined' && !validator.isInt(option.id)) {
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