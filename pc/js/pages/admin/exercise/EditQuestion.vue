<template>
    <div>
        <Card>
            <Form ref="formNode" :model="formData" :rules="rules" :label-width="80">
                <FormItem prop="type" label="题型">
                    <RadioGroup v-model="formData.type">
                        <Radio :label="QuestionType.Radio + ''">单选</Radio>
                        <Radio :label="QuestionType.Multiple + ''">多选</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="title" label="题目">
                    <Input v-model="formData.title" type="textarea" :rows="2" placeholder="请输入题目" style="width: 400px;" />
                </FormItem>
                <FormItem label="代码段">
                    <Input v-model="formData.codeSnippet" type="textarea" :rows="6" placeholder="请输入代码段" style="width: 400px;" />
                </FormItem>
                <FormItem :key="opt.optionValue" v-for="(opt, i) in formData.options" :label="opt.optionValue">
                    <Input v-model="opt.optionDesc" type="textarea" :rows="2" placeholder="" style="width: 400px;" />
                    <!-- 有id的话，是编辑习题，编辑习题时，不能删除以有的选项 -->
                    <Button v-if="!opt.id" @click="onDeleteOption(i)" style="margin-left: 12px;" icon="md-close" shape="circle"></Button>
                </FormItem>
                <FormItem v-if="formData.options.length < optionMaxCount">
                    <Button @click="onAddOption">添加选项</Button>
                </FormItem>
                <FormItem v-if="formData.type === QuestionType.Radio + ''" prop="answer" label="答案">
                    <RadioGroup v-model="formData.answer">
                        <Radio :key="opt.optionValue" v-for="opt in formData.options" :label="opt.optionValue">{{opt.optionValue}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem v-else prop="answers" label="答案">
                    <CheckboxGroup v-model="formData.answers">
                        <Checkbox :key="opt.optionValue" v-for="opt in formData.options" :label="opt.optionValue">{{opt.optionValue}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="答题解析">
                    <Input v-model="formData.analysis" type="textarea" :rows="6" placeholder="" style="width: 400px;" />
                </FormItem>
                <FormItem>
                    <Button :loading="isLoading" type="primary" @click="onSave" size="large" style="margin-right: 20px;">保存</Button>
                    <Button @click="onCancel" size="large">取消</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net';
import { ErrorCode } from '~/js/constants/error.js';
import { trim } from '~/js/utils/utils.js';
import { QuestionType, QuestionConstants } from '~/js/constants/exercise.js';

export default {
    data() {
        return {
            QuestionType,
            optionMaxCount: QuestionConstants.OptionMaxCount,
            isLoading: false,
            isEdit: false,
            formData: {
                title: '',
                type: QuestionType.Radio + '',
                options: [],
                answer: '',
                answers: [],
                analysis: '',
            },
            rules: {
                title: [
                    { required: true, message: '请输入题目', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择题型', trigger: 'change' }
                ],
                answer: [
                    {
                        required: true,
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            if (this.formData.type === QuestionType.Radio + '' && !value) {
                                callback(new Error('请设置答案'));
                                return;
                            }
                            callback();
                        }
                    }
                ],
                answers: [
                    {
                        required: true,
                        trigger: 'change', 
                        validator: (rule, value, callback) => {
                            if (this.formData.type === QuestionType.Multiple + '' && !(value && value.length)) {
                                callback(new Error('请设置答案'));
                                return;
                            }
                            callback();
                        }
                    }
                ]
            },
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.isEdit = true;
            this.requestQuestion(this.$route.params.id);
        }
    },
    methods: {
        requestQuestion(id) {
            let url = `/exercises/questions/${id}`;
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    this.$Message.error(res.data.message);
                    return;
                }
                const resData = res.data.data;
                this.formData.title = resData.title;
                this.formData.codeSnippet = resData.codeSnippet;
                this.formData.type = resData.type + '';
                this.formData.options = resData.options;
                this.formData.analysis = resData.analysis;
                if (resData.type + '' === QuestionType.Radio + '') {
                    this.formData.answer = resData.answers;
                } else {
                    this.formData.answers = resData.answers.split(',');
                }
            });
        },
        onAddOption() {
            let optionValue;
            if (this.formData.options.length) {
                const code = this.formData.options[this.formData.options.length - 1].optionValue.charCodeAt(0);
                optionValue = String.fromCharCode(code + 1);
            } else {
                optionValue = 'A';
            }
            this.formData.options.push({
                optionValue,
                optionDesc: ''
            });
        },
        onDeleteOption(i) {
            this.formData.options.splice(i, 1);
            let code = 65;
            this.formData.options.forEach(opt => {
                opt.optionValue = String.fromCharCode(code);
                code++;
            });
        },
        onSave() {
            this.$refs['formNode'].validate((valid) => {
                if (!valid) {
                    return;
                }
                this.isLoading = true;
                let url = '/admin/exercises/questions';
                let method = myHTTP.post;
                const type = parseInt(this.formData.type);
                this.formData.options.forEach(opt => {
                    opt.optionDesc = trim(opt.optionDesc || '');
                });
                const answers = type === QuestionType.Radio ? [ this.formData.answer ] : this.formData.answers;
                answers.sort((a, b) => a > b ? 1 : -1);
                const data = {
                    title: trim(this.formData.title),
                    codeSnippet: this.formData.codeSnippet || undefined,
                    type,
                    options: this.formData.options,
                    analysis: trim(this.formData.analysis || ''),
                    answers,
                };
                if (this.$route.params.id) {
                    method = myHTTP.put;
                    url = `/admin/exercises/questions/${this.$route.params.id}`;
                }
                method(url, data).then((res) => {
                    this.isLoading = false;
                    if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                        this.$Message.error(res.data.message);
                        return;
                    }
                    this.$router.push(`${adminPageURL}/exercise/question/list`);
                }).catch(err => {
                    this.isLoading = false;
                });
            });
        },
        onCancel() {
            this.$router.push(`${adminPageURL}/exercise/question/list`);
        }
    }
}
</script>