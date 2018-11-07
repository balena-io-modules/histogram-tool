;
class APIMetricsBundle {
    constructor(x) {
        this.x = x;
    }
    doExport(msg) {
        return Promise.resolve(msg + ` ${this.x}`);
    }
}
APIMetricsBundle.create = () => {
    return new APIMetricsBundle(-1);
};
let a = new APIMetricsBundle(1337);
a.doExport("the value is:")
    .then((v) => {
    console.log(v);
});
let c = APIMetricsBundle.create();
//# sourceMappingURL=test.js.map