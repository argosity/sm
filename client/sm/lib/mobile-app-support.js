const App = {
    onReady(tenant) {
        setTimeout(() => {
            // eslint-disable-next-line
            window.ShowMakerApp && window.ShowMakerApp.onReady(tenant);
        }, 1000);
    },
};

export default App;

['playSound', 'startBarcodeScan', 'on', 'once'].forEach((m) => {
    App[m] = (...args) => {
        if (window.ShowMakerApp) {
            window.ShowMakerApp[m](...args);
        }
    };
});

Object.defineProperty(App, 'isReal', {
    get() {
        return !!window.ShowMakerApp;
    },
});
