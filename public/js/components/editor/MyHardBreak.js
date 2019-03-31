import {
    HardBreak, // br
} from 'tiptap-extensions';

export default class extends HardBreak {
    get name () {
        return 'my_hard_break';
    }

    commands ({ type, }) {
        return attrs => (state, dispatch) => {
            const { selection, } = state;
            let position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            if (attrs && attrs.isCodeBlock) {
                // 插入代码块时，光标在代码块中，这时在position + 1处插入br
                position = position + 1;
            }
            const node = type.create(attrs);
            const transaction = state.tr.insert(position, node);
            dispatch(transaction);
        };
    }
};
