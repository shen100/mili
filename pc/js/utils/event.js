export const EVENTS = {
    USER_FOLLOW_CHANGE: 'user_follow_change',
    TAG_FOLLOW_CHANGE: 'tag_follow_change',
};

function _EventEmitter() {
    this.listeners = {};
}

_EventEmitter.prototype = {
    on: function(eventType, listener, context) {
        if (typeof listener !== 'function') {
            throw new Error('listener is not a function');
        }
        this.listeners[eventType] = this.listeners[eventType] || [];
        const findResult = this.listeners[eventType].find((item) => {
            return item.listener === listener;
        });
        if (!findResult) {
            this.listeners[eventType].push({listener, context: context || null});
        }
    },
    remove: function(eventType, listener) {
        const listeners = this.listeners[eventType];
        if (listeners) {
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].listener === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function(eventType, ...args) {
        const listeners = this.listeners[eventType];
        if (listeners) {
            for (let i = 0; i < listeners.length; i++) {
                listeners[i].listener.apply(listeners[i].context, args);
            }
        }
    }
};

export const EventEmitter = _EventEmitter;
export const globalEventEmitter = new EventEmitter();