const App = {
    onReady(tenant) {
        setTimeout(() => {
            // eslint-disable-next-line
            window.ShowMakerApp && window.ShowMakerApp.onReady(tenant);
        }, 1000);
    },
    startBarcodeScan() { },
    onBarcodeScan() { },
};

export default App;

Object.keys(App).forEach((m) => {
    App[m] = (...args) => {
        if (window.ShowMakerApp && window.ShowMakerApp[m]) {
            window.ShowMakerApp[m](...args);
        }
    };
});
