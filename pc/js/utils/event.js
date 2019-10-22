export const EVENTS = {
    USER_FOLLOW_CHANGE: 'user_follow_change',
};

export const eventEmitter = {
    listeners: {},
    on: function(type, listener) {
        if (typeof listener !== "function") {
            throw new Error('listener is not a function');
        }
        if (!this.listeners[type]) {
            this.listeners[type] = [listener];
        } else {
            var found = false;
            for (var i = 0, len = this.listeners[type].length; i < len; i++) {
                if (this.listeners[type][i] === listener) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.listeners[type].push(listener);
            }
        }
    },
    remove: function(type, listener) {
        var listeners = this.listeners[type];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function(event) {
        var listeners = this.listeners[event.type];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].call(null, event);
            }
        }
    }
};