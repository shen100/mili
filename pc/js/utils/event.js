export const EVENTS = {
    USER_FOLLOW_CHANGE: 'user_follow_change',
    TAG_FOLLOW_CHANGE: 'tag_follow_change',
};

export const eventEmitter = {
    listeners: {},
    on: function(eventType, listener) {
        if (typeof listener !== 'function') {
            throw new Error('listener is not a function');
        }
        this.listeners[eventType] = this.listeners[eventType] || [];
        if (this.listeners[eventType].indexOf(listener) < 0) {
            this.listeners[eventType].push(listener);
        }
    },
    remove: function(eventType, listener) {
        const listeners = this.listeners[eventType];
        if (listeners) {
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i] === listener) {
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
                listeners[i].apply(null, args);
            }
        }
    }
};