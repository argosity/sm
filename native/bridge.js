export default function() {
    const transmitToApp = function(command, ...args) {
        window.postMessage(JSON.stringify({ command, args }));
    };

    // from https://github.com/scottcorgan/tiny-emitter
    function App() { }
    App.prototype = {
        on(name, callback, ctx) {
            const e = this.e || (this.e = {});
            (e[name] || (e[name] = [])).push({
                fn: callback, ctx,
            });
            return this;
        },

        once(name, callback, ctx) {
            const self = this;
            function listener() {
                self.off(name, listener);
                // eslint-disable-next-line prefer-rest-params
                callback.apply(ctx, arguments);
            }
            listener._ = callback;
            return this.on(name, listener, ctx);
        },

        emit(name) {
            // eslint-disable-next-line prefer-rest-params
            const data = [].slice.call(arguments, 1);
            const evtArr = ((this.e || (this.e = {}))[name] || []).slice();
            let i = 0;
            for (i; i < evtArr.length; i++) {
                evtArr[i].fn.apply(evtArr[i].ctx, data);
            }
            return this;
        },

        off(name, callback) {
            const e = this.e || (this.e = {});
            const evts = e[name];
            const liveEvents = [];

            if (evts && callback) {
                for (let i = 0, len = evts.length; i < len; i++) {
                    if (evts[i].fn !== callback && evts[i].fn._ !== callback) {
                        liveEvents.push(evts[i]);
                    }
                }
            }
            if (liveEvents.length) {
                e[name] = liveEvents;
            } else {
                delete e[name];
            }
            return this;
        },
        playSound(snd) { transmitToApp('playSound', snd); },
        onReady(tenant) { transmitToApp('ready', tenant); },
        startBarcodeScan() { transmitToApp('startBarcodeScan'); },
    };

    window.ShowMakerApp = new App();

    Object.defineProperty(window.ShowMakerApp, 'isReal', {
        value: true,
        writable: false,
    });
}
