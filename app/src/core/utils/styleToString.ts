export function styleToString(style: React.CSSProperties) {
    var elm = new Option;
    Object.keys(style).forEach(function (a) {
        elm.style[ a ] = style[ a ];
    });
    return elm.getAttribute('style');
}
