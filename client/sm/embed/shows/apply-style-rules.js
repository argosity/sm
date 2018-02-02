export default function applyStyleRules(el, rules) {
    Object.keys(rules).forEach((key) => {
        el.style.setProperty(`--sm-${key}`, rules[key]);
    });
}
