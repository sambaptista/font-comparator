(() => {
    'use strict';
    var e,
        i = {},
        _ = {};
    function n(e) {
        var f = _[e];
        if (void 0 !== f) return f.exports;
        var r = (_[e] = {exports: {}});
        return i[e](r, r.exports, n), r.exports;
    }
    (n.m = i),
        (e = []),
        (n.O = (f, r, t, o) => {
            if (!r) {
                var u = 1 / 0;
                for (a = 0; a < e.length; a++) {
                    for (var [r, t, o] = e[a], s = !0, l = 0; l < r.length; l++)
                        (!1 & o || u >= o) && Object.keys(n.O).every(h => n.O[h](r[l]))
                            ? r.splice(l--, 1)
                            : ((s = !1), o < u && (u = o));
                    if (s) {
                        e.splice(a--, 1);
                        var c = t();
                        void 0 !== c && (f = c);
                    }
                }
                return f;
            }
            o = o || 0;
            for (var a = e.length; a > 0 && e[a - 1][2] > o; a--) e[a] = e[a - 1];
            e[a] = [r, t, o];
        }),
        (n.o = (e, f) => Object.prototype.hasOwnProperty.call(e, f)),
        (() => {
            var e = {121: 0};
            n.O.j = t => 0 === e[t];
            var f = (t, o) => {
                    var l,
                        c,
                        [a, u, s] = o,
                        v = 0;
                    if (a.some(d => 0 !== e[d])) {
                        for (l in u) n.o(u, l) && (n.m[l] = u[l]);
                        if (s) var p = s(n);
                    }
                    for (t && t(o); v < a.length; v++) n.o(e, (c = a[v])) && e[c] && e[c][0](), (e[c] = 0);
                    return n.O(p);
                },
                r = (self.webpackChunkfont_comparator = self.webpackChunkfont_comparator || []);
            r.forEach(f.bind(null, 0)), (r.push = f.bind(null, r.push.bind(r)));
        })();
})();
