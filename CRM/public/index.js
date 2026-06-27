var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/papaparse/papaparse.min.js
var require_papaparse_min = __commonJS((exports, module) => {
  ((e, t) => {
    typeof define == "function" && define.amd ? define([], t) : typeof module == "object" && typeof exports != "undefined" ? module.exports = t() : e.Papa = t();
  })(exports, function r2() {
    var n = typeof self != "undefined" ? self : typeof window != "undefined" ? window : n !== undefined ? n : {};
    var d, s = !n.document && !!n.postMessage, a = n.IS_PAPA_WORKER || false, o = {}, h = 0, v = {};
    function P(e) {
      return e.charCodeAt(0) === 65279 ? e.slice(1) : e;
    }
    function u(e) {
      this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
        var t = b(e2);
        t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
        this._handle = new i(t), (this._handle.streamer = this)._config = t;
      }.call(this, e), this.parseChunk = function(t, e2) {
        var i2 = parseInt(this._config.skipFirstNLines) || 0;
        if (this.isFirstChunk && 0 < i2) {
          let e3 = this._config.newline;
          e3 || (r3 = this._config.quoteChar || '"', e3 = this._handle.guessLineEndings(t, r3)), t = [...t.split(e3).slice(i2)].join(e3);
        }
        this.isFirstChunk && q(this._config.beforeFirstChunk) && (r3 = this._config.beforeFirstChunk(t)) !== undefined && (t = r3), this.isFirstChunk = false, this._halted = false;
        var i2 = this._partialLine + t, r3 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
        if (!this._handle.paused() && !this._handle.aborted()) {
          t = r3.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r3 && r3.data && (this._rowCount += r3.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
          if (a)
            n.postMessage({ results: r3, workerId: v.WORKER_ID, finished: i2 });
          else if (q(this._config.chunk) && !e2) {
            if (this._config.chunk(r3, this._handle), this._handle.paused() || this._handle.aborted())
              return void (this._halted = true);
            this._completeResults = r3 = undefined;
          }
          return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r3.data), this._completeResults.errors = this._completeResults.errors.concat(r3.errors), this._completeResults.meta = r3.meta), this._completed || !i2 || !q(this._config.complete) || r3 && r3.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), i2 || r3 && r3.meta.paused || this._nextChunk(), r3;
        }
        this._halted = true;
      }, this._sendError = function(e2) {
        q(this._config.error) ? this._config.error(e2) : a && this._config.error && n.postMessage({ workerId: v.WORKER_ID, error: e2, finished: false });
      };
    }
    function f(e) {
      var r3;
      (e = e || {}).chunkSize || (e.chunkSize = v.RemoteChunkSize), u.call(this, e), this._nextChunk = s ? function() {
        this._readChunk(), this._chunkLoaded();
      } : function() {
        this._readChunk();
      }, this.stream = function(e2) {
        this._input = e2, this._nextChunk();
      }, this._readChunk = function() {
        if (this._finished)
          this._chunkLoaded();
        else {
          if (r3 = new XMLHttpRequest, this._config.withCredentials && (r3.withCredentials = this._config.withCredentials), s || (r3.onload = y(this._chunkLoaded, this), r3.onerror = y(this._chunkError, this)), r3.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
            var e2, t = this._config.downloadRequestHeaders;
            for (e2 in t)
              r3.setRequestHeader(e2, t[e2]);
          }
          var i2;
          this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r3.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
          try {
            r3.send(this._config.downloadRequestBody);
          } catch (e3) {
            this._chunkError(e3.message);
          }
          s && r3.status === 0 && this._chunkError();
        }
      }, this._chunkLoaded = function() {
        r3.readyState === 4 && (r3.status < 200 || 400 <= r3.status ? this._chunkError() : (this._start += this._config.chunkSize || r3.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => (e2 = e2.getResponseHeader("Content-Range")) !== null ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r3), this.parseChunk(r3.responseText)));
      }, this._chunkError = function(e2) {
        e2 = r3.statusText || e2;
        this._sendError(new Error(e2));
      };
    }
    function l(e) {
      (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), u.call(this, e);
      var i2, r3, n2 = typeof FileReader != "undefined";
      this.stream = function(e2) {
        this._input = e2, r3 = e2.slice || e2.webkitSlice || e2.mozSlice, n2 ? ((i2 = new FileReader).onload = y(this._chunkLoaded, this), i2.onerror = y(this._chunkError, this)) : i2 = new FileReaderSync, this._nextChunk();
      }, this._nextChunk = function() {
        this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
      }, this._readChunk = function() {
        var e2 = this._input, t = (this._config.chunkSize && (t = Math.min(this._start + this._config.chunkSize, this._input.size), e2 = r3.call(e2, this._start, t)), i2.readAsText(e2, this._config.encoding));
        n2 || this._chunkLoaded({ target: { result: t } });
      }, this._chunkLoaded = function(e2) {
        this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
      }, this._chunkError = function() {
        this._sendError(i2.error);
      };
    }
    function c(e) {
      var i2;
      u.call(this, e = e || {}), this.stream = function(e2) {
        return i2 = e2, this._nextChunk();
      }, this._nextChunk = function() {
        var e2, t;
        if (!this._finished)
          return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
      };
    }
    function p(e) {
      u.call(this, e = e || {});
      var t = [], i2 = true, r3 = false;
      this.pause = function() {
        u.prototype.pause.apply(this, arguments), this._input.pause();
      }, this.resume = function() {
        u.prototype.resume.apply(this, arguments), this._input.resume();
      }, this.stream = function(e2) {
        this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
      }, this._checkIsFinished = function() {
        r3 && t.length === 1 && (this._finished = true);
      }, this._nextChunk = function() {
        this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
      }, this._streamData = y(function(e2) {
        try {
          t.push(typeof e2 == "string" ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
        } catch (e3) {
          this._streamError(e3);
        }
      }, this), this._streamError = y(function(e2) {
        this._streamCleanUp(), this._sendError(e2);
      }, this), this._streamEnd = y(function() {
        this._streamCleanUp(), r3 = true, this._streamData("");
      }, this), this._streamCleanUp = y(function() {
        this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
      }, this);
    }
    function i(m2) {
      var n2, s2, a2, t, o2 = Math.pow(2, 53), h2 = -o2, u2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, d2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, i2 = this, r3 = 0, f2 = 0, l2 = false, e = false, c2 = [], p2 = { data: [], errors: [], meta: {} };
      function y2(e2) {
        return m2.skipEmptyLines === "greedy" ? e2.join("").trim() === "" : e2.length === 1 && e2[0].length === 0;
      }
      function g2() {
        if (p2 && a2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
          return !y2(e3);
        })), _2()) {
          let t3 = function(e3, t4) {
            e3 = P(e3), q(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
          };
          var t2 = t3;
          if (p2)
            if (Array.isArray(p2.data[0])) {
              for (var e2 = 0;_2() && e2 < p2.data.length; e2++)
                p2.data[e2].forEach(t3);
              p2.data.splice(0, 1);
            } else
              p2.data.forEach(t3);
        }
        function i3(e3, t3) {
          for (var i4 = m2.header ? {} : [], r5 = 0;r5 < e3.length; r5++) {
            var n3 = r5, s3 = e3[r5], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && m2.dynamicTyping[e5] === undefined && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), (m2.dynamicTyping[e5] || m2.dynamicTyping) === true))(e4) ? t4 === "true" || t4 === "TRUE" || t4 !== "false" && t4 !== "FALSE" && (((e5) => {
              if (u2.test(e5)) {
                e5 = parseFloat(e5);
                if (h2 < e5 && e5 < o2)
                  return 1;
              }
            })(t4) ? parseFloat(t4) : d2.test(t4) ? new Date(t4) : t4 === "" ? null : t4) : t4)(n3 = m2.header ? r5 >= c2.length ? "__parsed_extra" : c2[r5] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
            n3 === "__parsed_extra" ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
          }
          return m2.header && (r5 > c2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r5, f2 + t3) : r5 < c2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r5, f2 + t3)), i4;
        }
        var r4;
        p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r4 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r4 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r4);
      }
      function _2() {
        return m2.header && c2.length === 0;
      }
      function k(e2, t2, i3, r4) {
        e2 = { type: e2, code: t2, message: i3 };
        r4 !== undefined && (e2.row = r4), p2.errors.push(e2);
      }
      q(m2.step) && (t = m2.step, m2.step = function(e2) {
        p2 = e2, _2() ? g2() : (g2(), p2.data.length !== 0 && (r3 += e2.data.length, m2.preview && r3 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
      }), this.parse = function(e2, t2, i3) {
        var r4 = m2.quoteChar || '"', r4 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r4)), a2 = false, m2.delimiter ? q(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r4 = ((e3, t3, i4, r5, n3) => {
          var s3, a3, o3, h3;
          n3 = n3 || [",", "\t", "|", ";", v.RECORD_SEP, v.UNIT_SEP];
          for (var u3 = 0;u3 < n3.length; u3++) {
            for (var d3, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = undefined, new E({ comments: r5, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _3 = 0;_3 < g3.data.length; _3++)
              i4 && y2(g3.data[_3]) ? p3++ : (d3 = g3.data[_3].length, c3 += d3, o3 === undefined ? o3 = d3 : 0 < d3 && (l3 += Math.abs(d3 - o3), o3 = d3));
            0 < g3.data.length && (c3 /= g3.data.length - p3), (a3 === undefined || l3 <= a3) && (h3 === undefined || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
          }
          return { successful: !!(m2.delimiter = s3), bestDelimiter: s3 };
        })(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess)).successful ? m2.delimiter = r4.bestDelimiter : (a2 = true, m2.delimiter = v.DefaultDelimiter), p2.meta.delimiter = m2.delimiter), b(m2));
        return m2.preview && m2.header && r4.preview++, n2 = e2, s2 = new E(r4), p2 = s2.parse(n2, t2, i3), g2(), l2 ? { meta: { paused: true } } : p2 || { meta: { paused: false } };
      }, this.paused = function() {
        return l2;
      }, this.pause = function() {
        l2 = true, s2.abort(), n2 = q(m2.chunk) ? "" : n2.substring(s2.getCharIndex());
      }, this.resume = function() {
        i2.streamer._halted ? (l2 = false, i2.streamer.parseChunk(n2, true)) : setTimeout(i2.resume, 3);
      }, this.aborted = function() {
        return e;
      }, this.abort = function() {
        e = true, s2.abort(), p2.meta.aborted = true, q(m2.complete) && m2.complete(p2), n2 = "";
      }, this.guessLineEndings = function(e2, t2) {
        e2 = e2.substring(0, 1048576);
        var t2 = new RegExp(U(t2) + "([^]*?)" + U(t2), "gm"), i3 = (e2 = e2.replace(t2, "")).split("\r"), t2 = e2.split(`
`), e2 = 1 < t2.length && t2[0].length < i3[0].length;
        if (i3.length === 1 || e2)
          return `
`;
        for (var r4 = 0, n3 = 0;n3 < i3.length; n3++)
          i3[n3][0] === `
` && r4++;
        return r4 >= i3.length / 2 ? `\r
` : "\r";
      };
    }
    function U(e) {
      return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function E(C) {
      var S = (C = C || {}).delimiter, O = C.newline, x = C.comments, I = C.step, A = C.preview, T = C.fastMode, D = null, L = false, F = C.quoteChar == null ? '"' : C.quoteChar, j = F;
      if (C.escapeChar !== undefined && (j = C.escapeChar), (typeof S != "string" || -1 < v.BAD_DELIMITERS.indexOf(S)) && (S = ","), x === S)
        throw new Error("Comment character same as delimiter");
      x === true ? x = "#" : (typeof x != "string" || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = false), O !== `
` && O !== "\r" && O !== `\r
` && (O = `
`);
      var z = 0, M = false;
      this.parse = function(i2, t, r3) {
        if (typeof i2 != "string")
          throw new Error("Input must be a string");
        var n2 = i2.length, e = S.length, s2 = O.length, a2 = x.length, o2 = q(I), h2 = [], u2 = [], d2 = [], f2 = z = 0;
        if (!i2)
          return w();
        if (T || T !== false && i2.indexOf(F) === -1) {
          for (var l2 = i2.split(O), c2 = 0;c2 < l2.length; c2++) {
            if (d2 = l2[c2], z += d2.length, c2 !== l2.length - 1)
              z += O.length;
            else if (r3)
              return w();
            if (!x || d2.substring(0, a2) !== x) {
              if (o2) {
                if (h2 = [], k(d2.split(S)), R(), M)
                  return w();
              } else
                k(d2.split(S));
              if (A && A <= c2)
                return h2 = h2.slice(0, A), w(true);
            }
          }
          return w();
        }
        for (var p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z), _2 = new RegExp(U(j) + U(F), "g"), m2 = i2.indexOf(F, z);; )
          if (i2[z] === F)
            for (m2 = z, z++;; ) {
              if ((m2 = i2.indexOf(F, m2 + 1)) === -1)
                return r3 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z }), E2();
              if (m2 === n2 - 1)
                return E2(i2.substring(z, m2).replace(_2, F));
              if (F === j && i2[m2 + 1] === j)
                m2++;
              else if (F === j || m2 === 0 || i2[m2 - 1] !== j) {
                p2 !== -1 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
                var y2 = v2((g2 = g2 !== -1 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) === -1 ? p2 : Math.min(p2, g2));
                if (i2.substr(m2 + 1 + y2, e) === S) {
                  d2.push(i2.substring(z, m2).replace(_2, F)), i2[z = m2 + 1 + y2 + e] !== F && (m2 = i2.indexOf(F, z)), p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z);
                  break;
                }
                y2 = v2(g2);
                if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                  if (d2.push(i2.substring(z, m2).replace(_2, F)), b2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z), m2 = i2.indexOf(F, z), o2 && (R(), M))
                    return w();
                  if (A && h2.length >= A)
                    return w(true);
                  break;
                }
                u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z }), m2++;
              }
            }
          else if (x && d2.length === 0 && i2.substring(z, z + a2) === x) {
            if (g2 === -1)
              return w();
            z = g2 + s2, g2 = i2.indexOf(O, z), p2 = i2.indexOf(S, z);
          } else if (p2 !== -1 && (p2 < g2 || g2 === -1))
            d2.push(i2.substring(z, p2)), z = p2 + e, p2 = i2.indexOf(S, z);
          else {
            if (g2 === -1)
              break;
            if (d2.push(i2.substring(z, g2)), b2(g2 + s2), o2 && (R(), M))
              return w();
            if (A && h2.length >= A)
              return w(true);
          }
        return E2();
        function k(e2) {
          h2.push(e2), f2 = z;
        }
        function v2(e2) {
          var t2 = 0;
          return t2 = e2 !== -1 && (e2 = i2.substring(m2 + 1, e2)) && e2.trim() === "" ? e2.length : t2;
        }
        function E2(e2) {
          return r3 || (e2 === undefined && (e2 = i2.substring(z)), d2.push(e2), z = n2, k(d2), o2 && R()), w();
        }
        function b2(e2) {
          z = e2, k(d2), d2 = [], g2 = i2.indexOf(O, z);
        }
        function w(e2) {
          if (C.header && !t && h2.length && !L) {
            var s3 = h2[0], a3 = Object.create(null), o3 = new Set(s3);
            let n3 = false;
            for (let r4 = 0;r4 < s3.length; r4++) {
              let i3 = P(s3[r4]);
              if (a3[i3 = q(C.transformHeader) ? C.transformHeader(i3, r4) : i3]) {
                let e3, t2 = a3[i3];
                for (;e3 = i3 + "_" + t2, t2++, o3.has(e3); )
                  ;
                o3.add(e3), s3[r4] = e3, a3[i3]++, n3 = true, (D = D === null ? {} : D)[e3] = i3;
              } else
                a3[i3] = 1, s3[r4] = i3;
              o3.add(i3);
            }
            n3 && console.warn("Duplicate headers found and renamed."), L = true;
          }
          return { data: h2, errors: u2, meta: { delimiter: S, linebreak: O, aborted: M, truncated: !!e2, cursor: f2 + (t || 0), renamedHeaders: D } };
        }
        function R() {
          I(w()), h2 = [], u2 = [];
        }
      }, this.abort = function() {
        M = true;
      }, this.getCharIndex = function() {
        return z;
      };
    }
    function g(e) {
      var t = e.data, i2 = o[t.workerId], r3 = false;
      if (t.error)
        i2.userError(t.error, t.file);
      else if (t.results && t.results.data) {
        var n2 = { abort: function() {
          r3 = true, _(t.workerId, { data: [], errors: [], meta: { aborted: true } });
        }, pause: m, resume: m };
        if (q(i2.userStep)) {
          for (var s2 = 0;s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r3); s2++)
            ;
          delete t.results;
        } else
          q(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
      }
      t.finished && !r3 && _(t.workerId, t.results);
    }
    function _(e, t) {
      var i2 = o[e];
      q(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete o[e];
    }
    function m() {
      throw new Error("Not implemented.");
    }
    function b(e) {
      if (typeof e != "object" || e === null)
        return e;
      var t, i2 = Array.isArray(e) ? [] : {};
      for (t in e)
        i2[t] = b(e[t]);
      return i2;
    }
    function y(e, t) {
      return function() {
        e.apply(t, arguments);
      };
    }
    function q(e) {
      return typeof e == "function";
    }
    return v.parse = function(e, t) {
      var i2 = (t = t || {}).dynamicTyping || false;
      q(i2) && (t.dynamicTypingFunction = i2, i2 = {});
      if (t.dynamicTyping = i2, t.transform = !!q(t.transform) && t.transform, !t.worker || !v.WORKERS_SUPPORTED)
        return i2 = null, v.NODE_STREAM_INPUT, typeof e == "string" ? (e = P(e), i2 = new (t.download ? f : c)(t)) : e.readable === true && q(e.read) && q(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
      (i2 = (() => {
        var e2;
        return !!v.WORKERS_SUPPORTED && (e2 = (() => {
          var e3 = n.URL || n.webkitURL || null, t2 = r2.toString();
          return v.BLOB_URL || (v.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
        })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
      })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = q(t.step), t.chunk = q(t.chunk), t.complete = q(t.complete), t.error = q(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
    }, v.unparse = function(e, t) {
      var s2 = false, _2 = true, m2 = ",", y2 = `\r
`, a2 = '"', o2 = a2 + a2, i2 = false, r3 = null, h2 = false, u2 = ((() => {
        if (typeof t == "object") {
          if (typeof t.delimiter != "string" || v.BAD_DELIMITERS.filter(function(e2) {
            return t.delimiter.indexOf(e2) !== -1;
          }).length || (m2 = t.delimiter), typeof t.quotes != "boolean" && typeof t.quotes != "function" && !Array.isArray(t.quotes) || (s2 = t.quotes), typeof t.skipEmptyLines != "boolean" && typeof t.skipEmptyLines != "string" || (i2 = t.skipEmptyLines), typeof t.newline == "string" && (y2 = t.newline), typeof t.quoteChar == "string" && (a2 = t.quoteChar, o2 = a2 + a2), typeof t.header == "boolean" && (_2 = t.header), Array.isArray(t.columns)) {
            if (t.columns.length === 0)
              throw new Error("Option columns is empty");
            r3 = t.columns;
          }
          t.escapeChar !== undefined && (o2 = t.escapeChar + a2), t.escapeFormulae instanceof RegExp ? h2 = t.escapeFormulae : typeof t.escapeFormulae == "boolean" && t.escapeFormulae && (h2 = /^[=+\-@\t\r].*$/);
        }
      })(), new RegExp(U(a2), "g"));
      typeof e == "string" && (e = JSON.parse(e));
      if (Array.isArray(e)) {
        if (!e.length || Array.isArray(e[0]))
          return n2(null, e, i2);
        if (typeof e[0] == "object")
          return n2(r3 || Object.keys(e[0]), e, i2);
      } else if (typeof e == "object")
        return typeof e.data == "string" && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r3), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : typeof e.data[0] == "object" ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || typeof e.data[0] == "object" || (e.data = [e.data])), n2(e.fields || [], e.data || [], i2);
      throw new Error("Unable to serialize unrecognized input");
      function n2(e2, t2, i3) {
        var r4 = "", n3 = (typeof e2 == "string" && (e2 = JSON.parse(e2)), typeof t2 == "string" && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
        if (n3 && _2) {
          for (var a3 = 0;a3 < e2.length; a3++)
            0 < a3 && (r4 += m2), r4 += k(e2[a3], a3);
          0 < t2.length && (r4 += y2);
        }
        for (var o3 = 0;o3 < t2.length; o3++) {
          var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d2 = n3 ? Object.keys(t2[o3]).length === 0 : t2[o3].length === 0;
          if (i3 && !n3 && (u3 = i3 === "greedy" ? t2[o3].join("").trim() === "" : t2[o3].length === 1 && t2[o3][0].length === 0), i3 === "greedy" && n3) {
            for (var f2 = [], l2 = 0;l2 < h3; l2++) {
              var c2 = s3 ? e2[l2] : l2;
              f2.push(t2[o3][c2]);
            }
            u3 = f2.join("").trim() === "";
          }
          if (!u3) {
            for (var p2 = 0;p2 < h3; p2++) {
              0 < p2 && !d2 && (r4 += m2);
              var g2 = n3 && s3 ? e2[p2] : p2;
              r4 += k(t2[o3][g2], p2);
            }
            o3 < t2.length - 1 && (!i3 || 0 < h3 && !d2) && (r4 += y2);
          }
        }
        return r4;
      }
      function k(e2, t2) {
        var i3, r4, n3;
        return e2 == null ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (n3 = false, h2 && typeof e2 == "string" && h2.test(e2) && (e2 = "'" + e2, n3 = true), r4 = (i3 = e2.toString()).replace(u2, o2), (n3 = n3 || s2 === true || typeof s2 == "function" && s2(e2, t2) || Array.isArray(s2) && s2[t2] || ((e3, t3) => {
          for (var i4 = 0;i4 < t3.length; i4++)
            if (-1 < e3.indexOf(t3[i4]))
              return true;
          return false;
        })(r4, v.BAD_DELIMITERS) || -1 < r4.indexOf(m2) || -1 < i3.indexOf(a2) || r4.charAt(0) === " " || r4.charAt(r4.length - 1) === " ") ? a2 + r4 + a2 : r4);
      }
    }, v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\uFEFF", v.BAD_DELIMITERS = ["\r", `
`, '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !s && !!n.Worker, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = E, v.ParserHandle = i, v.NetworkStreamer = f, v.FileStreamer = l, v.StringStreamer = c, v.ReadableStreamStreamer = p, n.jQuery && ((d = n.jQuery).fn.parse = function(o2) {
      var i2 = o2.config || {}, h2 = [];
      return this.each(function(e2) {
        if (!(d(this).prop("tagName").toUpperCase() === "INPUT" && d(this).attr("type").toLowerCase() === "file" && n.FileReader) || !this.files || this.files.length === 0)
          return true;
        for (var t = 0;t < this.files.length; t++)
          h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
      }), e(), this;
      function e() {
        if (h2.length === 0)
          q(o2.complete) && o2.complete();
        else {
          var e2, t, i3, r3, n2 = h2[0];
          if (q(o2.before)) {
            var s2 = o2.before(n2.file, n2.inputElem);
            if (typeof s2 == "object") {
              if (s2.action === "abort")
                return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r3 = s2.reason, void (q(o2.error) && o2.error({ name: e2 }, t, i3, r3));
              if (s2.action === "skip")
                return void u2();
              typeof s2.config == "object" && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
            } else if (s2 === "skip")
              return void u2();
          }
          var a2 = n2.instanceConfig.complete;
          n2.instanceConfig.complete = function(e3) {
            q(a2) && a2(e3, n2.file, n2.inputElem), u2();
          }, v.parse(n2.file, n2.instanceConfig);
        }
      }
      function u2() {
        h2.splice(0, 1), e();
      }
    }), a && (n.onmessage = function(e) {
      e = e.data;
      v.WORKER_ID === undefined && e && (v.WORKER_ID = e.workerId);
      typeof e.input == "string" ? n.postMessage({ workerId: v.WORKER_ID, results: v.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v.parse(e.input, e.config)) && n.postMessage({ workerId: v.WORKER_ID, results: e, finished: true });
    }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v;
  });
});

// node_modules/esm-env/true.js
var true_default = true;
// node_modules/svelte/src/internal/shared/utils.js
var is_array = Array.isArray;
var index_of = Array.prototype.indexOf;
var includes = Array.prototype.includes;
var array_from = Array.from;
var object_keys = Object.keys;
var define_property = Object.defineProperty;
var get_descriptor = Object.getOwnPropertyDescriptor;
var get_descriptors = Object.getOwnPropertyDescriptors;
var object_prototype = Object.prototype;
var array_prototype = Array.prototype;
var get_prototype_of = Object.getPrototypeOf;
var is_extensible = Object.isExtensible;
function is_function(thing) {
  return typeof thing === "function";
}
var noop = () => {};
function run(fn) {
  return fn();
}
function run_all(arr) {
  for (var i = 0;i < arr.length; i++) {
    arr[i]();
  }
}
function deferred() {
  var resolve;
  var reject;
  var promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
function to_array(value, n) {
  if (Array.isArray(value)) {
    return value;
  }
  if (n === undefined || !(Symbol.iterator in value)) {
    return Array.from(value);
  }
  const array = [];
  for (const element of value) {
    array.push(element);
    if (array.length === n)
      break;
  }
  return array;
}

// node_modules/svelte/src/internal/client/constants.js
var DERIVED = 1 << 1;
var EFFECT = 1 << 2;
var RENDER_EFFECT = 1 << 3;
var MANAGED_EFFECT = 1 << 24;
var BLOCK_EFFECT = 1 << 4;
var BRANCH_EFFECT = 1 << 5;
var ROOT_EFFECT = 1 << 6;
var BOUNDARY_EFFECT = 1 << 7;
var CONNECTED = 1 << 9;
var CLEAN = 1 << 10;
var DIRTY = 1 << 11;
var MAYBE_DIRTY = 1 << 12;
var INERT = 1 << 13;
var DESTROYED = 1 << 14;
var REACTION_RAN = 1 << 15;
var DESTROYING = 1 << 25;
var EFFECT_TRANSPARENT = 1 << 16;
var EAGER_EFFECT = 1 << 17;
var HEAD_EFFECT = 1 << 18;
var EFFECT_PRESERVED = 1 << 19;
var USER_EFFECT = 1 << 20;
var EFFECT_OFFSCREEN = 1 << 25;
var WAS_MARKED = 1 << 16;
var REACTION_IS_UPDATING = 1 << 21;
var ASYNC = 1 << 22;
var ERROR_VALUE = 1 << 23;
var STATE_SYMBOL = Symbol("$state");
var LEGACY_PROPS = Symbol("legacy props");
var LOADING_ATTR_SYMBOL = Symbol("");
var PROXY_PATH_SYMBOL = Symbol("proxy path");
var ATTRIBUTES_CACHE = Symbol("attributes");
var CLASS_CACHE = Symbol("class");
var STYLE_CACHE = Symbol("style");
var TEXT_CACHE = Symbol("text");
var FORM_RESET_HANDLER = Symbol("form reset");
var HMR_ANCHOR = Symbol("hmr anchor");
var STALE_REACTION = new class StaleReactionError extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
};
var IS_XHTML = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

// node_modules/svelte/src/internal/shared/errors.js
function invariant_violation(message) {
  if (true_default) {
    const error = new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${message}"
https://svelte.dev/e/invariant_violation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/invariant_violation`);
  }
}
function lifecycle_outside_component(name) {
  if (true_default) {
    const error = new Error(`lifecycle_outside_component
\`${name}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/lifecycle_outside_component`);
  }
}

// node_modules/svelte/src/internal/client/errors.js
function async_derived_orphan() {
  if (true_default) {
    const error = new Error(`async_derived_orphan
Cannot create a \`$derived(...)\` with an \`await\` expression outside of an effect tree
https://svelte.dev/e/async_derived_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/async_derived_orphan`);
  }
}
function bind_invalid_checkbox_value() {
  if (true_default) {
    const error = new Error(`bind_invalid_checkbox_value
Using \`bind:value\` together with a checkbox input is not allowed. Use \`bind:checked\` instead
https://svelte.dev/e/bind_invalid_checkbox_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/bind_invalid_checkbox_value`);
  }
}
function derived_references_self() {
  if (true_default) {
    const error = new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/derived_references_self`);
  }
}
function each_key_duplicate(a, b, value) {
  if (true_default) {
    const error = new Error(`each_key_duplicate
${value ? `Keyed each block has duplicate key \`${value}\` at indexes ${a} and ${b}` : `Keyed each block has duplicate key at indexes ${a} and ${b}`}
https://svelte.dev/e/each_key_duplicate`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_duplicate`);
  }
}
function each_key_volatile(index, a, b) {
  if (true_default) {
    const error = new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${index} was \`${a}\` but is now \`${b}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/each_key_volatile`);
  }
}
function effect_in_teardown(rune) {
  if (true_default) {
    const error = new Error(`effect_in_teardown
\`${rune}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_teardown`);
  }
}
function effect_in_unowned_derived() {
  if (true_default) {
    const error = new Error(`effect_in_unowned_derived
Effect cannot be created inside a \`$derived\` value that was not itself created inside an effect
https://svelte.dev/e/effect_in_unowned_derived`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
  }
}
function effect_orphan(rune) {
  if (true_default) {
    const error = new Error(`effect_orphan
\`${rune}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_orphan`);
  }
}
function effect_update_depth_exceeded() {
  if (true_default) {
    const error = new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
  }
}
function hydration_failed() {
  if (true_default) {
    const error = new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/hydration_failed`);
  }
}
function props_invalid_value(key) {
  if (true_default) {
    const error = new Error(`props_invalid_value
Cannot do \`bind:${key}={undefined}\` when \`${key}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/props_invalid_value`);
  }
}
function rune_outside_svelte(rune) {
  if (true_default) {
    const error = new Error(`rune_outside_svelte
The \`${rune}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/rune_outside_svelte`);
  }
}
function state_descriptors_fixed() {
  if (true_default) {
    const error = new Error(`state_descriptors_fixed
Property descriptors defined on \`$state\` objects must contain \`value\` and always be \`enumerable\`, \`configurable\` and \`writable\`.
https://svelte.dev/e/state_descriptors_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
  }
}
function state_prototype_fixed() {
  if (true_default) {
    const error = new Error(`state_prototype_fixed
Cannot set prototype of \`$state\` object
https://svelte.dev/e/state_prototype_fixed`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
  }
}
function state_unsafe_mutation() {
  if (true_default) {
    const error = new Error(`state_unsafe_mutation
Updating state inside \`$derived(...)\`, \`$inspect(...)\` or a template expression is forbidden. If the value should not be reactive, declare it without \`$state\`
https://svelte.dev/e/state_unsafe_mutation`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
  }
}
function svelte_boundary_reset_onerror() {
  if (true_default) {
    const error = new Error(`svelte_boundary_reset_onerror
A \`<svelte:boundary>\` \`reset\` function cannot be called while an error is still being handled
https://svelte.dev/e/svelte_boundary_reset_onerror`);
    error.name = "Svelte error";
    throw error;
  } else {
    throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
  }
}

// node_modules/svelte/src/constants.js
var EACH_ITEM_REACTIVE = 1;
var EACH_INDEX_REACTIVE = 1 << 1;
var EACH_IS_CONTROLLED = 1 << 2;
var EACH_IS_ANIMATED = 1 << 3;
var EACH_ITEM_IMMUTABLE = 1 << 4;
var PROPS_IS_IMMUTABLE = 1;
var PROPS_IS_RUNES = 1 << 1;
var PROPS_IS_UPDATED = 1 << 2;
var PROPS_IS_BINDABLE = 1 << 3;
var PROPS_IS_LAZY_INITIAL = 1 << 4;
var TRANSITION_OUT = 1 << 1;
var TRANSITION_GLOBAL = 1 << 2;
var TEMPLATE_FRAGMENT = 1;
var TEMPLATE_USE_IMPORT_NODE = 1 << 1;
var TEMPLATE_USE_SVG = 1 << 2;
var TEMPLATE_USE_MATHML = 1 << 3;
var HYDRATION_START = "[";
var HYDRATION_START_ELSE = "[!";
var HYDRATION_START_FAILED = "[?";
var HYDRATION_END = "]";
var HYDRATION_ERROR = {};
var ELEMENT_PRESERVE_ATTRIBUTE_CASE = 1 << 1;
var ELEMENT_IS_INPUT = 1 << 2;
var UNINITIALIZED = Symbol("uninitialized");
var FILENAME = Symbol("filename");
var HMR = Symbol("hmr");
var NAMESPACE_HTML = "http://www.w3.org/1999/xhtml";
var NAMESPACE_SVG = "http://www.w3.org/2000/svg";
var ATTACHMENT_KEY = "@attach";

// node_modules/svelte/src/internal/client/warnings.js
var bold = "font-weight: bold";
var normal = "font-weight: normal";
function await_reactivity_loss(name) {
  if (true_default) {
    console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${name}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_reactivity_loss`);
  }
}
function await_waterfall(name, location) {
  if (true_default) {
    console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${name}\` (${location}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/await_waterfall`);
  }
}
function derived_inert() {
  if (true_default) {
    console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/derived_inert`);
  }
}
function hydration_attribute_changed(attribute, html, value) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${attribute}\` attribute on \`${html}\` changed its value between server and client renders. The client value, \`${value}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_attribute_changed`);
  }
}
function hydration_mismatch(location) {
  if (true_default) {
    console.warn(`%c[svelte] hydration_mismatch
%c${location ? `Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${location}` : "Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
  }
}
function lifecycle_double_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/lifecycle_double_unmount`);
  }
}
function select_multiple_invalid_value() {
  if (true_default) {
    console.warn(`%c[svelte] select_multiple_invalid_value
%cThe \`value\` property of a \`<select multiple>\` element should be an array, but it received a non-array value. The selection will be kept as is.
https://svelte.dev/e/select_multiple_invalid_value`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/select_multiple_invalid_value`);
  }
}
function state_proxy_equality_mismatch(operator) {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${operator}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_equality_mismatch`);
  }
}
function state_proxy_unmount() {
  if (true_default) {
    console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/state_proxy_unmount`);
  }
}
function svelte_boundary_reset_noop() {
  if (true_default) {
    console.warn(`%c[svelte] svelte_boundary_reset_noop
%cA \`<svelte:boundary>\` \`reset\` function only resets the boundary the first time it is called
https://svelte.dev/e/svelte_boundary_reset_noop`, bold, normal);
  } else {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
  }
}

// node_modules/svelte/src/internal/client/dom/hydration.js
var hydrating = false;
function set_hydrating(value) {
  hydrating = value;
}
var hydrate_node;
function set_hydrate_node(node) {
  if (node === null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return hydrate_node = node;
}
function hydrate_next() {
  return set_hydrate_node(get_next_sibling(hydrate_node));
}
function reset(node) {
  if (!hydrating)
    return;
  if (get_next_sibling(hydrate_node) !== null) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  hydrate_node = node;
}
function next(count = 1) {
  if (hydrating) {
    var i = count;
    var node = hydrate_node;
    while (i--) {
      node = get_next_sibling(node);
    }
    hydrate_node = node;
  }
}
function skip_nodes(remove = true) {
  var depth = 0;
  var node = hydrate_node;
  while (true) {
    if (node.nodeType === COMMENT_NODE) {
      var data = node.data;
      if (data === HYDRATION_END) {
        if (depth === 0)
          return node;
        depth -= 1;
      } else if (data === HYDRATION_START || data === HYDRATION_START_ELSE || data[0] === "[" && !isNaN(Number(data.slice(1)))) {
        depth += 1;
      }
    }
    var next2 = get_next_sibling(node);
    if (remove)
      node.remove();
    node = next2;
  }
}
function read_hydration_instruction(node) {
  if (!node || node.nodeType !== COMMENT_NODE) {
    hydration_mismatch();
    throw HYDRATION_ERROR;
  }
  return node.data;
}

// node_modules/svelte/src/internal/client/reactivity/equality.js
function equals(value) {
  return value === this.v;
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
}
function safe_equals(value) {
  return !safe_not_equal(value, this.v);
}

// node_modules/svelte/src/internal/flags/index.js
var async_mode_flag = false;
var legacy_mode_flag = false;
var tracing_mode_flag = false;
function enable_legacy_mode_flag() {
  legacy_mode_flag = true;
}

// node_modules/svelte/src/internal/client/dev/tracing.js
var tracing_expressions = null;
function tag(source, label) {
  source.label = label;
  tag_proxy(source.v, label);
  return source;
}
function tag_proxy(value, label) {
  value?.[PROXY_PATH_SYMBOL]?.(label);
  return value;
}

// node_modules/svelte/src/internal/shared/dev.js
function get_error(label) {
  const error = new Error;
  const stack = get_stack();
  if (stack.length === 0) {
    return null;
  }
  stack.unshift(`
`);
  define_property(error, "stack", {
    value: stack.join(`
`)
  });
  define_property(error, "name", {
    value: label
  });
  return error;
}
function get_stack() {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = limit;
  if (!stack)
    return [];
  const lines = stack.split(`
`);
  const new_lines = [];
  for (let i = 0;i < lines.length; i++) {
    const line = lines[i];
    const posixified = line.replaceAll("\\", "/");
    if (line.trim() === "Error") {
      continue;
    }
    if (line.includes("validate_each_keys")) {
      return [];
    }
    if (posixified.includes("svelte/src/internal") || posixified.includes("node_modules/.vite")) {
      continue;
    }
    new_lines.push(line);
  }
  return new_lines;
}
function invariant(condition, message) {
  if (!true_default) {
    throw new Error("invariant(...) was not guarded by if (DEV)");
  }
  if (!condition)
    invariant_violation(message);
}

// node_modules/svelte/src/internal/client/context.js
var component_context = null;
function set_component_context(context) {
  component_context = context;
}
var dev_stack = null;
function set_dev_stack(stack) {
  dev_stack = stack;
}
var dev_current_component_function = null;
function set_dev_current_component_function(fn) {
  dev_current_component_function = fn;
}
function push(props, runes = false, fn) {
  component_context = {
    p: component_context,
    i: false,
    c: null,
    e: null,
    s: props,
    x: null,
    r: active_effect,
    l: legacy_mode_flag && !runes ? { s: null, u: null, $: [] } : null
  };
  if (true_default) {
    component_context.function = fn;
    dev_current_component_function = fn;
  }
}
function pop(component) {
  var context = component_context;
  var effects = context.e;
  if (effects !== null) {
    context.e = null;
    for (var fn of effects) {
      create_user_effect(fn);
    }
  }
  if (component !== undefined) {
    context.x = component;
  }
  context.i = true;
  component_context = context.p;
  if (true_default) {
    dev_current_component_function = component_context?.function ?? null;
  }
  return component ?? {};
}
function is_runes() {
  return !legacy_mode_flag || component_context !== null && component_context.l === null;
}

// node_modules/svelte/src/internal/client/dom/task.js
var micro_tasks = [];
function run_micro_tasks() {
  var tasks = micro_tasks;
  micro_tasks = [];
  run_all(tasks);
}
function queue_micro_task(fn) {
  if (micro_tasks.length === 0 && !is_flushing_sync) {
    var tasks = micro_tasks;
    queueMicrotask(() => {
      if (tasks === micro_tasks)
        run_micro_tasks();
    });
  }
  micro_tasks.push(fn);
}
function flush_tasks() {
  while (micro_tasks.length > 0) {
    run_micro_tasks();
  }
}

// node_modules/svelte/src/internal/client/error-handling.js
var adjustments = new WeakMap;
function handle_error(error) {
  var effect = active_effect;
  if (effect === null) {
    active_reaction.f |= ERROR_VALUE;
    return error;
  }
  if (true_default && error instanceof Error && !adjustments.has(error)) {
    adjustments.set(error, get_adjustments(error, effect));
  }
  if ((effect.f & REACTION_RAN) === 0 && (effect.f & EFFECT) === 0) {
    if (true_default && !effect.parent && error instanceof Error) {
      apply_adjustments(error);
    }
    throw error;
  }
  invoke_error_boundary(error, effect);
}
function invoke_error_boundary(error, effect) {
  if (effect !== null && (effect.f & DESTROYED) !== 0) {
    return;
  }
  while (effect !== null) {
    if ((effect.f & BOUNDARY_EFFECT) !== 0) {
      if ((effect.f & REACTION_RAN) === 0) {
        throw error;
      }
      try {
        effect.b.error(error);
        return;
      } catch (e) {
        error = e;
      }
    }
    effect = effect.parent;
  }
  if (true_default && error instanceof Error) {
    apply_adjustments(error);
  }
  throw error;
}
function get_adjustments(error, effect) {
  const message_descriptor = get_descriptor(error, "message");
  if (message_descriptor && !message_descriptor.configurable)
    return;
  var indent = is_firefox ? "  " : "\t";
  var component_stack = `
${indent}in ${effect.fn?.name || "<unknown>"}`;
  var context = effect.ctx;
  while (context !== null) {
    component_stack += `
${indent}in ${context.function?.[FILENAME].split("/").pop()}`;
    context = context.p;
  }
  return {
    message: error.message + `
${component_stack}
`,
    stack: error.stack?.split(`
`).filter((line) => !line.includes("svelte/src/internal")).join(`
`)
  };
}
function apply_adjustments(error) {
  const adjusted = adjustments.get(error);
  if (adjusted) {
    define_property(error, "message", {
      value: adjusted.message
    });
    define_property(error, "stack", {
      value: adjusted.stack
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/status.js
var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
function set_signal_status(signal, status) {
  signal.f = signal.f & STATUS_MASK | status;
}
function update_derived_status(derived) {
  if ((derived.f & CONNECTED) !== 0 || derived.deps === null) {
    set_signal_status(derived, CLEAN);
  } else {
    set_signal_status(derived, MAYBE_DIRTY);
  }
}

// node_modules/svelte/src/internal/client/reactivity/utils.js
function clear_marked(deps) {
  if (deps === null)
    return;
  for (const dep of deps) {
    if ((dep.f & DERIVED) === 0 || (dep.f & WAS_MARKED) === 0) {
      continue;
    }
    dep.f ^= WAS_MARKED;
    clear_marked(dep.deps);
  }
}
function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
  if ((effect.f & DIRTY) !== 0) {
    dirty_effects.add(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    maybe_dirty_effects.add(effect);
  }
  clear_marked(effect.deps);
  set_signal_status(effect, CLEAN);
}

// node_modules/svelte/src/internal/client/reactivity/store.js
var legacy_is_updating_store = false;
var is_store_binding = false;
var IS_UNMOUNTED = Symbol("unmounted");
function capture_store_binding(fn) {
  var previous_is_store_binding = is_store_binding;
  try {
    is_store_binding = false;
    return [fn(), is_store_binding];
  } finally {
    is_store_binding = previous_is_store_binding;
  }
}

// node_modules/svelte/src/reactivity/create-subscriber.js
function createSubscriber(start) {
  let subscribers = 0;
  let version = source(0);
  let stop;
  if (true_default) {
    tag(version, "createSubscriber version");
  }
  return () => {
    if (effect_tracking()) {
      get2(version);
      render_effect(() => {
        if (subscribers === 0) {
          stop = untrack(() => start(() => increment(version)));
        }
        subscribers += 1;
        return () => {
          queue_micro_task(() => {
            subscribers -= 1;
            if (subscribers === 0) {
              stop?.();
              stop = undefined;
              increment(version);
            }
          });
        };
      });
    }
  };
}

// node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
function boundary(node, props, children, transform_error) {
  new Boundary(node, props, children, transform_error);
}

class Boundary {
  parent;
  is_pending = false;
  transform_error;
  #anchor;
  #hydrate_open = hydrating ? hydrate_node : null;
  #props;
  #children;
  #effect;
  #main_effect = null;
  #pending_effect = null;
  #failed_effect = null;
  #offscreen_fragment = null;
  #local_pending_count = 0;
  #pending_count = 0;
  #pending_count_update_queued = false;
  #dirty_effects = new Set;
  #maybe_dirty_effects = new Set;
  #effect_pending = null;
  #effect_pending_subscriber = createSubscriber(() => {
    this.#effect_pending = source(this.#local_pending_count);
    if (true_default) {
      tag(this.#effect_pending, "$effect.pending()");
    }
    return () => {
      this.#effect_pending = null;
    };
  });
  constructor(node, props, children, transform_error) {
    this.#anchor = node;
    this.#props = props;
    this.#children = (anchor) => {
      var effect = active_effect;
      effect.b = this;
      effect.f |= BOUNDARY_EFFECT;
      children(anchor);
    };
    this.parent = active_effect.b;
    this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
    this.#effect = block(() => {
      if (hydrating) {
        const comment = this.#hydrate_open;
        hydrate_next();
        const server_rendered_pending = comment.data === HYDRATION_START_ELSE;
        const server_rendered_failed = comment.data.startsWith(HYDRATION_START_FAILED);
        if (server_rendered_failed) {
          const serialized_error = JSON.parse(comment.data.slice(HYDRATION_START_FAILED.length));
          this.#hydrate_failed_content(serialized_error);
        } else if (server_rendered_pending) {
          this.#hydrate_pending_content();
        } else {
          this.#hydrate_resolved_content();
        }
      } else {
        this.#render();
      }
    }, flags);
    if (hydrating) {
      this.#anchor = hydrate_node;
    }
  }
  #hydrate_resolved_content() {
    try {
      this.#main_effect = branch(() => this.#children(this.#anchor));
    } catch (error) {
      this.error(error);
    }
  }
  #hydrate_failed_content(error) {
    const failed = this.#props.failed;
    if (!failed)
      return;
    this.#failed_effect = branch(() => {
      failed(this.#anchor, () => error, () => () => {});
    });
  }
  #hydrate_pending_content() {
    const pending = this.#props.pending;
    if (!pending)
      return;
    this.is_pending = true;
    this.#pending_effect = branch(() => pending(this.#anchor));
    queue_micro_task(() => {
      var fragment = this.#offscreen_fragment = document.createDocumentFragment();
      var anchor = create_text();
      fragment.append(anchor);
      this.#main_effect = this.#run(() => {
        return branch(() => this.#children(anchor));
      });
      if (this.#pending_count === 0) {
        this.#anchor.before(fragment);
        this.#offscreen_fragment = null;
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
        this.#resolve(current_batch);
      }
    });
  }
  #render() {
    try {
      this.is_pending = this.has_pending_snippet();
      this.#pending_count = 0;
      this.#local_pending_count = 0;
      this.#main_effect = branch(() => {
        this.#children(this.#anchor);
      });
      if (this.#pending_count > 0) {
        var fragment = this.#offscreen_fragment = document.createDocumentFragment();
        move_effect(this.#main_effect, fragment);
        const pending = this.#props.pending;
        this.#pending_effect = branch(() => pending(this.#anchor));
      } else {
        this.#resolve(current_batch);
      }
    } catch (error) {
      this.error(error);
    }
  }
  #resolve(batch) {
    this.is_pending = false;
    batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
  }
  defer_effect(effect) {
    defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!this.#props.pending;
  }
  #run(fn) {
    var previous_effect = active_effect;
    var previous_reaction = active_reaction;
    var previous_ctx = component_context;
    set_active_effect(this.#effect);
    set_active_reaction(this.#effect);
    set_component_context(this.#effect.ctx);
    try {
      Batch.ensure();
      return fn();
    } catch (e) {
      handle_error(e);
      return null;
    } finally {
      set_active_effect(previous_effect);
      set_active_reaction(previous_reaction);
      set_component_context(previous_ctx);
    }
  }
  #update_pending_count(d, batch) {
    if (!this.has_pending_snippet()) {
      if (this.parent) {
        this.parent.#update_pending_count(d, batch);
      }
      return;
    }
    this.#pending_count += d;
    if (this.#pending_count === 0) {
      this.#resolve(batch);
      if (this.#pending_effect) {
        pause_effect(this.#pending_effect, () => {
          this.#pending_effect = null;
        });
      }
      if (this.#offscreen_fragment) {
        this.#anchor.before(this.#offscreen_fragment);
        this.#offscreen_fragment = null;
      }
    }
  }
  update_pending_count(d, batch) {
    this.#update_pending_count(d, batch);
    this.#local_pending_count += d;
    if (!this.#effect_pending || this.#pending_count_update_queued)
      return;
    this.#pending_count_update_queued = true;
    queue_micro_task(() => {
      this.#pending_count_update_queued = false;
      if (this.#effect_pending) {
        internal_set(this.#effect_pending, this.#local_pending_count);
      }
    });
  }
  get_effect_pending() {
    this.#effect_pending_subscriber();
    return get2(this.#effect_pending);
  }
  error(error) {
    if (!this.#props.onerror && !this.#props.failed) {
      throw error;
    }
    if (current_batch?.is_fork) {
      if (this.#main_effect)
        current_batch.skip_effect(this.#main_effect);
      if (this.#pending_effect)
        current_batch.skip_effect(this.#pending_effect);
      if (this.#failed_effect)
        current_batch.skip_effect(this.#failed_effect);
      current_batch.oncommit(() => {
        this.#handle_error(error);
      });
    } else {
      this.#handle_error(error);
    }
  }
  #handle_error(error) {
    if (this.#main_effect) {
      destroy_effect(this.#main_effect);
      this.#main_effect = null;
    }
    if (this.#pending_effect) {
      destroy_effect(this.#pending_effect);
      this.#pending_effect = null;
    }
    if (this.#failed_effect) {
      destroy_effect(this.#failed_effect);
      this.#failed_effect = null;
    }
    if (hydrating) {
      set_hydrate_node(this.#hydrate_open);
      next();
      set_hydrate_node(skip_nodes());
    }
    var onerror = this.#props.onerror;
    let failed = this.#props.failed;
    var did_reset = false;
    var calling_on_error = false;
    const reset2 = () => {
      if (did_reset) {
        svelte_boundary_reset_noop();
        return;
      }
      did_reset = true;
      if (calling_on_error) {
        svelte_boundary_reset_onerror();
      }
      if (this.#failed_effect !== null) {
        pause_effect(this.#failed_effect, () => {
          this.#failed_effect = null;
        });
      }
      this.#run(() => {
        this.#render();
      });
    };
    const handle_error_result = (transformed_error) => {
      try {
        calling_on_error = true;
        onerror?.(transformed_error, reset2);
        calling_on_error = false;
      } catch (error2) {
        invoke_error_boundary(error2, this.#effect && this.#effect.parent);
      }
      if (failed) {
        this.#failed_effect = this.#run(() => {
          try {
            return branch(() => {
              var effect = active_effect;
              effect.b = this;
              effect.f |= BOUNDARY_EFFECT;
              failed(this.#anchor, () => transformed_error, () => reset2);
            });
          } catch (error2) {
            invoke_error_boundary(error2, this.#effect.parent);
            return null;
          }
        });
      }
    };
    queue_micro_task(() => {
      var result;
      try {
        result = this.transform_error(error);
      } catch (e) {
        invoke_error_boundary(e, this.#effect && this.#effect.parent);
        return;
      }
      if (result !== null && typeof result === "object" && typeof result.then === "function") {
        result.then(handle_error_result, (e) => invoke_error_boundary(e, this.#effect && this.#effect.parent));
      } else {
        handle_error_result(result);
      }
    });
  }
}

// node_modules/svelte/src/internal/client/reactivity/async.js
function flatten(blockers, sync, async, fn) {
  const d = is_runes() ? derived : derived_safe_equal;
  var pending = blockers.filter((b) => !b.settled);
  var deriveds = sync.map(d);
  if (true_default) {
    deriveds.forEach((d2, i) => {
      d2.label = sync[i].toString().replace("() => ", "").replaceAll("$.eager(() => ", "$state.eager(").replace(/\$\.get\((.+?)\)/g, (_, id) => id);
    });
  }
  if (async.length === 0 && pending.length === 0) {
    fn(deriveds);
    return;
  }
  var parent = active_effect;
  var restore = capture();
  var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
  function finish(async2) {
    if ((parent.f & DESTROYED) !== 0) {
      return;
    }
    restore();
    try {
      fn([...deriveds, ...async2]);
    } catch (error) {
      invoke_error_boundary(error, parent);
    }
    unset_context();
  }
  var decrement_pending = increment_pending();
  if (async.length === 0) {
    blocker_promise.then(() => finish([])).finally(decrement_pending);
    return;
  }
  function run2() {
    Promise.all(async.map((expression) => async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
  }
  if (blocker_promise) {
    blocker_promise.then(() => {
      restore();
      run2();
      unset_context();
    });
  } else {
    run2();
  }
}
function capture() {
  var previous_effect = active_effect;
  var previous_reaction = active_reaction;
  var previous_component_context = component_context;
  var previous_batch = current_batch;
  if (true_default) {
    var previous_dev_stack = dev_stack;
  }
  return function restore(activate_batch = true) {
    set_active_effect(previous_effect);
    set_active_reaction(previous_reaction);
    set_component_context(previous_component_context);
    if (activate_batch && (previous_effect.f & DESTROYED) === 0) {
      previous_batch?.activate();
      previous_batch?.apply();
    }
    if (true_default) {
      set_reactivity_loss_tracker(null);
      set_dev_stack(previous_dev_stack);
    }
  };
}
function unset_context(deactivate_batch = true) {
  set_active_effect(null);
  set_active_reaction(null);
  set_component_context(null);
  if (deactivate_batch)
    current_batch?.deactivate();
  if (true_default) {
    set_reactivity_loss_tracker(null);
    set_dev_stack(null);
  }
}
function increment_pending() {
  var effect = active_effect;
  var boundary2 = effect.b;
  var batch = current_batch;
  var blocking = !!boundary2?.is_rendered();
  boundary2?.update_pending_count(1, batch);
  batch.increment(blocking, effect);
  return () => {
    boundary2?.update_pending_count(-1, batch);
    batch.decrement(blocking, effect);
  };
}

// node_modules/svelte/src/internal/client/reactivity/deriveds.js
var reactivity_loss_tracker = null;
function set_reactivity_loss_tracker(v) {
  reactivity_loss_tracker = v;
}
var recent_async_deriveds = new Set;
function derived(fn) {
  var flags2 = DERIVED | DIRTY;
  if (active_effect !== null) {
    active_effect.f |= EFFECT_PRESERVED;
  }
  const signal = {
    ctx: component_context,
    deps: null,
    effects: null,
    equals,
    f: flags2,
    fn,
    reactions: null,
    rv: 0,
    v: UNINITIALIZED,
    wv: 0,
    parent: active_effect,
    ac: null
  };
  if (true_default && tracing_mode_flag) {
    signal.created = get_error("created at");
  }
  return signal;
}
var OBSOLETE = Symbol("obsolete");
function async_derived(fn, label, location) {
  let parent = active_effect;
  if (parent === null) {
    async_derived_orphan();
  }
  var promise = undefined;
  var signal = source(UNINITIALIZED);
  if (true_default)
    signal.label = label ?? fn.toString();
  var should_suspend = !active_reaction;
  var deferreds = new Set;
  async_effect(() => {
    var effect = active_effect;
    if (true_default) {
      reactivity_loss_tracker = { effect, effect_deps: new Set, warned: false };
    }
    var d = deferred();
    promise = d.promise;
    try {
      Promise.resolve(fn()).then(d.resolve, (e) => {
        if (e !== STALE_REACTION)
          d.reject(e);
      }).finally(unset_context);
    } catch (error) {
      d.reject(error);
      unset_context();
    }
    if (true_default) {
      if (reactivity_loss_tracker) {
        if (effect.deps !== null) {
          for (let i = 0;i < skipped_deps; i += 1) {
            reactivity_loss_tracker.effect_deps.add(effect.deps[i]);
          }
        }
        if (new_deps !== null) {
          for (let i = 0;i < new_deps.length; i += 1) {
            reactivity_loss_tracker.effect_deps.add(new_deps[i]);
          }
        }
      }
      reactivity_loss_tracker = null;
    }
    var batch = current_batch;
    if (should_suspend) {
      if ((effect.f & REACTION_RAN) !== 0) {
        var decrement_pending = increment_pending();
      }
      if (parent.b?.is_rendered()) {
        batch.async_deriveds.get(effect)?.reject(OBSOLETE);
      } else {
        for (const d2 of deferreds.values()) {
          d2.reject(OBSOLETE);
        }
      }
      deferreds.add(d);
      batch.async_deriveds.set(effect, d);
    }
    const handler = (value, error = undefined) => {
      if (true_default) {
        reactivity_loss_tracker = null;
      }
      decrement_pending?.();
      deferreds.delete(d);
      if (error === OBSOLETE)
        return;
      batch.activate();
      if (error) {
        signal.f |= ERROR_VALUE;
        internal_set(signal, error);
      } else {
        if ((signal.f & ERROR_VALUE) !== 0) {
          signal.f ^= ERROR_VALUE;
        }
        if (true_default && location !== undefined && !signal.equals(value)) {
          recent_async_deriveds.add(signal);
          setTimeout(() => {
            if (recent_async_deriveds.has(signal) && (effect.f & DESTROYED) === 0) {
              await_waterfall(signal.label, location);
              recent_async_deriveds.delete(signal);
            }
          });
        }
        internal_set(signal, value);
      }
      batch.deactivate();
    };
    d.promise.then(handler, (e) => handler(null, e || "unknown"));
  });
  teardown(() => {
    for (const d of deferreds) {
      d.reject(OBSOLETE);
    }
  });
  if (true_default) {
    signal.f |= ASYNC;
  }
  return new Promise((fulfil) => {
    function next2(p) {
      function go() {
        if (p === promise) {
          fulfil(signal);
        } else {
          next2(promise);
        }
      }
      p.then(go, go);
    }
    next2(promise);
  });
}
function user_derived(fn) {
  const d = derived(fn);
  if (!async_mode_flag)
    push_reaction_value(d);
  return d;
}
function derived_safe_equal(fn) {
  const signal = derived(fn);
  signal.equals = safe_equals;
  return signal;
}
function destroy_derived_effects(derived2) {
  var effects = derived2.effects;
  if (effects !== null) {
    derived2.effects = null;
    for (var i = 0;i < effects.length; i += 1) {
      destroy_effect(effects[i]);
    }
  }
}
var stack = [];
function execute_derived(derived2) {
  var value;
  var prev_active_effect = active_effect;
  var parent = derived2.parent;
  if (!is_destroying_effect && parent !== null && derived2.v !== UNINITIALIZED && (parent.f & (DESTROYED | INERT)) !== 0) {
    derived_inert();
    return derived2.v;
  }
  set_active_effect(parent);
  if (true_default) {
    let prev_eager_effects = eager_effects;
    set_eager_effects(new Set);
    try {
      if (includes.call(stack, derived2)) {
        derived_references_self();
      }
      stack.push(derived2);
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
      set_eager_effects(prev_eager_effects);
      stack.pop();
    }
  } else {
    try {
      derived2.f &= ~WAS_MARKED;
      destroy_derived_effects(derived2);
      value = update_reaction(derived2);
    } finally {
      set_active_effect(prev_active_effect);
    }
  }
  return value;
}
function update_derived(derived2) {
  var value = execute_derived(derived2);
  if (!derived2.equals(value)) {
    derived2.wv = increment_write_version();
    if (!current_batch?.is_fork || derived2.deps === null) {
      if (current_batch !== null) {
        current_batch.capture(derived2, value, true);
        previous_batch?.capture(derived2, value, true);
      } else {
        derived2.v = value;
      }
      if (derived2.deps === null) {
        set_signal_status(derived2, CLEAN);
        return;
      }
    }
  }
  if (is_destroying_effect) {
    return;
  }
  if (batch_values !== null) {
    if (effect_tracking() || current_batch?.is_fork) {
      batch_values.set(derived2, value);
    }
  } else {
    update_derived_status(derived2);
  }
}
function freeze_derived_effects(derived2) {
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown || e.ac) {
      e.teardown?.();
      e.ac?.abort(STALE_REACTION);
      if (e.fn !== null)
        e.teardown = noop;
      e.ac = null;
      remove_reactions(e, 0);
      destroy_effect_children(e);
    }
  }
}
function unfreeze_derived_effects(derived2) {
  if (derived2.effects === null)
    return;
  for (const e of derived2.effects) {
    if (e.teardown && e.fn !== null) {
      update_effect(e);
    }
  }
}

// node_modules/svelte/src/internal/client/reactivity/batch.js
var first_batch = null;
var last_batch = null;
var current_batch = null;
var previous_batch = null;
var batch_values = null;
var last_scheduled_effect = null;
var is_flushing_sync = false;
var is_processing = false;
var collected_effects = null;
var legacy_updates = null;
var flush_count = 0;
var source_stacks = new Set;
var uid = 1;

class Batch {
  id = uid++;
  #started = false;
  linked = true;
  #prev = null;
  #next = null;
  async_deriveds = new Map;
  current = new Map;
  previous = new Map;
  #commit_callbacks = new Set;
  #discard_callbacks = new Set;
  #pending = 0;
  #blocking_pending = new Map;
  #deferred = null;
  #roots = [];
  #new_effects = [];
  #dirty_effects = new Set;
  #maybe_dirty_effects = new Set;
  #skipped_branches = new Map;
  #unskipped_branches = new Set;
  is_fork = false;
  #decrement_queued = false;
  constructor() {
    if (last_batch === null) {
      first_batch = last_batch = this;
    } else {
      last_batch.#next = this;
      this.#prev = last_batch;
    }
    last_batch = this;
  }
  #is_deferred() {
    if (this.is_fork)
      return true;
    for (const effect of this.#blocking_pending.keys()) {
      var e = effect;
      var skipped = false;
      while (e.parent !== null) {
        if (this.#skipped_branches.has(e)) {
          skipped = true;
          break;
        }
        e = e.parent;
      }
      if (!skipped) {
        return true;
      }
    }
    return false;
  }
  skip_effect(effect) {
    if (!this.#skipped_branches.has(effect)) {
      this.#skipped_branches.set(effect, { d: [], m: [] });
    }
    this.#unskipped_branches.delete(effect);
  }
  unskip_effect(effect, callback = (e) => this.schedule(e)) {
    var tracked = this.#skipped_branches.get(effect);
    if (tracked) {
      this.#skipped_branches.delete(effect);
      for (var e of tracked.d) {
        set_signal_status(e, DIRTY);
        callback(e);
      }
      for (e of tracked.m) {
        set_signal_status(e, MAYBE_DIRTY);
        callback(e);
      }
    }
    this.#unskipped_branches.add(effect);
  }
  #process() {
    this.#started = true;
    if (flush_count++ > 1000) {
      this.#unlink();
      infinite_loop_guard();
    }
    if (true_default) {
      for (const value of this.current.keys()) {
        source_stacks.add(value);
      }
    }
    for (const e of this.#dirty_effects) {
      this.#maybe_dirty_effects.delete(e);
      set_signal_status(e, DIRTY);
      this.schedule(e);
    }
    for (const e of this.#maybe_dirty_effects) {
      set_signal_status(e, MAYBE_DIRTY);
      this.schedule(e);
    }
    const roots = this.#roots;
    this.#roots = [];
    this.apply();
    var effects = collected_effects = [];
    var render_effects = [];
    var updates = legacy_updates = [];
    for (const root of roots) {
      try {
        this.#traverse(root, effects, render_effects);
      } catch (e) {
        reset_all(root);
        if (!this.#is_deferred())
          this.discard();
        throw e;
      }
    }
    current_batch = null;
    if (updates.length > 0) {
      var batch = Batch.ensure();
      for (const e of updates) {
        batch.schedule(e);
      }
    }
    collected_effects = null;
    legacy_updates = null;
    if (this.#is_deferred()) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      for (const [e, t] of this.#skipped_branches) {
        reset_branch(e, t);
      }
      if (updates.length > 0) {
        current_batch.#process();
      }
      return;
    }
    const earlier_batch = this.#find_earlier_batch();
    if (earlier_batch) {
      this.#defer_effects(render_effects);
      this.#defer_effects(effects);
      earlier_batch.#merge(this);
      return;
    }
    this.#dirty_effects.clear();
    this.#maybe_dirty_effects.clear();
    for (const fn of this.#commit_callbacks)
      fn(this);
    this.#commit_callbacks.clear();
    previous_batch = this;
    flush_queued_effects(render_effects);
    flush_queued_effects(effects);
    previous_batch = null;
    this.#deferred?.resolve();
    var next_batch = current_batch;
    if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
      this.#unlink();
      if (async_mode_flag) {
        this.#commit();
        current_batch = next_batch;
      }
    }
    if (this.#roots.length > 0) {
      if (next_batch !== null) {
        const batch2 = next_batch;
        batch2.#roots.push(...this.#roots.filter((r) => !batch2.#roots.includes(r)));
      } else {
        next_batch = this;
      }
    }
    if (next_batch !== null) {
      next_batch.#process();
    }
  }
  #traverse(root, effects, render_effects) {
    root.f ^= CLEAN;
    var effect = root.first;
    while (effect !== null) {
      var flags2 = effect.f;
      var is_branch = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) !== 0;
      var is_skippable_branch = is_branch && (flags2 & CLEAN) !== 0;
      var skip = is_skippable_branch || (flags2 & INERT) !== 0 || this.#skipped_branches.has(effect);
      if (!skip && effect.fn !== null) {
        if (is_branch) {
          effect.f ^= CLEAN;
        } else if ((flags2 & EFFECT) !== 0) {
          effects.push(effect);
        } else if (async_mode_flag && (flags2 & (RENDER_EFFECT | MANAGED_EFFECT)) !== 0) {
          render_effects.push(effect);
        } else if (is_dirty(effect)) {
          if ((flags2 & BLOCK_EFFECT) !== 0)
            this.#maybe_dirty_effects.add(effect);
          update_effect(effect);
        }
        var child = effect.first;
        if (child !== null) {
          effect = child;
          continue;
        }
      }
      while (effect !== null) {
        var next2 = effect.next;
        if (next2 !== null) {
          effect = next2;
          break;
        }
        effect = effect.parent;
      }
    }
  }
  #find_earlier_batch() {
    var batch = this.#prev;
    while (batch !== null) {
      if (!batch.is_fork) {
        for (const [value, [, is_derived]] of this.current) {
          if (batch.current.has(value) && !is_derived) {
            return batch;
          }
        }
      }
      batch = batch.#prev;
    }
    return null;
  }
  #merge(batch) {
    for (const [source2, value] of batch.current) {
      if (!this.previous.has(source2) && batch.previous.has(source2)) {
        this.previous.set(source2, batch.previous.get(source2));
      }
      this.current.set(source2, value);
    }
    for (const [effect, deferred2] of batch.async_deriveds) {
      const d = this.async_deriveds.get(effect);
      if (d)
        deferred2.promise.then(d.resolve).catch(d.reject);
    }
    batch.async_deriveds.clear();
    this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
    const mark = (value) => {
      var reactions = value.reactions;
      if (reactions === null)
        return;
      for (const reaction of reactions) {
        var flags2 = reaction.f;
        if ((flags2 & DERIVED) !== 0) {
          mark(reaction);
        } else {
          var effect = reaction;
          if (flags2 & (ASYNC | BLOCK_EFFECT) && !this.async_deriveds.has(effect)) {
            this.#maybe_dirty_effects.delete(effect);
            set_signal_status(effect, DIRTY);
            this.schedule(effect);
          }
        }
      }
    };
    for (const source2 of this.current.keys()) {
      mark(source2);
    }
    this.oncommit(() => batch.discard());
    batch.#unlink();
    current_batch = this;
    this.#process();
  }
  #defer_effects(effects) {
    for (var i = 0;i < effects.length; i += 1) {
      defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
    }
  }
  capture(source2, value, is_derived = false) {
    if (source2.v !== UNINITIALIZED && !this.previous.has(source2)) {
      this.previous.set(source2, source2.v);
    }
    if ((source2.f & ERROR_VALUE) === 0) {
      this.current.set(source2, [value, is_derived]);
      batch_values?.set(source2, value);
    }
    if (!this.is_fork) {
      source2.v = value;
    }
  }
  activate() {
    current_batch = this;
  }
  deactivate() {
    current_batch = null;
    batch_values = null;
  }
  flush() {
    try {
      if (true_default) {
        source_stacks.clear();
      }
      is_processing = true;
      current_batch = this;
      this.#process();
    } finally {
      flush_count = 0;
      last_scheduled_effect = null;
      collected_effects = null;
      legacy_updates = null;
      is_processing = false;
      current_batch = null;
      batch_values = null;
      old_values.clear();
      if (true_default) {
        for (const source2 of source_stacks) {
          source2.updated = null;
        }
      }
    }
  }
  discard() {
    for (const fn of this.#discard_callbacks)
      fn(this);
    this.#discard_callbacks.clear();
    for (const deferred2 of this.async_deriveds.values()) {
      deferred2.reject(OBSOLETE);
    }
    this.#unlink();
    this.#deferred?.resolve();
  }
  register_created_effect(effect) {
    this.#new_effects.push(effect);
  }
  #commit() {
    for (let batch = first_batch;batch !== null; batch = batch.#next) {
      var is_earlier = batch.id < this.id;
      var sources = [];
      for (const [source3, [value, is_derived]] of this.current) {
        if (batch.current.has(source3)) {
          var batch_value = batch.current.get(source3)[0];
          if (is_earlier && value !== batch_value) {
            batch.current.set(source3, [value, is_derived]);
          } else {
            continue;
          }
        }
        sources.push(source3);
      }
      if (is_earlier) {
        for (const [effect, deferred2] of this.async_deriveds) {
          const d = batch.async_deriveds.get(effect);
          if (d)
            deferred2.promise.then(d.resolve).catch(d.reject);
        }
      }
      var current = [...batch.current.keys()].filter((source3) => !batch.current.get(source3)[1]);
      if (!batch.#started || current.length === 0)
        continue;
      var others = current.filter((source3) => !this.current.has(source3));
      if (others.length === 0) {
        if (is_earlier) {
          batch.discard();
        }
      } else if (sources.length > 0) {
        if (true_default && !batch.#decrement_queued) {
          invariant(batch.#roots.length === 0, "Batch has scheduled roots");
        }
        if (is_earlier) {
          for (const unskipped of this.#unskipped_branches) {
            batch.unskip_effect(unskipped, (e) => {
              if ((e.f & (BLOCK_EFFECT | ASYNC)) !== 0) {
                batch.schedule(e);
              } else {
                batch.#defer_effects([e]);
              }
            });
          }
        }
        batch.activate();
        var marked = new Set;
        var checked = new Map;
        for (var source2 of sources) {
          mark_effects(source2, others, marked, checked);
        }
        checked = new Map;
        var current_unequal = [...batch.current].filter(([c, v1]) => {
          const v2 = this.current.get(c);
          if (!v2)
            return true;
          return v2[0] !== v1[0] || v2[1] !== v1[1];
        }).map(([c]) => c);
        if (current_unequal.length > 0) {
          for (const effect of this.#new_effects) {
            if ((effect.f & (DESTROYED | INERT | EAGER_EFFECT)) === 0 && depends_on(effect, current_unequal, checked)) {
              if ((effect.f & (ASYNC | BLOCK_EFFECT)) !== 0) {
                set_signal_status(effect, DIRTY);
                batch.schedule(effect);
              } else {
                batch.#dirty_effects.add(effect);
              }
            }
          }
        }
        if (batch.#roots.length > 0 && !batch.#decrement_queued) {
          batch.apply();
          for (var root of batch.#roots) {
            batch.#traverse(root, [], []);
          }
          batch.#roots = [];
        }
        batch.deactivate();
      }
    }
  }
  increment(blocking, effect) {
    this.#pending += 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
      this.#blocking_pending.set(effect, blocking_pending_count + 1);
    }
  }
  decrement(blocking, effect) {
    this.#pending -= 1;
    if (blocking) {
      let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
      if (blocking_pending_count === 1) {
        this.#blocking_pending.delete(effect);
      } else {
        this.#blocking_pending.set(effect, blocking_pending_count - 1);
      }
    }
    if (this.#decrement_queued)
      return;
    this.#decrement_queued = true;
    queue_micro_task(() => {
      this.#decrement_queued = false;
      if (this.linked) {
        this.flush();
      }
    });
  }
  transfer_effects(dirty_effects, maybe_dirty_effects) {
    for (const e of dirty_effects) {
      this.#dirty_effects.add(e);
    }
    for (const e of maybe_dirty_effects) {
      this.#maybe_dirty_effects.add(e);
    }
    dirty_effects.clear();
    maybe_dirty_effects.clear();
  }
  oncommit(fn) {
    this.#commit_callbacks.add(fn);
  }
  ondiscard(fn) {
    this.#discard_callbacks.add(fn);
  }
  settled() {
    return (this.#deferred ??= deferred()).promise;
  }
  static ensure() {
    if (current_batch === null) {
      const batch = current_batch = new Batch;
      if (!is_processing && !is_flushing_sync) {
        queue_micro_task(() => {
          if (!batch.#started) {
            batch.flush();
          }
        });
      }
    }
    return current_batch;
  }
  apply() {
    if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
      batch_values = null;
      return;
    }
    batch_values = new Map;
    for (const [source2, [value]] of this.current) {
      batch_values.set(source2, value);
    }
    for (let batch = first_batch;batch !== null; batch = batch.#next) {
      if (batch === this || batch.is_fork)
        continue;
      var intersects = false;
      if (batch.id < this.id) {
        for (const [source2, [, is_derived]] of batch.current) {
          if (is_derived)
            continue;
          if (this.current.has(source2)) {
            intersects = true;
            break;
          }
        }
      }
      if (!intersects) {
        for (const [source2, previous] of batch.previous) {
          if (!batch_values.has(source2)) {
            batch_values.set(source2, previous);
          }
        }
      }
    }
  }
  schedule(effect) {
    last_scheduled_effect = effect;
    if (effect.b?.is_pending && (effect.f & (EFFECT | RENDER_EFFECT | MANAGED_EFFECT)) !== 0 && (effect.f & REACTION_RAN) === 0) {
      effect.b.defer_effect(effect);
      return;
    }
    var e = effect;
    while (e.parent !== null) {
      e = e.parent;
      var flags2 = e.f;
      if (collected_effects !== null && e === active_effect) {
        if (async_mode_flag)
          return;
        if ((active_reaction === null || (active_reaction.f & DERIVED) === 0) && !legacy_is_updating_store) {
          return;
        }
      }
      if ((flags2 & (ROOT_EFFECT | BRANCH_EFFECT)) !== 0) {
        if ((flags2 & CLEAN) === 0) {
          return;
        }
        e.f ^= CLEAN;
      }
    }
    this.#roots.push(e);
  }
  #unlink() {
    if (!this.linked)
      return;
    var prev = this.#prev;
    var next2 = this.#next;
    if (prev === null) {
      first_batch = next2;
    } else {
      prev.#next = next2;
    }
    if (next2 === null) {
      last_batch = prev;
    } else {
      next2.#prev = prev;
    }
    this.linked = false;
  }
}
function flushSync(fn) {
  var was_flushing_sync = is_flushing_sync;
  is_flushing_sync = true;
  try {
    var result;
    if (fn) {
      if (current_batch !== null && !current_batch.is_fork) {
        current_batch.flush();
      }
      result = fn();
    }
    while (true) {
      flush_tasks();
      if (current_batch === null) {
        return result;
      }
      current_batch.flush();
    }
  } finally {
    is_flushing_sync = was_flushing_sync;
  }
}
function infinite_loop_guard() {
  if (true_default) {
    var updates = new Map;
    for (const source2 of current_batch.current.keys()) {
      for (const [stack2, update2] of source2.updated ?? []) {
        var entry = updates.get(stack2);
        if (!entry) {
          entry = { error: update2.error, count: 0 };
          updates.set(stack2, entry);
        }
        entry.count += update2.count;
      }
    }
    for (const update2 of updates.values()) {
      if (update2.error) {
        console.error(update2.error);
      }
    }
  }
  try {
    effect_update_depth_exceeded();
  } catch (error) {
    if (true_default) {
      define_property(error, "stack", { value: "" });
    }
    invoke_error_boundary(error, last_scheduled_effect);
  }
}
var eager_block_effects = null;
function flush_queued_effects(effects) {
  var length = effects.length;
  if (length === 0)
    return;
  var i = 0;
  while (i < length) {
    var effect = effects[i++];
    if ((effect.f & (DESTROYED | INERT)) === 0 && is_dirty(effect)) {
      eager_block_effects = new Set;
      update_effect(effect);
      if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) {
        unlink_effect(effect);
      }
      if (eager_block_effects?.size > 0) {
        old_values.clear();
        for (const e of eager_block_effects) {
          if ((e.f & (DESTROYED | INERT)) !== 0)
            continue;
          const ordered_effects = [e];
          let ancestor = e.parent;
          while (ancestor !== null) {
            if (eager_block_effects.has(ancestor)) {
              eager_block_effects.delete(ancestor);
              ordered_effects.push(ancestor);
            }
            ancestor = ancestor.parent;
          }
          for (let j = ordered_effects.length - 1;j >= 0; j--) {
            const e2 = ordered_effects[j];
            if ((e2.f & (DESTROYED | INERT)) !== 0)
              continue;
            update_effect(e2);
          }
        }
        eager_block_effects.clear();
      }
    }
  }
  eager_block_effects = null;
}
function mark_effects(value, sources, marked, checked) {
  if (marked.has(value))
    return;
  marked.add(value);
  if (value.reactions !== null) {
    for (const reaction of value.reactions) {
      const flags2 = reaction.f;
      if ((flags2 & DERIVED) !== 0) {
        mark_effects(reaction, sources, marked, checked);
      } else if ((flags2 & (ASYNC | BLOCK_EFFECT)) !== 0 && (flags2 & DIRTY) === 0 && depends_on(reaction, sources, checked)) {
        set_signal_status(reaction, DIRTY);
        schedule_effect(reaction);
      }
    }
  }
}
function depends_on(reaction, sources, checked) {
  const depends = checked.get(reaction);
  if (depends !== undefined)
    return depends;
  if (reaction.deps !== null) {
    for (const dep of reaction.deps) {
      if (includes.call(sources, dep)) {
        return true;
      }
      if ((dep.f & DERIVED) !== 0 && depends_on(dep, sources, checked)) {
        checked.set(dep, true);
        return true;
      }
    }
  }
  checked.set(reaction, false);
  return false;
}
function schedule_effect(effect) {
  current_batch.schedule(effect);
}
var version_map = new Map;
function reset_branch(effect, tracked) {
  if ((effect.f & BRANCH_EFFECT) !== 0 && (effect.f & CLEAN) !== 0) {
    return;
  }
  if ((effect.f & DIRTY) !== 0) {
    tracked.d.push(effect);
  } else if ((effect.f & MAYBE_DIRTY) !== 0) {
    tracked.m.push(effect);
  }
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_branch(e, tracked);
    e = e.next;
  }
}
function reset_all(effect) {
  set_signal_status(effect, CLEAN);
  var e = effect.first;
  while (e !== null) {
    reset_all(e);
    e = e.next;
  }
}

// node_modules/svelte/src/internal/client/reactivity/sources.js
var eager_effects = new Set;
var old_values = new Map;
function set_eager_effects(v) {
  eager_effects = v;
}
var eager_effects_deferred = false;
function set_eager_effects_deferred() {
  eager_effects_deferred = true;
}
function source(v, stack2) {
  var signal = {
    f: 0,
    v,
    reactions: null,
    equals,
    rv: 0,
    wv: 0
  };
  if (true_default && tracing_mode_flag) {
    signal.created = stack2 ?? get_error("created at");
    signal.updated = null;
    signal.set_during_effect = false;
    signal.trace = null;
  }
  return signal;
}
function state(v, stack2) {
  const s = source(v, stack2);
  push_reaction_value(s);
  return s;
}
function mutable_source(initial_value, immutable = false, trackable = true) {
  const s = source(initial_value);
  if (!immutable) {
    s.equals = safe_equals;
  }
  if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) {
    (component_context.l.s ??= []).push(s);
  }
  return s;
}
function set(source2, value, should_proxy = false) {
  if (active_reaction !== null && (!untracking || (active_reaction.f & EAGER_EFFECT) !== 0) && is_runes() && (active_reaction.f & (DERIVED | BLOCK_EFFECT | ASYNC | EAGER_EFFECT)) !== 0 && (current_sources === null || !current_sources.has(source2))) {
    state_unsafe_mutation();
  }
  let new_value = should_proxy ? proxy(value) : value;
  if (true_default) {
    tag_proxy(new_value, source2.label);
  }
  return internal_set(source2, new_value, legacy_updates);
}
function internal_set(source2, value, updated_during_traversal = null) {
  if (!source2.equals(value)) {
    old_values.set(source2, is_destroying_effect ? value : source2.v);
    var batch = Batch.ensure();
    batch.capture(source2, value);
    if (true_default) {
      if (tracing_mode_flag || active_effect !== null) {
        source2.updated ??= new Map;
        const count = (source2.updated.get("")?.count ?? 0) + 1;
        source2.updated.set("", { error: null, count });
        if (tracing_mode_flag || count > 5) {
          const error = get_error("updated at");
          if (error !== null) {
            let entry = source2.updated.get(error.stack);
            if (!entry) {
              entry = { error, count: 0 };
              source2.updated.set(error.stack, entry);
            }
            entry.count++;
          }
        }
      }
      if (active_effect !== null) {
        source2.set_during_effect = true;
      }
    }
    if ((source2.f & DERIVED) !== 0) {
      const derived2 = source2;
      if ((source2.f & DIRTY) !== 0) {
        execute_derived(derived2);
      }
      if (batch_values === null) {
        update_derived_status(derived2);
      }
    }
    source2.wv = increment_write_version();
    mark_reactions(source2, DIRTY, updated_during_traversal);
    if (is_runes() && active_effect !== null && (active_effect.f & CLEAN) !== 0 && (active_effect.f & (BRANCH_EFFECT | ROOT_EFFECT)) === 0) {
      if (untracked_writes === null) {
        set_untracked_writes([source2]);
      } else {
        untracked_writes.push(source2);
      }
    }
    if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) {
      flush_eager_effects();
    }
  }
  return value;
}
function flush_eager_effects() {
  eager_effects_deferred = false;
  for (const effect of eager_effects) {
    if ((effect.f & CLEAN) !== 0) {
      set_signal_status(effect, MAYBE_DIRTY);
    }
    let dirty;
    try {
      dirty = is_dirty(effect);
    } catch {
      dirty = true;
    }
    if (dirty) {
      update_effect(effect);
    }
  }
  eager_effects.clear();
}
function update(source2, d = 1) {
  var value = get2(source2);
  var result = d === 1 ? value++ : value--;
  set(source2, value);
  return result;
}
function increment(source2) {
  set(source2, source2.v + 1);
}
function mark_reactions(signal, status, updated_during_traversal) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  var runes = is_runes();
  var length = reactions.length;
  for (var i = 0;i < length; i++) {
    var reaction = reactions[i];
    var flags2 = reaction.f;
    if (!runes && reaction === active_effect)
      continue;
    var not_dirty = (flags2 & DIRTY) === 0;
    if (not_dirty) {
      set_signal_status(reaction, status);
    }
    if ((flags2 & EAGER_EFFECT) !== 0) {
      eager_effects.add(reaction);
    } else if ((flags2 & DERIVED) !== 0) {
      var derived2 = reaction;
      batch_values?.delete(derived2);
      if ((flags2 & WAS_MARKED) === 0) {
        if (flags2 & CONNECTED && (active_effect === null || (active_effect.f & REACTION_IS_UPDATING) === 0)) {
          reaction.f |= WAS_MARKED;
        }
        mark_reactions(derived2, MAYBE_DIRTY, updated_during_traversal);
      }
    } else if (not_dirty) {
      var effect = reaction;
      if ((flags2 & BLOCK_EFFECT) !== 0 && eager_block_effects !== null) {
        eager_block_effects.add(effect);
      }
      if (updated_during_traversal !== null) {
        updated_during_traversal.push(effect);
      } else {
        schedule_effect(effect);
      }
    }
  }
}

// node_modules/svelte/src/internal/client/proxy.js
var regex_is_valid_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
function proxy(value) {
  if (typeof value !== "object" || value === null || STATE_SYMBOL in value) {
    return value;
  }
  const prototype = get_prototype_of(value);
  if (prototype !== object_prototype && prototype !== array_prototype) {
    return value;
  }
  var sources = new Map;
  var is_proxied_array = is_array(value);
  var version = state(0);
  var stack2 = true_default && tracing_mode_flag ? get_error("created at") : null;
  var parent_version = update_version;
  var with_parent = (fn) => {
    if (update_version === parent_version) {
      return fn();
    }
    var reaction = active_reaction;
    var version2 = update_version;
    set_active_reaction(null);
    set_update_version(parent_version);
    var result = fn();
    set_active_reaction(reaction);
    set_update_version(version2);
    return result;
  };
  if (is_proxied_array) {
    sources.set("length", state(value.length, stack2));
    if (true_default) {
      value = inspectable_array(value);
    }
  }
  var path = "";
  let updating = false;
  function update_path(new_path) {
    if (updating)
      return;
    updating = true;
    path = new_path;
    tag(version, `${path} version`);
    for (const [prop, source2] of sources) {
      tag(source2, get_label(path, prop));
    }
    updating = false;
  }
  return new Proxy(value, {
    defineProperty(_, prop, descriptor) {
      if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) {
        state_descriptors_fixed();
      }
      var s = sources.get(prop);
      if (s === undefined) {
        with_parent(() => {
          var s2 = state(descriptor.value, stack2);
          sources.set(prop, s2);
          if (true_default && typeof prop === "string") {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
      } else {
        set(s, descriptor.value, true);
      }
      return true;
    },
    deleteProperty(target, prop) {
      var s = sources.get(prop);
      if (s === undefined) {
        if (prop in target) {
          const s2 = with_parent(() => state(UNINITIALIZED, stack2));
          sources.set(prop, s2);
          increment(version);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
        }
      } else {
        set(s, UNINITIALIZED);
        increment(version);
      }
      return true;
    },
    get(target, prop, receiver) {
      if (prop === STATE_SYMBOL) {
        return value;
      }
      if (true_default && prop === PROXY_PATH_SYMBOL) {
        return update_path;
      }
      var s = sources.get(prop);
      var exists = prop in target;
      if (s === undefined && (!exists || get_descriptor(target, prop)?.writable)) {
        s = with_parent(() => {
          var p = proxy(exists ? target[prop] : UNINITIALIZED);
          var s2 = state(p, stack2);
          if (true_default) {
            tag(s2, get_label(path, prop));
          }
          return s2;
        });
        sources.set(prop, s);
      }
      if (s !== undefined) {
        var v = get2(s);
        return v === UNINITIALIZED ? undefined : v;
      }
      return Reflect.get(target, prop, receiver);
    },
    getOwnPropertyDescriptor(target, prop) {
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor && "value" in descriptor) {
        var s = sources.get(prop);
        if (s)
          descriptor.value = get2(s);
      } else if (descriptor === undefined) {
        var source2 = sources.get(prop);
        var value2 = source2?.v;
        if (source2 !== undefined && value2 !== UNINITIALIZED) {
          return {
            enumerable: true,
            configurable: true,
            value: value2,
            writable: true
          };
        }
      }
      return descriptor;
    },
    has(target, prop) {
      if (prop === STATE_SYMBOL) {
        return true;
      }
      var s = sources.get(prop);
      var has = s !== undefined && s.v !== UNINITIALIZED || Reflect.has(target, prop);
      if (s !== undefined || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
        if (s === undefined) {
          s = with_parent(() => {
            var p = has ? proxy(target[prop]) : UNINITIALIZED;
            var s2 = state(p, stack2);
            if (true_default) {
              tag(s2, get_label(path, prop));
            }
            return s2;
          });
          sources.set(prop, s);
        }
        var value2 = get2(s);
        if (value2 === UNINITIALIZED) {
          return false;
        }
      }
      return has;
    },
    set(target, prop, value2, receiver) {
      var s = sources.get(prop);
      var has = prop in target;
      if (is_proxied_array && prop === "length") {
        for (var i = value2;i < s.v; i += 1) {
          var other_s = sources.get(i + "");
          if (other_s !== undefined) {
            set(other_s, UNINITIALIZED);
          } else if (i in target) {
            other_s = with_parent(() => state(UNINITIALIZED, stack2));
            sources.set(i + "", other_s);
            if (true_default) {
              tag(other_s, get_label(path, i));
            }
          }
        }
      }
      if (s === undefined) {
        if (!has || get_descriptor(target, prop)?.writable) {
          s = with_parent(() => state(undefined, stack2));
          if (true_default) {
            tag(s, get_label(path, prop));
          }
          set(s, proxy(value2));
          sources.set(prop, s);
        }
      } else {
        has = s.v !== UNINITIALIZED;
        var p = with_parent(() => proxy(value2));
        set(s, p);
      }
      var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
      if (descriptor?.set) {
        descriptor.set.call(receiver, value2);
      }
      if (!has) {
        if (is_proxied_array && typeof prop === "string") {
          var ls = sources.get("length");
          var n = Number(prop);
          if (Number.isInteger(n) && n >= ls.v) {
            set(ls, n + 1);
          }
        }
        increment(version);
      }
      return true;
    },
    ownKeys(target) {
      get2(version);
      var own_keys = Reflect.ownKeys(target).filter((key2) => {
        var source3 = sources.get(key2);
        return source3 === undefined || source3.v !== UNINITIALIZED;
      });
      for (var [key, source2] of sources) {
        if (source2.v !== UNINITIALIZED && !(key in target)) {
          own_keys.push(key);
        }
      }
      return own_keys;
    },
    setPrototypeOf() {
      state_prototype_fixed();
    }
  });
}
function get_label(path, prop) {
  if (typeof prop === "symbol")
    return `${path}[Symbol(${prop.description ?? ""})]`;
  if (regex_is_valid_identifier.test(prop))
    return `${path}.${prop}`;
  return /^\d+$/.test(prop) ? `${path}[${prop}]` : `${path}['${prop}']`;
}
function get_proxied_value(value) {
  try {
    if (value !== null && typeof value === "object" && STATE_SYMBOL in value) {
      return value[STATE_SYMBOL];
    }
  } catch {}
  return value;
}
function is(a, b) {
  return Object.is(get_proxied_value(a), get_proxied_value(b));
}
var ARRAY_MUTATING_METHODS = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);
function inspectable_array(array) {
  return new Proxy(array, {
    get(target, prop, receiver) {
      var value = Reflect.get(target, prop, receiver);
      if (!ARRAY_MUTATING_METHODS.has(prop)) {
        return value;
      }
      return function(...args) {
        set_eager_effects_deferred();
        var result = value.apply(this, args);
        flush_eager_effects();
        return result;
      };
    }
  });
}

// node_modules/svelte/src/internal/client/dev/equality.js
function init_array_prototype_warnings() {
  const array_prototype2 = Array.prototype;
  const cleanup = Array.__svelte_cleanup;
  if (cleanup) {
    cleanup();
  }
  const { indexOf, lastIndexOf, includes: includes2 } = array_prototype2;
  array_prototype2.indexOf = function(item, from_index) {
    const index = indexOf.call(this, item, from_index);
    if (index === -1) {
      for (let i = from_index ?? 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.indexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.lastIndexOf = function(item, from_index) {
    const index = lastIndexOf.call(this, item, from_index ?? this.length - 1);
    if (index === -1) {
      for (let i = 0;i <= (from_index ?? this.length - 1); i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.lastIndexOf(...)");
          break;
        }
      }
    }
    return index;
  };
  array_prototype2.includes = function(item, from_index) {
    const has = includes2.call(this, item, from_index);
    if (!has) {
      for (let i = 0;i < this.length; i += 1) {
        if (get_proxied_value(this[i]) === item) {
          state_proxy_equality_mismatch("array.includes(...)");
          break;
        }
      }
    }
    return has;
  };
  Array.__svelte_cleanup = () => {
    array_prototype2.indexOf = indexOf;
    array_prototype2.lastIndexOf = lastIndexOf;
    array_prototype2.includes = includes2;
  };
}

// node_modules/svelte/src/internal/client/dom/operations.js
var $window;
var $document;
var is_firefox;
var first_child_getter;
var next_sibling_getter;
function init_operations() {
  if ($window !== undefined) {
    return;
  }
  $window = window;
  $document = document;
  is_firefox = /Firefox/.test(navigator.userAgent);
  var element_prototype = Element.prototype;
  var node_prototype = Node.prototype;
  var text_prototype = Text.prototype;
  first_child_getter = get_descriptor(node_prototype, "firstChild").get;
  next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
  if (is_extensible(element_prototype)) {
    element_prototype[CLASS_CACHE] = undefined;
    element_prototype[ATTRIBUTES_CACHE] = null;
    element_prototype[STYLE_CACHE] = undefined;
    element_prototype.__e = undefined;
  }
  if (is_extensible(text_prototype)) {
    text_prototype[TEXT_CACHE] = undefined;
  }
  if (true_default) {
    element_prototype.__svelte_meta = null;
    init_array_prototype_warnings();
  }
}
function create_text(value = "") {
  return document.createTextNode(value);
}
function get_first_child(node) {
  return first_child_getter.call(node);
}
function get_next_sibling(node) {
  return next_sibling_getter.call(node);
}
function child(node, is_text) {
  if (!hydrating) {
    return get_first_child(node);
  }
  var child2 = get_first_child(hydrate_node);
  if (child2 === null) {
    child2 = hydrate_node.appendChild(create_text());
  } else if (is_text && child2.nodeType !== TEXT_NODE) {
    var text = create_text();
    child2?.before(text);
    set_hydrate_node(text);
    return text;
  }
  if (is_text) {
    merge_text_nodes(child2);
  }
  set_hydrate_node(child2);
  return child2;
}
function first_child(node, is_text = false) {
  if (!hydrating) {
    var first = get_first_child(node);
    if (first instanceof Comment && first.data === "")
      return get_next_sibling(first);
    return first;
  }
  if (is_text) {
    if (hydrate_node?.nodeType !== TEXT_NODE) {
      var text = create_text();
      hydrate_node?.before(text);
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(hydrate_node);
  }
  return hydrate_node;
}
function sibling(node, count = 1, is_text = false) {
  let next_sibling = hydrating ? hydrate_node : node;
  var last_sibling;
  while (count--) {
    last_sibling = next_sibling;
    next_sibling = get_next_sibling(next_sibling);
  }
  if (!hydrating) {
    return next_sibling;
  }
  if (is_text) {
    if (next_sibling?.nodeType !== TEXT_NODE) {
      var text = create_text();
      if (next_sibling === null) {
        last_sibling?.after(text);
      } else {
        next_sibling.before(text);
      }
      set_hydrate_node(text);
      return text;
    }
    merge_text_nodes(next_sibling);
  }
  set_hydrate_node(next_sibling);
  return next_sibling;
}
function clear_text_content(node) {
  node.textContent = "";
}
function should_defer_append() {
  if (!async_mode_flag)
    return false;
  if (eager_block_effects !== null)
    return false;
  var flags2 = active_effect.f;
  return (flags2 & REACTION_RAN) !== 0;
}
function create_element(tag2, namespace, is2) {
  if (namespace == null || namespace === NAMESPACE_HTML) {
    return is2 ? document.createElement(tag2, { is: is2 }) : document.createElement(tag2);
  }
  return is2 ? document.createElementNS(namespace, tag2, { is: is2 }) : document.createElementNS(namespace, tag2);
}
function merge_text_nodes(text) {
  if (text.nodeValue.length < 65536) {
    return;
  }
  let next2 = text.nextSibling;
  while (next2 !== null && next2.nodeType === TEXT_NODE) {
    next2.remove();
    text.nodeValue += next2.nodeValue;
    next2 = text.nextSibling;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/misc.js
function autofocus(dom, value) {
  if (value) {
    const body = document.body;
    dom.autofocus = true;
    queue_micro_task(() => {
      if (document.activeElement === body) {
        dom.focus();
      }
    });
  }
}
var listening_to_form_reset = false;
function add_form_reset_listener() {
  if (!listening_to_form_reset) {
    listening_to_form_reset = true;
    document.addEventListener("reset", (evt) => {
      Promise.resolve().then(() => {
        if (!evt.defaultPrevented) {
          for (const e of evt.target.elements) {
            e[FORM_RESET_HANDLER]?.();
          }
        }
      });
    }, { capture: true });
  }
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function without_reactive_context(fn) {
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    return fn();
  } finally {
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}
function listen_to_event_and_reset_event(element, event, handler, on_reset = handler) {
  element.addEventListener(event, () => without_reactive_context(handler));
  const prev = element[FORM_RESET_HANDLER];
  if (prev) {
    element[FORM_RESET_HANDLER] = () => {
      prev();
      on_reset(true);
    };
  } else {
    element[FORM_RESET_HANDLER] = () => on_reset(true);
  }
  add_form_reset_listener();
}

// node_modules/svelte/src/internal/client/reactivity/effects.js
function validate_effect(rune) {
  if (active_effect === null) {
    if (active_reaction === null) {
      effect_orphan(rune);
    }
    effect_in_unowned_derived();
  }
  if (is_destroying_effect) {
    effect_in_teardown(rune);
  }
}
function push_effect(effect, parent_effect) {
  var parent_last = parent_effect.last;
  if (parent_last === null) {
    parent_effect.last = parent_effect.first = effect;
  } else {
    parent_last.next = effect;
    effect.prev = parent_last;
    parent_effect.last = effect;
  }
}
function create_effect(type, fn) {
  var parent = active_effect;
  if (true_default) {
    while (parent !== null && (parent.f & EAGER_EFFECT) !== 0) {
      parent = parent.parent;
    }
  }
  if (parent !== null && (parent.f & INERT) !== 0) {
    type |= INERT;
  }
  var effect = {
    ctx: component_context,
    deps: null,
    nodes: null,
    f: type | DIRTY | CONNECTED,
    first: null,
    fn,
    last: null,
    next: null,
    parent,
    b: parent && parent.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  if (true_default) {
    effect.component_function = dev_current_component_function;
  }
  current_batch?.register_created_effect(effect);
  var e = effect;
  if ((type & EFFECT) !== 0) {
    if (collected_effects !== null) {
      collected_effects.push(effect);
    } else {
      Batch.ensure().schedule(effect);
    }
  } else if (fn !== null) {
    try {
      update_effect(effect);
    } catch (e2) {
      destroy_effect(effect);
      throw e2;
    }
    if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & EFFECT_PRESERVED) === 0) {
      e = e.first;
      if ((type & BLOCK_EFFECT) !== 0 && (type & EFFECT_TRANSPARENT) !== 0 && e !== null) {
        e.f |= EFFECT_TRANSPARENT;
      }
    }
  }
  if (e !== null) {
    e.parent = parent;
    if (parent !== null) {
      push_effect(e, parent);
    }
    if (active_reaction !== null && (active_reaction.f & DERIVED) !== 0 && (type & ROOT_EFFECT) === 0) {
      var derived2 = active_reaction;
      (derived2.effects ??= []).push(e);
    }
  }
  return effect;
}
function effect_tracking() {
  return active_reaction !== null && !untracking;
}
function teardown(fn) {
  const effect = create_effect(RENDER_EFFECT, null);
  set_signal_status(effect, CLEAN);
  effect.teardown = fn;
  return effect;
}
function user_effect(fn) {
  validate_effect("$effect");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect"
    });
  }
  var flags2 = active_effect.f;
  var defer = !active_reaction && (flags2 & BRANCH_EFFECT) !== 0 && component_context !== null && !component_context.i;
  if (defer) {
    var context = component_context;
    (context.e ??= []).push(fn);
  } else {
    return create_user_effect(fn);
  }
}
function create_user_effect(fn) {
  return create_effect(EFFECT | USER_EFFECT, fn);
}
function user_pre_effect(fn) {
  validate_effect("$effect.pre");
  if (true_default) {
    define_property(fn, "name", {
      value: "$effect.pre"
    });
  }
  return create_effect(RENDER_EFFECT | USER_EFFECT, fn);
}
function effect_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return () => {
    destroy_effect(effect);
  };
}
function component_root(fn) {
  Batch.ensure();
  const effect = create_effect(ROOT_EFFECT | EFFECT_PRESERVED, fn);
  return (options = {}) => {
    return new Promise((fulfil) => {
      if (options.outro) {
        pause_effect(effect, () => {
          destroy_effect(effect);
          fulfil(undefined);
        });
      } else {
        destroy_effect(effect);
        fulfil(undefined);
      }
    });
  };
}
function effect(fn) {
  return create_effect(EFFECT, fn);
}
function async_effect(fn) {
  return create_effect(ASYNC | EFFECT_PRESERVED, fn);
}
function render_effect(fn, flags2 = 0) {
  return create_effect(RENDER_EFFECT | flags2, fn);
}
function template_effect(fn, sync = [], async = [], blockers = []) {
  flatten(blockers, sync, async, (values) => {
    create_effect(RENDER_EFFECT, () => {
      fn(...values.map(get2));
    });
  });
}
function block(fn, flags2 = 0) {
  var effect2 = create_effect(BLOCK_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function managed(fn, flags2 = 0) {
  var effect2 = create_effect(MANAGED_EFFECT | flags2, fn);
  if (true_default) {
    effect2.dev_stack = dev_stack;
  }
  return effect2;
}
function branch(fn) {
  return create_effect(BRANCH_EFFECT | EFFECT_PRESERVED, fn);
}
function execute_effect_teardown(effect2) {
  var teardown2 = effect2.teardown;
  if (teardown2 !== null) {
    const previously_destroying_effect = is_destroying_effect;
    const previous_reaction = active_reaction;
    set_is_destroying_effect(true);
    set_active_reaction(null);
    try {
      teardown2.call(null);
    } finally {
      set_is_destroying_effect(previously_destroying_effect);
      set_active_reaction(previous_reaction);
    }
  }
}
function destroy_effect_children(signal, remove_dom = false) {
  var effect2 = signal.first;
  signal.first = signal.last = null;
  while (effect2 !== null) {
    const controller = effect2.ac;
    if (controller !== null) {
      without_reactive_context(() => {
        controller.abort(STALE_REACTION);
      });
    }
    var next2 = effect2.next;
    if ((effect2.f & ROOT_EFFECT) !== 0) {
      effect2.parent = null;
    } else {
      destroy_effect(effect2, remove_dom);
    }
    effect2 = next2;
  }
}
function destroy_block_effect_children(signal) {
  var effect2 = signal.first;
  while (effect2 !== null) {
    var next2 = effect2.next;
    if ((effect2.f & BRANCH_EFFECT) === 0) {
      destroy_effect(effect2);
    }
    effect2 = next2;
  }
}
function destroy_effect(effect2, remove_dom = true) {
  var removed = false;
  if ((remove_dom || (effect2.f & HEAD_EFFECT) !== 0) && effect2.nodes !== null && effect2.nodes.end !== null) {
    remove_effect_dom(effect2.nodes.start, effect2.nodes.end);
    removed = true;
  }
  effect2.f |= DESTROYING;
  destroy_effect_children(effect2, remove_dom && !removed);
  remove_reactions(effect2, 0);
  var transitions = effect2.nodes && effect2.nodes.t;
  if (transitions !== null) {
    for (const transition of transitions) {
      transition.stop();
    }
  }
  execute_effect_teardown(effect2);
  effect2.f ^= DESTROYING;
  effect2.f |= DESTROYED;
  var parent = effect2.parent;
  if (parent !== null && parent.first !== null) {
    unlink_effect(effect2);
  }
  if (true_default) {
    effect2.component_function = null;
  }
  effect2.next = effect2.prev = effect2.teardown = effect2.ctx = effect2.deps = effect2.fn = effect2.nodes = effect2.ac = effect2.b = null;
}
function remove_effect_dom(node, end) {
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    node.remove();
    node = next2;
  }
}
function unlink_effect(effect2) {
  var parent = effect2.parent;
  var prev = effect2.prev;
  var next2 = effect2.next;
  if (prev !== null)
    prev.next = next2;
  if (next2 !== null)
    next2.prev = prev;
  if (parent !== null) {
    if (parent.first === effect2)
      parent.first = next2;
    if (parent.last === effect2)
      parent.last = prev;
  }
}
function pause_effect(effect2, callback, destroy = true) {
  var transitions = [];
  pause_children(effect2, transitions, true);
  var fn = () => {
    if (destroy)
      destroy_effect(effect2);
    if (callback)
      callback();
  };
  var remaining = transitions.length;
  if (remaining > 0) {
    var check = () => --remaining || fn();
    for (var transition of transitions) {
      transition.out(check);
    }
  } else {
    fn();
  }
}
function pause_children(effect2, transitions, local) {
  if ((effect2.f & INERT) !== 0)
    return;
  effect2.f ^= INERT;
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transitions.push(transition);
      }
    }
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    if ((child2.f & ROOT_EFFECT) === 0) {
      var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0 && (effect2.f & BLOCK_EFFECT) !== 0;
      pause_children(child2, transitions, transparent ? local : false);
    }
    child2 = sibling2;
  }
}
function resume_effect(effect2) {
  resume_children(effect2, true);
}
function resume_children(effect2, local) {
  if ((effect2.f & INERT) === 0)
    return;
  effect2.f ^= INERT;
  if ((effect2.f & CLEAN) === 0) {
    set_signal_status(effect2, DIRTY);
    Batch.ensure().schedule(effect2);
  }
  var child2 = effect2.first;
  while (child2 !== null) {
    var sibling2 = child2.next;
    var transparent = (child2.f & EFFECT_TRANSPARENT) !== 0 || (child2.f & BRANCH_EFFECT) !== 0;
    resume_children(child2, transparent ? local : false);
    child2 = sibling2;
  }
  var t = effect2.nodes && effect2.nodes.t;
  if (t !== null) {
    for (const transition of t) {
      if (transition.is_global || local) {
        transition.in();
      }
    }
  }
}
function move_effect(effect2, fragment) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  while (node !== null) {
    var next2 = node === end ? null : get_next_sibling(node);
    fragment.append(node);
    node = next2;
  }
}

// node_modules/svelte/src/internal/client/legacy.js
var captured_signals = null;

// node_modules/svelte/src/internal/client/runtime.js
var is_updating_effect = false;
var is_destroying_effect = false;
function set_is_destroying_effect(value) {
  is_destroying_effect = value;
}
var active_reaction = null;
var untracking = false;
function set_active_reaction(reaction) {
  active_reaction = reaction;
}
var active_effect = null;
function set_active_effect(effect2) {
  active_effect = effect2;
}
var current_sources = null;
function push_reaction_value(value) {
  if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & DERIVED) !== 0)) {
    (current_sources ??= new Set).add(value);
  }
}
var new_deps = null;
var skipped_deps = 0;
var untracked_writes = null;
function set_untracked_writes(value) {
  untracked_writes = value;
}
var write_version = 1;
var read_version = 0;
var update_version = read_version;
function set_update_version(value) {
  update_version = value;
}
function increment_write_version() {
  return ++write_version;
}
function is_dirty(reaction) {
  var flags2 = reaction.f;
  if ((flags2 & DIRTY) !== 0) {
    return true;
  }
  if (flags2 & DERIVED) {
    reaction.f &= ~WAS_MARKED;
  }
  if ((flags2 & MAYBE_DIRTY) !== 0) {
    var dependencies = reaction.deps;
    var length = dependencies.length;
    for (var i = 0;i < length; i++) {
      var dependency = dependencies[i];
      if (is_dirty(dependency)) {
        update_derived(dependency);
      }
      if (dependency.wv > reaction.wv) {
        return true;
      }
    }
    if ((flags2 & CONNECTED) !== 0 && batch_values === null) {
      set_signal_status(reaction, CLEAN);
    }
  }
  return false;
}
function schedule_possible_effect_self_invalidation(signal, effect2, root = true) {
  var reactions = signal.reactions;
  if (reactions === null)
    return;
  if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) {
    return;
  }
  for (var i = 0;i < reactions.length; i++) {
    var reaction = reactions[i];
    if ((reaction.f & DERIVED) !== 0) {
      schedule_possible_effect_self_invalidation(reaction, effect2, false);
    } else if (effect2 === reaction) {
      if (root) {
        set_signal_status(reaction, DIRTY);
      } else if ((reaction.f & CLEAN) !== 0) {
        set_signal_status(reaction, MAYBE_DIRTY);
      }
      schedule_effect(reaction);
    }
  }
}
function update_reaction(reaction) {
  var previous_deps = new_deps;
  var previous_skipped_deps = skipped_deps;
  var previous_untracked_writes = untracked_writes;
  var previous_reaction = active_reaction;
  var previous_sources = current_sources;
  var previous_component_context = component_context;
  var previous_untracking = untracking;
  var previous_update_version = update_version;
  var flags2 = reaction.f;
  new_deps = null;
  skipped_deps = 0;
  untracked_writes = null;
  active_reaction = (flags2 & (BRANCH_EFFECT | ROOT_EFFECT)) === 0 ? reaction : null;
  current_sources = null;
  set_component_context(reaction.ctx);
  untracking = false;
  update_version = ++read_version;
  if (reaction.ac !== null) {
    without_reactive_context(() => {
      reaction.ac.abort(STALE_REACTION);
    });
    reaction.ac = null;
  }
  try {
    reaction.f |= REACTION_IS_UPDATING;
    var fn = reaction.fn;
    var result = fn();
    reaction.f |= REACTION_RAN;
    var deps = reaction.deps;
    var is_fork = current_batch?.is_fork;
    if (new_deps !== null) {
      var i;
      if (!is_fork) {
        remove_reactions(reaction, skipped_deps);
      }
      if (deps !== null && skipped_deps > 0) {
        deps.length = skipped_deps + new_deps.length;
        for (i = 0;i < new_deps.length; i++) {
          deps[skipped_deps + i] = new_deps[i];
        }
      } else {
        reaction.deps = deps = new_deps;
      }
      if (effect_tracking() && (reaction.f & CONNECTED) !== 0) {
        for (i = skipped_deps;i < deps.length; i++) {
          (deps[i].reactions ??= []).push(reaction);
        }
      }
    } else if (!is_fork && deps !== null && skipped_deps < deps.length) {
      remove_reactions(reaction, skipped_deps);
      deps.length = skipped_deps;
    }
    if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & (DERIVED | MAYBE_DIRTY | DIRTY)) === 0) {
      for (i = 0;i < untracked_writes.length; i++) {
        schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
      }
    }
    if (previous_reaction !== null && previous_reaction !== reaction) {
      read_version++;
      if (previous_reaction.deps !== null) {
        for (let i2 = 0;i2 < previous_skipped_deps; i2 += 1) {
          previous_reaction.deps[i2].rv = read_version;
        }
      }
      if (previous_deps !== null) {
        for (const dep of previous_deps) {
          dep.rv = read_version;
        }
      }
      if (untracked_writes !== null) {
        if (previous_untracked_writes === null) {
          previous_untracked_writes = untracked_writes;
        } else {
          previous_untracked_writes.push(...untracked_writes);
        }
      }
    }
    if ((reaction.f & ERROR_VALUE) !== 0) {
      reaction.f ^= ERROR_VALUE;
    }
    return result;
  } catch (error) {
    return handle_error(error);
  } finally {
    reaction.f ^= REACTION_IS_UPDATING;
    new_deps = previous_deps;
    skipped_deps = previous_skipped_deps;
    untracked_writes = previous_untracked_writes;
    active_reaction = previous_reaction;
    current_sources = previous_sources;
    set_component_context(previous_component_context);
    untracking = previous_untracking;
    update_version = previous_update_version;
  }
}
function remove_reaction(signal, dependency) {
  let reactions = dependency.reactions;
  if (reactions !== null) {
    var index = index_of.call(reactions, signal);
    if (index !== -1) {
      var new_length = reactions.length - 1;
      if (new_length === 0) {
        reactions = dependency.reactions = null;
      } else {
        reactions[index] = reactions[new_length];
        reactions.pop();
      }
    }
  }
  if (reactions === null && (dependency.f & DERIVED) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
    var derived2 = dependency;
    if ((derived2.f & CONNECTED) !== 0) {
      derived2.f ^= CONNECTED;
      derived2.f &= ~WAS_MARKED;
    }
    if (derived2.v !== UNINITIALIZED) {
      update_derived_status(derived2);
    }
    freeze_derived_effects(derived2);
    remove_reactions(derived2, 0);
  }
}
function remove_reactions(signal, start_index) {
  var dependencies = signal.deps;
  if (dependencies === null)
    return;
  for (var i = start_index;i < dependencies.length; i++) {
    remove_reaction(signal, dependencies[i]);
  }
}
function update_effect(effect2) {
  var flags2 = effect2.f;
  if ((flags2 & DESTROYED) !== 0) {
    return;
  }
  set_signal_status(effect2, CLEAN);
  var previous_effect = active_effect;
  var was_updating_effect = is_updating_effect;
  active_effect = effect2;
  is_updating_effect = true;
  if (true_default) {
    var previous_component_fn = dev_current_component_function;
    set_dev_current_component_function(effect2.component_function);
    var previous_stack = dev_stack;
    set_dev_stack(effect2.dev_stack ?? dev_stack);
  }
  try {
    if ((flags2 & (BLOCK_EFFECT | MANAGED_EFFECT)) !== 0) {
      destroy_block_effect_children(effect2);
    } else {
      destroy_effect_children(effect2);
    }
    execute_effect_teardown(effect2);
    var teardown2 = update_reaction(effect2);
    effect2.teardown = typeof teardown2 === "function" ? teardown2 : null;
    effect2.wv = write_version;
    if (true_default && tracing_mode_flag && (effect2.f & DIRTY) !== 0 && effect2.deps !== null) {
      for (var dep of effect2.deps) {
        if (dep.set_during_effect) {
          dep.wv = increment_write_version();
          dep.set_during_effect = false;
        }
      }
    }
  } finally {
    is_updating_effect = was_updating_effect;
    active_effect = previous_effect;
    if (true_default) {
      set_dev_current_component_function(previous_component_fn);
      set_dev_stack(previous_stack);
    }
  }
}
async function tick() {
  if (async_mode_flag) {
    return new Promise((f) => {
      requestAnimationFrame(() => f());
      setTimeout(() => f());
    });
  }
  await Promise.resolve();
  flushSync();
}
function get2(signal) {
  var flags2 = signal.f;
  var is_derived = (flags2 & DERIVED) !== 0;
  captured_signals?.add(signal);
  if (active_reaction !== null && !untracking) {
    var destroyed = active_effect !== null && (active_effect.f & DESTROYED) !== 0;
    if (!destroyed && (current_sources === null || !current_sources.has(signal))) {
      var deps = active_reaction.deps;
      if ((active_reaction.f & REACTION_IS_UPDATING) !== 0) {
        if (signal.rv < read_version) {
          signal.rv = read_version;
          if (new_deps === null && deps !== null && deps[skipped_deps] === signal) {
            skipped_deps++;
          } else if (new_deps === null) {
            new_deps = [signal];
          } else {
            new_deps.push(signal);
          }
        }
      } else {
        active_reaction.deps ??= [];
        if (!includes.call(active_reaction.deps, signal)) {
          active_reaction.deps.push(signal);
        }
        var reactions = signal.reactions;
        if (reactions === null) {
          signal.reactions = [active_reaction];
        } else if (!includes.call(reactions, active_reaction)) {
          reactions.push(active_reaction);
        }
      }
    }
  }
  if (true_default) {
    if (!untracking && reactivity_loss_tracker && current_batch === null && previous_batch === null && !reactivity_loss_tracker.warned && (reactivity_loss_tracker.effect.f & REACTION_IS_UPDATING) === 0 && !reactivity_loss_tracker.effect_deps.has(signal)) {
      reactivity_loss_tracker.warned = true;
      await_reactivity_loss(signal.label);
      var trace = get_error("traced at");
      if (trace)
        console.warn(trace);
    }
    recent_async_deriveds.delete(signal);
    if (tracing_mode_flag && !untracking && tracing_expressions !== null && active_reaction !== null && tracing_expressions.reaction === active_reaction) {
      if (signal.trace) {
        signal.trace();
      } else {
        trace = get_error("traced at");
        if (trace) {
          var entry = tracing_expressions.entries.get(signal);
          if (entry === undefined) {
            entry = { traces: [] };
            tracing_expressions.entries.set(signal, entry);
          }
          var last = entry.traces[entry.traces.length - 1];
          if (trace.stack !== last?.stack) {
            entry.traces.push(trace);
          }
        }
      }
    }
  }
  if (is_destroying_effect && old_values.has(signal)) {
    return old_values.get(signal);
  }
  if (is_derived) {
    var derived2 = signal;
    if (is_destroying_effect) {
      var value = derived2.v;
      if ((derived2.f & CLEAN) === 0 && derived2.reactions !== null || depends_on_old_values(derived2)) {
        value = execute_derived(derived2);
      }
      old_values.set(derived2, value);
      return value;
    }
    var should_connect = (derived2.f & CONNECTED) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & CONNECTED) !== 0);
    var is_new = (derived2.f & REACTION_RAN) === 0;
    if (is_dirty(derived2)) {
      if (should_connect) {
        derived2.f |= CONNECTED;
      }
      update_derived(derived2);
    }
    if (should_connect && !is_new) {
      unfreeze_derived_effects(derived2);
      reconnect(derived2);
    }
  }
  if (batch_values?.has(signal)) {
    return batch_values.get(signal);
  }
  if ((signal.f & ERROR_VALUE) !== 0) {
    throw signal.v;
  }
  return signal.v;
}
function reconnect(derived2) {
  derived2.f |= CONNECTED;
  if (derived2.deps === null)
    return;
  for (const dep of derived2.deps) {
    (dep.reactions ??= []).push(derived2);
    if ((dep.f & DERIVED) !== 0 && (dep.f & CONNECTED) === 0) {
      unfreeze_derived_effects(dep);
      reconnect(dep);
    }
  }
}
function depends_on_old_values(derived2) {
  if (derived2.v === UNINITIALIZED)
    return true;
  if (derived2.deps === null)
    return false;
  for (const dep of derived2.deps) {
    if (old_values.has(dep)) {
      return true;
    }
    if ((dep.f & DERIVED) !== 0 && depends_on_old_values(dep)) {
      return true;
    }
  }
  return false;
}
function untrack(fn) {
  var previous_untracking = untracking;
  try {
    untracking = true;
    return fn();
  } finally {
    untracking = previous_untracking;
  }
}
function deep_read_state(value) {
  if (typeof value !== "object" || !value || value instanceof EventTarget) {
    return;
  }
  if (STATE_SYMBOL in value) {
    deep_read(value);
  } else if (!Array.isArray(value)) {
    for (let key in value) {
      const prop = value[key];
      if (typeof prop === "object" && prop && STATE_SYMBOL in prop) {
        deep_read(prop);
      }
    }
  }
}
function deep_read(value, visited = new Set) {
  if (typeof value === "object" && value !== null && !(value instanceof EventTarget) && !visited.has(value)) {
    visited.add(value);
    if (value instanceof Date) {
      value.getTime();
    }
    for (let key in value) {
      try {
        deep_read(value[key], visited);
      } catch (e) {}
    }
    const proto = get_prototype_of(value);
    if (proto !== Object.prototype && proto !== Array.prototype && proto !== Map.prototype && proto !== Set.prototype && proto !== Date.prototype) {
      const descriptors = get_descriptors(proto);
      for (let key in descriptors) {
        const get3 = descriptors[key].get;
        if (get3) {
          try {
            get3.call(value);
          } catch (e) {}
        }
      }
    }
  }
}
// node_modules/svelte/src/utils.js
function is_capture_event(name) {
  return name.endsWith("capture") && name !== "gotpointercapture" && name !== "lostpointercapture";
}
var DELEGATED_EVENTS = [
  "beforeinput",
  "click",
  "change",
  "dblclick",
  "contextmenu",
  "focusin",
  "focusout",
  "input",
  "keydown",
  "keyup",
  "mousedown",
  "mousemove",
  "mouseout",
  "mouseover",
  "mouseup",
  "pointerdown",
  "pointermove",
  "pointerout",
  "pointerover",
  "pointerup",
  "touchend",
  "touchmove",
  "touchstart"
];
function can_delegate_event(event_name) {
  return DELEGATED_EVENTS.includes(event_name);
}
var DOM_BOOLEAN_ATTRIBUTES = [
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "disabled",
  "formnovalidate",
  "indeterminate",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "seamless",
  "selected",
  "webkitdirectory",
  "defer",
  "disablepictureinpicture",
  "disableremoteplayback"
];
var ATTRIBUTE_ALIASES = {
  formnovalidate: "formNoValidate",
  ismap: "isMap",
  nomodule: "noModule",
  playsinline: "playsInline",
  readonly: "readOnly",
  defaultvalue: "defaultValue",
  defaultchecked: "defaultChecked",
  srcobject: "srcObject",
  novalidate: "noValidate",
  allowfullscreen: "allowFullscreen",
  disablepictureinpicture: "disablePictureInPicture",
  disableremoteplayback: "disableRemotePlayback"
};
function normalize_attribute(name) {
  name = name.toLowerCase();
  return ATTRIBUTE_ALIASES[name] ?? name;
}
var DOM_PROPERTIES = [
  ...DOM_BOOLEAN_ATTRIBUTES,
  "formNoValidate",
  "isMap",
  "noModule",
  "playsInline",
  "readOnly",
  "value",
  "volume",
  "defaultValue",
  "defaultChecked",
  "srcObject",
  "noValidate",
  "allowFullscreen",
  "disablePictureInPicture",
  "disableRemotePlayback"
];
var PASSIVE_EVENTS = ["touchstart", "touchmove"];
function is_passive_event(name) {
  return PASSIVE_EVENTS.includes(name);
}
var STATE_CREATION_RUNES = [
  "$state",
  "$state.raw",
  "$derived",
  "$derived.by"
];
var RUNES = [
  ...STATE_CREATION_RUNES,
  "$state.eager",
  "$state.snapshot",
  "$props",
  "$props.id",
  "$bindable",
  "$effect",
  "$effect.pre",
  "$effect.tracking",
  "$effect.root",
  "$effect.pending",
  "$inspect",
  "$inspect().with",
  "$inspect.trace",
  "$host"
];
var RAW_TEXT_ELEMENTS = ["textarea", "script", "style", "title"];
function is_raw_text_element(name) {
  return RAW_TEXT_ELEMENTS.includes(name);
}
// node_modules/svelte/src/internal/client/dev/css.js
var all_styles = new Map;
// node_modules/svelte/src/internal/client/dom/elements/events.js
var event_symbol = Symbol("events");
var all_registered_events = new Set;
var root_event_handles = new Set;
function create_event(event_name, dom, handler, options = {}) {
  function target_handler(event) {
    if (!options.capture) {
      handle_event_propagation.call(dom, event);
    }
    if (!event.cancelBubble) {
      return without_reactive_context(() => {
        return handler?.call(this, event);
      });
    }
  }
  if (event_name.startsWith("pointer") || event_name.startsWith("touch") || event_name === "wheel") {
    queue_micro_task(() => {
      dom.addEventListener(event_name, target_handler, options);
    });
  } else {
    dom.addEventListener(event_name, target_handler, options);
  }
  return target_handler;
}
function event(event_name, dom, handler, capture2, passive) {
  var options = { capture: capture2, passive };
  var target_handler = create_event(event_name, dom, handler, options);
  if (dom === document.body || dom === window || dom === document || dom instanceof HTMLMediaElement) {
    teardown(() => {
      dom.removeEventListener(event_name, target_handler, options);
    });
  }
}
function delegated(event_name, element, handler) {
  (element[event_symbol] ??= {})[event_name] = handler;
}
function delegate(events) {
  for (var i = 0;i < events.length; i++) {
    all_registered_events.add(events[i]);
  }
  for (var fn of root_event_handles) {
    fn(events);
  }
}
var last_propagated_event = null;
function handle_event_propagation(event2) {
  var handler_element = this;
  var owner_document = handler_element.ownerDocument;
  var event_name = event2.type;
  var path = event2.composedPath?.() || [];
  var current_target = path[0] || event2.target;
  last_propagated_event = event2;
  var path_idx = 0;
  var handled_at = last_propagated_event === event2 && event2[event_symbol];
  if (handled_at) {
    var at_idx = path.indexOf(handled_at);
    if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
      event2[event_symbol] = handler_element;
      return;
    }
    var handler_idx = path.indexOf(handler_element);
    if (handler_idx === -1) {
      return;
    }
    if (at_idx <= handler_idx) {
      path_idx = at_idx;
    }
  }
  current_target = path[path_idx] || event2.target;
  if (current_target === handler_element)
    return;
  define_property(event2, "currentTarget", {
    configurable: true,
    get() {
      return current_target || owner_document;
    }
  });
  var previous_reaction = active_reaction;
  var previous_effect = active_effect;
  set_active_reaction(null);
  set_active_effect(null);
  try {
    var throw_error;
    var other_errors = [];
    while (current_target !== null) {
      if (current_target === handler_element)
        break;
      try {
        var delegated2 = current_target[event_symbol]?.[event_name];
        if (delegated2 != null && (!current_target.disabled || event2.target === current_target)) {
          delegated2.call(current_target, event2);
        }
      } catch (error) {
        if (throw_error) {
          other_errors.push(error);
        } else {
          throw_error = error;
        }
      }
      if (event2.cancelBubble)
        break;
      path_idx++;
      current_target = path_idx < path.length ? path[path_idx] : null;
    }
    if (throw_error) {
      for (let error of other_errors) {
        queueMicrotask(() => {
          throw error;
        });
      }
      throw throw_error;
    }
  } finally {
    event2[event_symbol] = handler_element;
    delete event2.currentTarget;
    set_active_reaction(previous_reaction);
    set_active_effect(previous_effect);
  }
}

// node_modules/svelte/src/internal/client/dom/reconciler.js
var policy = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
  createHTML: (html) => {
    return html;
  }
});
function create_trusted_html(html) {
  return policy?.createHTML(html) ?? html;
}
function create_fragment_from_html(html) {
  var elem = create_element("template");
  elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
  return elem.content;
}

// node_modules/svelte/src/internal/client/dom/template.js
function assign_nodes(start, end) {
  var effect2 = active_effect;
  if (effect2.nodes === null) {
    effect2.nodes = { start, end, a: null, t: null };
  }
}
function from_html(content, flags2) {
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags2 & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === undefined) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment)
        node = get_first_child(node);
    }
    var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_namespace(content, flags2, ns = "svg") {
  var has_start = !content.startsWith("<!>");
  var is_fragment = (flags2 & TEMPLATE_FRAGMENT) !== 0;
  var wrapped = `<${ns}>${has_start ? content : "<!>" + content}</${ns}>`;
  var node;
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (!node) {
      var fragment = create_fragment_from_html(wrapped);
      var root = get_first_child(fragment);
      if (is_fragment) {
        node = document.createDocumentFragment();
        while (get_first_child(root)) {
          node.appendChild(get_first_child(root));
        }
      } else {
        node = get_first_child(root);
      }
    }
    var clone = node.cloneNode(true);
    if (is_fragment) {
      var start = get_first_child(clone);
      var end = clone.lastChild;
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function from_svg(content, flags2) {
  return from_namespace(content, flags2, "svg");
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== TEXT_NODE) {
    node.before(node = create_text());
    set_hydrate_node(node);
  } else {
    merge_text_nodes(node);
  }
  assign_nodes(node, node);
  return node;
}
function append(anchor, dom) {
  if (hydrating) {
    var effect2 = active_effect;
    if ((effect2.f & REACTION_RAN) === 0 || effect2.nodes.end === null) {
      effect2.nodes.end = hydrate_node;
    }
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(dom);
}

// node_modules/svelte/src/internal/client/render.js
var should_intro = true;
function set_should_intro(value) {
  should_intro = value;
}
function set_text(text2, value) {
  var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
  if (str !== (text2[TEXT_CACHE] ??= text2.nodeValue)) {
    text2[TEXT_CACHE] = str;
    text2.nodeValue = `${str}`;
  }
}
function mount(component, options) {
  return _mount(component, options);
}
function hydrate(component, options) {
  init_operations();
  options.intro = options.intro ?? false;
  const target = options.target;
  const was_hydrating = hydrating;
  const previous_hydrate_node = hydrate_node;
  try {
    var anchor = get_first_child(target);
    while (anchor && (anchor.nodeType !== COMMENT_NODE || anchor.data !== HYDRATION_START)) {
      anchor = get_next_sibling(anchor);
    }
    if (!anchor) {
      throw HYDRATION_ERROR;
    }
    set_hydrating(true);
    set_hydrate_node(anchor);
    const instance = _mount(component, { ...options, anchor });
    set_hydrating(false);
    return instance;
  } catch (error) {
    if (error instanceof Error && error.message.split(`
`).some((line) => line.startsWith("https://svelte.dev/e/"))) {
      throw error;
    }
    if (error !== HYDRATION_ERROR) {
      console.warn("Failed to hydrate: ", error);
    }
    if (options.recover === false) {
      hydration_failed();
    }
    init_operations();
    clear_text_content(target);
    set_hydrating(false);
    return mount(component, options);
  } finally {
    set_hydrating(was_hydrating);
    set_hydrate_node(previous_hydrate_node);
  }
}
var listeners = new Map;
function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
  init_operations();
  var component = undefined;
  var unmount = component_root(() => {
    var anchor_node = anchor ?? target.appendChild(create_text());
    boundary(anchor_node, {
      pending: () => {}
    }, (anchor_node2) => {
      push({});
      var ctx = component_context;
      if (context)
        ctx.c = context;
      if (events) {
        props.$$events = events;
      }
      if (hydrating) {
        assign_nodes(anchor_node2, null);
      }
      should_intro = intro;
      component = Component(anchor_node2, props) || {};
      should_intro = true;
      if (hydrating) {
        active_effect.nodes.end = hydrate_node;
        if (hydrate_node === null || hydrate_node.nodeType !== COMMENT_NODE || hydrate_node.data !== HYDRATION_END) {
          hydration_mismatch();
          throw HYDRATION_ERROR;
        }
      }
      pop();
    }, transformError);
    var registered_events = new Set;
    var event_handle = (events2) => {
      for (var i = 0;i < events2.length; i++) {
        var event_name = events2[i];
        if (registered_events.has(event_name))
          continue;
        registered_events.add(event_name);
        var passive = is_passive_event(event_name);
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          if (counts === undefined) {
            counts = new Map;
            listeners.set(node, counts);
          }
          var count = counts.get(event_name);
          if (count === undefined) {
            node.addEventListener(event_name, handle_event_propagation, { passive });
            counts.set(event_name, 1);
          } else {
            counts.set(event_name, count + 1);
          }
        }
      }
    };
    event_handle(array_from(all_registered_events));
    root_event_handles.add(event_handle);
    return () => {
      for (var event_name of registered_events) {
        for (const node of [target, document]) {
          var counts = listeners.get(node);
          var count = counts.get(event_name);
          if (--count == 0) {
            node.removeEventListener(event_name, handle_event_propagation);
            counts.delete(event_name);
            if (counts.size === 0) {
              listeners.delete(node);
            }
          } else {
            counts.set(event_name, count);
          }
        }
      }
      root_event_handles.delete(event_handle);
      if (anchor_node !== anchor) {
        anchor_node.parentNode?.removeChild(anchor_node);
      }
    };
  });
  mounted_components.set(component, unmount);
  return component;
}
var mounted_components = new WeakMap;
function unmount(component, options) {
  const fn = mounted_components.get(component);
  if (fn) {
    mounted_components.delete(component);
    return fn(options);
  }
  if (true_default) {
    if (STATE_SYMBOL in component) {
      state_proxy_unmount();
    } else {
      lifecycle_double_unmount();
    }
  }
  return Promise.resolve();
}
// node_modules/svelte/src/internal/client/dom/blocks/branches.js
class BranchManager {
  anchor;
  #batches = new Map;
  #onscreen = new Map;
  #offscreen = new Map;
  #outroing = new Set;
  #transition = true;
  constructor(anchor, transition = true) {
    this.anchor = anchor;
    this.#transition = transition;
  }
  #commit = (batch) => {
    if (!this.#batches.has(batch))
      return;
    var key = this.#batches.get(batch);
    var onscreen = this.#onscreen.get(key);
    if (onscreen) {
      resume_effect(onscreen);
      this.#outroing.delete(key);
    } else {
      var offscreen = this.#offscreen.get(key);
      if (offscreen) {
        resume_effect(offscreen.effect);
        this.#onscreen.set(key, offscreen.effect);
        this.#offscreen.delete(key);
        if (true_default) {
          offscreen.fragment.lastChild[HMR_ANCHOR] = this.anchor;
        }
        offscreen.fragment.lastChild.remove();
        this.anchor.before(offscreen.fragment);
        onscreen = offscreen.effect;
      }
    }
    for (const [b, k] of this.#batches) {
      this.#batches.delete(b);
      if (b === batch) {
        break;
      }
      const offscreen2 = this.#offscreen.get(k);
      if (offscreen2) {
        destroy_effect(offscreen2.effect);
        this.#offscreen.delete(k);
      }
    }
    for (const [k, effect2] of this.#onscreen) {
      if (k === key || this.#outroing.has(k))
        continue;
      const on_destroy = () => {
        const keys = Array.from(this.#batches.values());
        if (keys.includes(k)) {
          var fragment = document.createDocumentFragment();
          move_effect(effect2, fragment);
          fragment.append(create_text());
          this.#offscreen.set(k, { effect: effect2, fragment });
        } else {
          destroy_effect(effect2);
        }
        this.#outroing.delete(k);
        this.#onscreen.delete(k);
      };
      if (this.#transition || !onscreen) {
        this.#outroing.add(k);
        pause_effect(effect2, on_destroy, false);
      } else {
        on_destroy();
      }
    }
  };
  #discard = (batch) => {
    this.#batches.delete(batch);
    const keys = Array.from(this.#batches.values());
    for (const [k, branch2] of this.#offscreen) {
      if (!keys.includes(k)) {
        destroy_effect(branch2.effect);
        this.#offscreen.delete(k);
      }
    }
  };
  ensure(key, fn) {
    var batch = current_batch;
    var defer = should_defer_append();
    if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) {
      if (defer) {
        var fragment = document.createDocumentFragment();
        var target = create_text();
        fragment.append(target);
        this.#offscreen.set(key, {
          effect: branch(() => fn(target)),
          fragment
        });
      } else {
        this.#onscreen.set(key, branch(() => fn(this.anchor)));
      }
    }
    this.#batches.set(batch, key);
    if (defer) {
      for (const [k, effect2] of this.#onscreen) {
        if (k === key) {
          batch.unskip_effect(effect2);
        } else {
          batch.skip_effect(effect2);
        }
      }
      for (const [k, branch2] of this.#offscreen) {
        if (k === key) {
          batch.unskip_effect(branch2.effect);
        } else {
          batch.skip_effect(branch2.effect);
        }
      }
      batch.oncommit(this.#commit);
      batch.ondiscard(this.#discard);
    } else {
      if (hydrating) {
        this.anchor = hydrate_node;
      }
      this.#commit(batch);
    }
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/if.js
function if_block(node, fn, elseif = false) {
  var marker;
  if (hydrating) {
    marker = hydrate_node;
    hydrate_next();
  }
  var branches = new BranchManager(node);
  var flags2 = elseif ? EFFECT_TRANSPARENT : 0;
  function update_branch(key, fn2) {
    if (hydrating) {
      var data = read_hydration_instruction(marker);
      if (key !== parseInt(data.substring(1))) {
        var anchor = skip_nodes();
        set_hydrate_node(anchor);
        branches.anchor = anchor;
        set_hydrating(false);
        branches.ensure(key, fn2);
        set_hydrating(true);
        return;
      }
    }
    branches.ensure(key, fn2);
  }
  block(() => {
    var has_branch = false;
    fn((fn2, key = 0) => {
      has_branch = true;
      update_branch(key, fn2);
    });
    if (!has_branch) {
      update_branch(-1, null);
    }
  }, flags2);
}
// node_modules/svelte/src/internal/client/dom/blocks/key.js
var NAN = Symbol("NaN");
// node_modules/svelte/src/internal/client/dom/blocks/each.js
function index(_, i) {
  return i;
}
function pause_effects(state2, to_destroy, controlled_anchor) {
  var transitions = [];
  var length = to_destroy.length;
  var group;
  var remaining = to_destroy.length;
  for (var i = 0;i < length; i++) {
    let effect2 = to_destroy[i];
    pause_effect(effect2, () => {
      if (group) {
        group.pending.delete(effect2);
        group.done.add(effect2);
        if (group.pending.size === 0) {
          var groups = state2.outrogroups;
          destroy_effects(state2, array_from(group.done));
          groups.delete(group);
          if (groups.size === 0) {
            state2.outrogroups = null;
          }
        }
      } else {
        remaining -= 1;
      }
    }, false);
  }
  if (remaining === 0) {
    var fast_path = transitions.length === 0 && controlled_anchor !== null;
    if (fast_path) {
      var anchor = controlled_anchor;
      var parent_node = anchor.parentNode;
      clear_text_content(parent_node);
      parent_node.append(anchor);
      state2.items.clear();
    }
    destroy_effects(state2, to_destroy, !fast_path);
  } else {
    group = {
      pending: new Set(to_destroy),
      done: new Set
    };
    (state2.outrogroups ??= new Set).add(group);
  }
}
function destroy_effects(state2, to_destroy, remove_dom = true) {
  var preserved_effects;
  if (state2.pending.size > 0) {
    preserved_effects = new Set;
    for (const keys of state2.pending.values()) {
      for (const key of keys) {
        preserved_effects.add(state2.items.get(key).e);
      }
    }
  }
  for (var i = 0;i < to_destroy.length; i++) {
    var e = to_destroy[i];
    if (preserved_effects?.has(e)) {
      e.f |= EFFECT_OFFSCREEN;
      const fragment = document.createDocumentFragment();
      move_effect(e, fragment);
    } else {
      destroy_effect(to_destroy[i], remove_dom);
    }
  }
}
var offscreen_anchor;
function each(node, flags2, get_collection, get_key, render_fn, fallback_fn = null) {
  var anchor = node;
  var items = new Map;
  var is_controlled = (flags2 & EACH_IS_CONTROLLED) !== 0;
  if (is_controlled) {
    var parent_node = node;
    anchor = hydrating ? set_hydrate_node(get_first_child(parent_node)) : parent_node.appendChild(create_text());
  }
  if (hydrating) {
    hydrate_next();
  }
  var fallback = null;
  var each_array = derived_safe_equal(() => {
    var collection = get_collection();
    return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
  });
  if (true_default) {
    tag(each_array, "{#each ...}");
  }
  var array;
  var pending = new Map;
  var first_run = true;
  function commit(batch) {
    if ((state2.effect.f & DESTROYED) !== 0) {
      return;
    }
    state2.pending.delete(batch);
    state2.fallback = fallback;
    reconcile(state2, array, anchor, flags2, get_key);
    if (fallback !== null) {
      if (array.length === 0) {
        if ((fallback.f & EFFECT_OFFSCREEN) === 0) {
          resume_effect(fallback);
        } else {
          fallback.f ^= EFFECT_OFFSCREEN;
          move(fallback, null, anchor);
        }
      } else {
        pause_effect(fallback, () => {
          fallback = null;
        });
      }
    }
  }
  function discard(batch) {
    state2.pending.delete(batch);
  }
  var effect2 = block(() => {
    array = get2(each_array);
    var length = array.length;
    let mismatch = false;
    if (hydrating) {
      var is_else = read_hydration_instruction(anchor) === HYDRATION_START_ELSE;
      if (is_else !== (length === 0)) {
        anchor = skip_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
      }
    }
    var keys = new Set;
    var batch = current_batch;
    var defer = should_defer_append();
    for (var index2 = 0;index2 < length; index2 += 1) {
      if (hydrating && hydrate_node.nodeType === COMMENT_NODE && hydrate_node.data === HYDRATION_END) {
        anchor = hydrate_node;
        mismatch = true;
        set_hydrating(false);
      }
      var value = array[index2];
      var key = get_key(value, index2);
      if (true_default) {
        var key_again = get_key(value, index2);
        if (key !== key_again) {
          each_key_volatile(String(index2), String(key), String(key_again));
        }
      }
      var item = first_run ? null : items.get(key);
      if (item) {
        if (item.v)
          internal_set(item.v, value);
        if (item.i)
          internal_set(item.i, index2);
        if (defer) {
          batch.unskip_effect(item.e);
        }
      } else {
        item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index2, render_fn, flags2, get_collection);
        if (!first_run) {
          item.e.f |= EFFECT_OFFSCREEN;
        }
        items.set(key, item);
      }
      keys.add(key);
    }
    if (length === 0 && fallback_fn && !fallback) {
      if (first_run) {
        fallback = branch(() => fallback_fn(anchor));
      } else {
        fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
        fallback.f |= EFFECT_OFFSCREEN;
      }
    }
    if (length > keys.size) {
      if (true_default) {
        validate_each_keys(array, get_key);
      } else {
        each_key_duplicate("", "", "");
      }
    }
    if (hydrating && length > 0) {
      set_hydrate_node(skip_nodes());
    }
    if (!first_run) {
      pending.set(batch, keys);
      if (defer) {
        for (const [key2, item2] of items) {
          if (!keys.has(key2)) {
            batch.skip_effect(item2.e);
          }
        }
        batch.oncommit(commit);
        batch.ondiscard(discard);
      } else {
        commit(batch);
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
    get2(each_array);
  });
  var state2 = { effect: effect2, flags: flags2, items, pending, outrogroups: null, fallback };
  first_run = false;
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function skip_to_branch(effect2) {
  while (effect2 !== null && (effect2.f & BRANCH_EFFECT) === 0) {
    effect2 = effect2.next;
  }
  return effect2;
}
function reconcile(state2, array, anchor, flags2, get_key) {
  var is_animated = (flags2 & EACH_IS_ANIMATED) !== 0;
  var length = array.length;
  var items = state2.items;
  var current = skip_to_branch(state2.effect.first);
  var seen;
  var prev = null;
  var to_animate;
  var matched = [];
  var stashed = [];
  var value;
  var key;
  var effect2;
  var i;
  if (is_animated) {
    for (i = 0;i < length; i += 1) {
      value = array[i];
      key = get_key(value, i);
      effect2 = items.get(key).e;
      if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
        effect2.nodes?.a?.measure();
        (to_animate ??= new Set).add(effect2);
      }
    }
  }
  for (i = 0;i < length; i += 1) {
    value = array[i];
    key = get_key(value, i);
    effect2 = items.get(key).e;
    if (state2.outrogroups !== null) {
      for (const group of state2.outrogroups) {
        group.pending.delete(effect2);
        group.done.delete(effect2);
      }
    }
    if ((effect2.f & INERT) !== 0) {
      resume_effect(effect2);
      if (is_animated) {
        effect2.nodes?.a?.unfix();
        (to_animate ??= new Set).delete(effect2);
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) !== 0) {
      effect2.f ^= EFFECT_OFFSCREEN;
      if (effect2 === current) {
        move(effect2, null, anchor);
      } else {
        var next2 = prev ? prev.next : current;
        if (effect2 === state2.effect.last) {
          state2.effect.last = effect2.prev;
        }
        if (effect2.prev)
          effect2.prev.next = effect2.next;
        if (effect2.next)
          effect2.next.prev = effect2.prev;
        link(state2, prev, effect2);
        link(state2, effect2, next2);
        move(effect2, next2, anchor);
        prev = effect2;
        matched = [];
        stashed = [];
        current = skip_to_branch(prev.next);
        continue;
      }
    }
    if (effect2 !== current) {
      if (seen !== undefined && seen.has(effect2)) {
        if (matched.length < stashed.length) {
          var start = stashed[0];
          var j;
          prev = start.prev;
          var a = matched[0];
          var b = matched[matched.length - 1];
          for (j = 0;j < matched.length; j += 1) {
            move(matched[j], start, anchor);
          }
          for (j = 0;j < stashed.length; j += 1) {
            seen.delete(stashed[j]);
          }
          link(state2, a.prev, b.next);
          link(state2, prev, a);
          link(state2, b, start);
          current = start;
          prev = b;
          i -= 1;
          matched = [];
          stashed = [];
        } else {
          seen.delete(effect2);
          move(effect2, current, anchor);
          link(state2, effect2.prev, effect2.next);
          link(state2, effect2, prev === null ? state2.effect.first : prev.next);
          link(state2, prev, effect2);
          prev = effect2;
        }
        continue;
      }
      matched = [];
      stashed = [];
      while (current !== null && current !== effect2) {
        (seen ??= new Set).add(current);
        stashed.push(current);
        current = skip_to_branch(current.next);
      }
      if (current === null) {
        continue;
      }
    }
    if ((effect2.f & EFFECT_OFFSCREEN) === 0) {
      matched.push(effect2);
    }
    prev = effect2;
    current = skip_to_branch(effect2.next);
  }
  if (state2.outrogroups !== null) {
    for (const group of state2.outrogroups) {
      if (group.pending.size === 0) {
        destroy_effects(state2, array_from(group.done));
        state2.outrogroups?.delete(group);
      }
    }
    if (state2.outrogroups.size === 0) {
      state2.outrogroups = null;
    }
  }
  if (current !== null || seen !== undefined) {
    var to_destroy = [];
    if (seen !== undefined) {
      for (effect2 of seen) {
        if ((effect2.f & INERT) === 0) {
          to_destroy.push(effect2);
        }
      }
    }
    while (current !== null) {
      if ((current.f & INERT) === 0 && current !== state2.fallback) {
        to_destroy.push(current);
      }
      current = skip_to_branch(current.next);
    }
    var destroy_length = to_destroy.length;
    if (destroy_length > 0) {
      var controlled_anchor = (flags2 & EACH_IS_CONTROLLED) !== 0 && length === 0 ? anchor : null;
      if (is_animated) {
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.measure();
        }
        for (i = 0;i < destroy_length; i += 1) {
          to_destroy[i].nodes?.a?.fix();
        }
      }
      pause_effects(state2, to_destroy, controlled_anchor);
    }
  }
  if (is_animated) {
    queue_micro_task(() => {
      if (to_animate === undefined)
        return;
      for (effect2 of to_animate) {
        effect2.nodes?.a?.apply();
      }
    });
  }
}
function create_item(items, anchor, value, key, index2, render_fn, flags2, get_collection) {
  var v = (flags2 & EACH_ITEM_REACTIVE) !== 0 ? (flags2 & EACH_ITEM_IMMUTABLE) === 0 ? mutable_source(value, false, false) : source(value) : null;
  var i = (flags2 & EACH_INDEX_REACTIVE) !== 0 ? source(index2) : null;
  if (true_default && v) {
    v.trace = () => {
      get_collection()[i?.v ?? index2];
    };
  }
  return {
    v,
    i,
    e: branch(() => {
      render_fn(anchor, v ?? value, i ?? index2, get_collection);
      return () => {
        items.delete(key);
      };
    })
  };
}
function move(effect2, next2, anchor) {
  if (!effect2.nodes)
    return;
  var node = effect2.nodes.start;
  var end = effect2.nodes.end;
  var dest = next2 && (next2.f & EFFECT_OFFSCREEN) === 0 ? next2.nodes.start : anchor;
  while (node !== null) {
    var next_node = get_next_sibling(node);
    dest.before(node);
    if (node === end) {
      return;
    }
    node = next_node;
  }
}
function link(state2, prev, next2) {
  if (prev === null) {
    state2.effect.first = next2;
  } else {
    prev.next = next2;
  }
  if (next2 === null) {
    state2.effect.last = prev;
  } else {
    next2.prev = prev;
  }
}
function validate_each_keys(array, key_fn) {
  const keys = new Map;
  const length = array.length;
  for (let i = 0;i < length; i++) {
    const key = key_fn(array[i], i);
    if (keys.has(key)) {
      const a = String(keys.get(key));
      const b = String(i);
      let k = String(key);
      if (k.startsWith("[object "))
        k = null;
      each_key_duplicate(a, b, k);
    }
    keys.set(key, i);
  }
}
// node_modules/svelte/src/internal/client/dom/blocks/slot.js
function slot(anchor, $$props, name, slot_props, fallback_fn) {
  if (hydrating) {
    hydrate_next();
  }
  var slot_fn = $$props.$$slots?.[name];
  var is_interop = false;
  if (slot_fn === true) {
    slot_fn = $$props[name === "default" ? "children" : name];
    is_interop = true;
  }
  if (slot_fn === undefined) {
    if (fallback_fn !== null) {
      fallback_fn(anchor);
    }
  } else {
    slot_fn(anchor, is_interop ? () => slot_props : slot_props);
  }
}
// node_modules/svelte/src/internal/client/timing.js
var now = true_default ? () => performance.now() : () => Date.now();
var raf = {
  tick: (_) => (true_default ? requestAnimationFrame : noop)(_),
  now: () => now(),
  tasks: new Set
};

// node_modules/svelte/src/internal/client/dom/elements/transitions.js
var animation_effect_override = null;
function set_animation_effect_override(v) {
  animation_effect_override = v;
}

// node_modules/svelte/src/internal/client/dom/blocks/svelte-element.js
function element(node, get_tag, is_svg, render_fn, get_namespace, location) {
  let was_hydrating = hydrating;
  if (hydrating) {
    hydrate_next();
  }
  var filename = true_default && location && component_context?.function[FILENAME];
  var element2 = null;
  if (hydrating && hydrate_node.nodeType === ELEMENT_NODE) {
    element2 = hydrate_node;
    hydrate_next();
  }
  var anchor = hydrating ? hydrate_node : node;
  var parent_effect = active_effect;
  var branches = new BranchManager(anchor, false);
  block(() => {
    const next_tag = get_tag() || null;
    var ns = get_namespace ? get_namespace() : is_svg || next_tag === "svg" ? NAMESPACE_SVG : undefined;
    if (next_tag === null) {
      branches.ensure(null, null);
      set_should_intro(true);
      return;
    }
    branches.ensure(next_tag, (anchor2) => {
      if (next_tag) {
        element2 = hydrating ? element2 : create_element(next_tag, ns);
        if (true_default && location) {
          element2.__svelte_meta = {
            parent: dev_stack,
            loc: {
              file: filename,
              line: location[0],
              column: location[1]
            }
          };
        }
        assign_nodes(element2, element2);
        if (render_fn) {
          var tmp_comment = null;
          if (hydrating && is_raw_text_element(next_tag)) {
            element2.append(tmp_comment = document.createComment(""));
          }
          var child_anchor = hydrating ? get_first_child(element2) : element2.appendChild(create_text());
          if (hydrating) {
            if (child_anchor === null) {
              set_hydrating(false);
            } else {
              set_hydrate_node(child_anchor);
            }
          }
          set_animation_effect_override(parent_effect);
          render_fn(element2, child_anchor);
          tmp_comment?.remove();
          set_animation_effect_override(null);
        }
        active_effect.nodes.end = element2;
        anchor2.before(element2);
      }
      if (hydrating) {
        set_hydrate_node(anchor2);
      }
    });
    set_should_intro(true);
    return () => {
      if (next_tag) {
        set_should_intro(false);
      }
    };
  }, EFFECT_TRANSPARENT);
  teardown(() => {
    set_should_intro(true);
  });
  if (was_hydrating) {
    set_hydrating(true);
    set_hydrate_node(anchor);
  }
}
// node_modules/svelte/src/internal/client/dom/elements/attachments.js
function attach(node, get_fn) {
  var fn = undefined;
  var e;
  managed(() => {
    if (fn !== (fn = get_fn())) {
      if (e) {
        destroy_effect(e);
        e = null;
      }
      if (fn) {
        e = branch(() => {
          effect(() => fn(node));
        });
      }
    }
  });
}
// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if (typeof e == "string" || typeof e == "number")
    n += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0;t < o; t++)
        e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else
      for (f in e)
        e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length;f < o; f++)
    (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/svelte/src/internal/shared/attributes.js
var replacements = {
  translate: new Map([
    [true, "yes"],
    [false, "no"]
  ])
};
function clsx2(value) {
  if (typeof value === "object") {
    return clsx(value);
  } else {
    return value ?? "";
  }
}
var whitespace = [...` 	
\r\f \v\uFEFF`];
function to_class(value, hash2, directives) {
  var classname = value == null ? "" : "" + value;
  if (hash2) {
    classname = classname ? classname + " " + hash2 : hash2;
  }
  if (directives) {
    for (var key of Object.keys(directives)) {
      if (directives[key]) {
        classname = classname ? classname + " " + key : key;
      } else if (classname.length) {
        var len = key.length;
        var a = 0;
        while ((a = classname.indexOf(key, a)) >= 0) {
          var b = a + len;
          if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) {
            classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
          } else {
            a = b;
          }
        }
      }
    }
  }
  return classname === "" ? null : classname;
}
function append_styles(styles, important = false) {
  var separator = important ? " !important;" : ";";
  var css = "";
  for (var key of Object.keys(styles)) {
    var value = styles[key];
    if (value != null && value !== "") {
      css += " " + key + ": " + value + separator;
    }
  }
  return css;
}
function to_css_name(name) {
  if (name[0] !== "-" || name[1] !== "-") {
    return name.toLowerCase();
  }
  return name;
}
function to_style(value, styles) {
  if (styles) {
    var new_style = "";
    var normal_styles;
    var important_styles;
    if (Array.isArray(styles)) {
      normal_styles = styles[0];
      important_styles = styles[1];
    } else {
      normal_styles = styles;
    }
    if (value) {
      value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
      var in_str = false;
      var in_apo = 0;
      var in_comment = false;
      var reserved_names = [];
      if (normal_styles) {
        reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
      }
      if (important_styles) {
        reserved_names.push(...Object.keys(important_styles).map(to_css_name));
      }
      var start_index = 0;
      var name_index = -1;
      const len = value.length;
      for (var i = 0;i < len; i++) {
        var c = value[i];
        if (in_comment) {
          if (c === "/" && value[i - 1] === "*") {
            in_comment = false;
          }
        } else if (in_str) {
          if (in_str === c) {
            in_str = false;
          }
        } else if (c === "/" && value[i + 1] === "*") {
          in_comment = true;
        } else if (c === '"' || c === "'") {
          in_str = c;
        } else if (c === "(") {
          in_apo++;
        } else if (c === ")") {
          in_apo--;
        }
        if (!in_comment && in_str === false && in_apo === 0) {
          if (c === ":" && name_index === -1) {
            name_index = i;
          } else if (c === ";" || i === len - 1) {
            if (name_index !== -1) {
              var name = to_css_name(value.substring(start_index, name_index).trim());
              if (!reserved_names.includes(name)) {
                if (c !== ";") {
                  i++;
                }
                var property = value.substring(start_index, i).trim();
                new_style += " " + property + ";";
              }
            }
            start_index = i + 1;
            name_index = -1;
          }
        }
      }
    }
    if (normal_styles) {
      new_style += append_styles(normal_styles);
    }
    if (important_styles) {
      new_style += append_styles(important_styles, true);
    }
    new_style = new_style.trim();
    return new_style === "" ? null : new_style;
  }
  return value == null ? null : String(value);
}

// node_modules/svelte/src/internal/client/dom/elements/class.js
function set_class(dom, is_html, value, hash2, prev_classes, next_classes) {
  var prev = dom[CLASS_CACHE];
  if (hydrating || prev !== value || prev === undefined) {
    var next_class_name = to_class(value, hash2, next_classes);
    if (!hydrating || next_class_name !== dom.getAttribute("class")) {
      if (next_class_name == null) {
        dom.removeAttribute("class");
      } else if (is_html) {
        dom.className = next_class_name;
      } else {
        dom.setAttribute("class", next_class_name);
      }
    }
    dom[CLASS_CACHE] = value;
  } else if (next_classes && prev_classes !== next_classes) {
    for (var key in next_classes) {
      var is_present = !!next_classes[key];
      if (prev_classes == null || is_present !== !!prev_classes[key]) {
        dom.classList.toggle(key, is_present);
      }
    }
  }
  return next_classes;
}

// node_modules/svelte/src/internal/client/dom/elements/style.js
function update_styles(dom, prev = {}, next2, priority) {
  for (var key in next2) {
    var value = next2[key];
    if (prev[key] !== value) {
      if (next2[key] == null) {
        dom.style.removeProperty(key);
      } else {
        dom.style.setProperty(key, value, priority);
      }
    }
  }
}
function set_style(dom, value, prev_styles, next_styles) {
  var prev = dom[STYLE_CACHE];
  if (hydrating || prev !== value) {
    var next_style_attr = to_style(value, next_styles);
    if (!hydrating || next_style_attr !== dom.getAttribute("style")) {
      if (next_style_attr == null) {
        dom.removeAttribute("style");
      } else {
        dom.style.cssText = next_style_attr;
      }
    }
    dom[STYLE_CACHE] = value;
  } else if (next_styles) {
    if (Array.isArray(next_styles)) {
      update_styles(dom, prev_styles?.[0], next_styles[0]);
      update_styles(dom, prev_styles?.[1], next_styles[1], "important");
    } else {
      update_styles(dom, prev_styles, next_styles);
    }
  }
  return next_styles;
}

// node_modules/svelte/src/internal/client/dom/elements/bindings/select.js
function select_option(select, value, mounting = false) {
  if (select.multiple) {
    if (value == undefined) {
      return;
    }
    if (!is_array(value)) {
      return select_multiple_invalid_value();
    }
    for (var option of select.options) {
      option.selected = value.includes(get_option_value(option));
    }
    return;
  }
  for (option of select.options) {
    var option_value = get_option_value(option);
    if (is(option_value, value)) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== undefined) {
    select.selectedIndex = -1;
  }
}
function init_select(select) {
  var observer = new MutationObserver(() => {
    select_option(select, select.__value);
  });
  observer.observe(select, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["value"]
  });
  teardown(() => {
    observer.disconnect();
  });
}
function bind_select_value(select, get3, set2 = get3) {
  var batches = new WeakSet;
  var mounting = true;
  listen_to_event_and_reset_event(select, "change", (is_reset) => {
    var query = is_reset ? "[selected]" : ":checked";
    var value;
    if (select.multiple) {
      value = [].map.call(select.querySelectorAll(query), get_option_value);
    } else {
      var selected_option = select.querySelector(query) ?? select.querySelector("option:not([disabled])");
      value = selected_option && get_option_value(selected_option);
    }
    set2(value);
    select.__value = value;
    if (current_batch !== null) {
      batches.add(current_batch);
    }
  });
  effect(() => {
    var value = get3();
    if (select === document.activeElement) {
      var batch = async_mode_flag ? previous_batch : current_batch;
      if (batches.has(batch)) {
        return;
      }
    }
    select_option(select, value, mounting);
    if (mounting && value === undefined) {
      var selected_option = select.querySelector(":checked");
      if (selected_option !== null) {
        value = get_option_value(selected_option);
        set2(value);
      }
    }
    select.__value = value;
    mounting = false;
  });
  init_select(select);
}
function get_option_value(option) {
  if ("__value" in option) {
    return option.__value;
  } else {
    return option.value;
  }
}

// node_modules/svelte/src/internal/client/dom/elements/attributes.js
var CLASS = Symbol("class");
var STYLE = Symbol("style");
var IS_CUSTOM_ELEMENT = Symbol("is custom element");
var IS_HTML = Symbol("is html");
var LINK_TAG = IS_XHTML ? "link" : "LINK";
var INPUT_TAG = IS_XHTML ? "input" : "INPUT";
var OPTION_TAG = IS_XHTML ? "option" : "OPTION";
var SELECT_TAG = IS_XHTML ? "select" : "SELECT";
function remove_input_defaults(input) {
  if (!hydrating)
    return;
  var already_removed = false;
  var remove_defaults = () => {
    if (already_removed)
      return;
    already_removed = true;
    if (input.hasAttribute("value")) {
      var value = input.value;
      set_attribute2(input, "value", null);
      input.value = value;
    }
    if (input.hasAttribute("checked")) {
      var checked = input.checked;
      set_attribute2(input, "checked", null);
      input.checked = checked;
    }
  };
  input[FORM_RESET_HANDLER] = remove_defaults;
  queue_micro_task(remove_defaults);
  add_form_reset_listener();
}
function set_selected(element2, selected) {
  if (selected) {
    if (!element2.hasAttribute("selected")) {
      element2.setAttribute("selected", "");
    }
  } else {
    element2.removeAttribute("selected");
  }
}
function set_attribute2(element2, attribute, value, skip_warning) {
  var attributes = get_attributes(element2);
  if (hydrating) {
    attributes[attribute] = element2.getAttribute(attribute);
    if (attribute === "src" || attribute === "srcset" || attribute === "href" && element2.nodeName === LINK_TAG) {
      if (!skip_warning) {
        check_src_in_dev_hydration(element2, attribute, value ?? "");
      }
      return;
    }
  }
  if (attributes[attribute] === (attributes[attribute] = value))
    return;
  if (attribute === "loading") {
    element2[LOADING_ATTR_SYMBOL] = value;
  }
  if (value == null) {
    element2.removeAttribute(attribute);
  } else if (typeof value !== "string" && get_setters(element2).includes(attribute)) {
    element2[attribute] = value;
  } else {
    element2.setAttribute(attribute, value);
  }
}
function set_attributes(element2, prev, next2, css_hash, should_remove_defaults = false, skip_warning = false) {
  if (hydrating && should_remove_defaults && element2.nodeName === INPUT_TAG) {
    var input = element2;
    var attribute = input.type === "checkbox" ? "defaultChecked" : "defaultValue";
    if (!(attribute in next2)) {
      remove_input_defaults(input);
    }
  }
  var attributes = get_attributes(element2);
  var is_custom_element = attributes[IS_CUSTOM_ELEMENT];
  var preserve_attribute_case = !attributes[IS_HTML];
  let is_hydrating_custom_element = hydrating && is_custom_element;
  if (is_hydrating_custom_element) {
    set_hydrating(false);
  }
  var current = prev || {};
  var is_option_element = element2.nodeName === OPTION_TAG;
  for (var key in prev) {
    if (!(key in next2)) {
      next2[key] = null;
    }
  }
  if (next2.class) {
    next2.class = clsx2(next2.class);
  } else if (css_hash || next2[CLASS]) {
    next2.class = null;
  }
  if (next2[STYLE]) {
    next2.style ??= null;
  }
  var setters = get_setters(element2);
  if (element2.nodeName === INPUT_TAG && "type" in next2 && (("value" in next2) || ("__value" in next2))) {
    var type = next2.type;
    if (type !== current.type || type === undefined && element2.hasAttribute("type")) {
      current.type = type;
      set_attribute2(element2, "type", type, skip_warning);
    }
  }
  for (const key2 in next2) {
    let value = next2[key2];
    if (is_option_element && key2 === "value" && value == null) {
      element2.value = element2.__value = "";
      current[key2] = value;
      continue;
    }
    if (key2 === "class") {
      var is_html = element2.namespaceURI === "http://www.w3.org/1999/xhtml";
      set_class(element2, is_html, value, css_hash, prev?.[CLASS], next2[CLASS]);
      current[key2] = value;
      current[CLASS] = next2[CLASS];
      continue;
    }
    if (key2 === "style") {
      set_style(element2, value, prev?.[STYLE], next2[STYLE]);
      current[key2] = value;
      current[STYLE] = next2[STYLE];
      continue;
    }
    var prev_value = current[key2];
    if (value === prev_value && !(value === undefined && element2.hasAttribute(key2))) {
      continue;
    }
    current[key2] = value;
    var prefix = key2[0] + key2[1];
    if (prefix === "$$")
      continue;
    if (prefix === "on") {
      const opts = {};
      const event_handle_key = "$$" + key2;
      let event_name = key2.slice(2);
      var is_delegated = can_delegate_event(event_name);
      if (is_capture_event(event_name)) {
        event_name = event_name.slice(0, -7);
        opts.capture = true;
      }
      if (!is_delegated && prev_value) {
        if (value != null)
          continue;
        element2.removeEventListener(event_name, current[event_handle_key], opts);
        current[event_handle_key] = null;
      }
      if (is_delegated) {
        delegated(event_name, element2, value);
        delegate([event_name]);
      } else if (value != null) {
        let handle = function(evt) {
          current[key2].call(this, evt);
        };
        current[event_handle_key] = create_event(event_name, element2, handle, opts);
      }
    } else if (key2 === "style") {
      set_attribute2(element2, key2, value);
    } else if (key2 === "autofocus") {
      autofocus(element2, Boolean(value));
    } else if (!is_custom_element && (key2 === "__value" || key2 === "value" && value != null)) {
      element2.value = element2.__value = value;
    } else if (key2 === "selected" && is_option_element) {
      set_selected(element2, value);
    } else {
      var name = key2;
      if (!preserve_attribute_case) {
        name = normalize_attribute(name);
      }
      var is_default = name === "defaultValue" || name === "defaultChecked";
      if (value == null && !is_custom_element && !is_default) {
        attributes[key2] = null;
        if (name === "value" || name === "checked") {
          let input2 = element2;
          const use_default = prev === undefined;
          if (name === "value") {
            let previous = input2.defaultValue;
            input2.removeAttribute(name);
            input2.defaultValue = previous;
            input2.value = input2.__value = use_default ? previous : null;
          } else {
            let previous = input2.defaultChecked;
            input2.removeAttribute(name);
            input2.defaultChecked = previous;
            input2.checked = use_default ? previous : false;
          }
        } else {
          element2.removeAttribute(key2);
        }
      } else if (is_default || setters.includes(name) && (is_custom_element || typeof value !== "string")) {
        element2[name] = value;
        if (name in attributes)
          attributes[name] = UNINITIALIZED;
      } else if (typeof value !== "function") {
        set_attribute2(element2, name, value, skip_warning);
      }
    }
  }
  if (is_hydrating_custom_element) {
    set_hydrating(true);
  }
  return current;
}
function attribute_effect(element2, fn, sync = [], async = [], blockers = [], css_hash, should_remove_defaults = false, skip_warning = false) {
  flatten(blockers, sync, async, (values) => {
    var prev = undefined;
    var effects = {};
    var is_select = element2.nodeName === SELECT_TAG;
    var inited = false;
    managed(() => {
      var next2 = fn(...values.map(get2));
      var current = set_attributes(element2, prev, next2, css_hash, should_remove_defaults, skip_warning);
      if (inited && is_select && "value" in next2) {
        select_option(element2, next2.value);
      }
      for (let symbol of Object.getOwnPropertySymbols(effects)) {
        if (!next2[symbol])
          destroy_effect(effects[symbol]);
      }
      for (let symbol of Object.getOwnPropertySymbols(next2)) {
        var n = next2[symbol];
        if (symbol.description === ATTACHMENT_KEY && (!prev || n !== prev[symbol])) {
          if (effects[symbol])
            destroy_effect(effects[symbol]);
          effects[symbol] = branch(() => attach(element2, () => n));
        }
        current[symbol] = n;
      }
      prev = current;
    });
    if (is_select) {
      var select = element2;
      effect(() => {
        select_option(select, prev.value, true);
        init_select(select);
      });
    }
    inited = true;
  });
}
function get_attributes(element2) {
  return element2[ATTRIBUTES_CACHE] ??= {
    [IS_CUSTOM_ELEMENT]: element2.nodeName.includes("-"),
    [IS_HTML]: element2.namespaceURI === NAMESPACE_HTML
  };
}
var setters_cache = new Map;
function get_setters(element2) {
  var cache_key = element2.getAttribute("is") || element2.nodeName;
  var setters = setters_cache.get(cache_key);
  if (setters)
    return setters;
  setters_cache.set(cache_key, setters = []);
  var descriptors;
  var proto = element2;
  var element_proto = Element.prototype;
  while (element_proto !== proto) {
    descriptors = get_descriptors(proto);
    for (var key in descriptors) {
      if (descriptors[key].set && key !== "innerHTML" && key !== "textContent" && key !== "innerText") {
        setters.push(key);
      }
    }
    proto = get_prototype_of(proto);
  }
  return setters;
}
function check_src_in_dev_hydration(element2, attribute, value) {
  if (!true_default)
    return;
  if (attribute === "srcset" && srcset_url_equal(element2, value))
    return;
  if (src_url_equal(element2.getAttribute(attribute) ?? "", value))
    return;
  hydration_attribute_changed(attribute, element2.outerHTML.replace(element2.innerHTML, element2.innerHTML && "..."), String(value));
}
function src_url_equal(element_src, url) {
  if (element_src === url)
    return true;
  return new URL(element_src, document.baseURI).href === new URL(url, document.baseURI).href;
}
function split_srcset(srcset) {
  return srcset.split(",").map((src) => src.trim().split(" ").filter(Boolean));
}
function srcset_url_equal(element2, srcset) {
  var element_urls = split_srcset(element2.srcset);
  var urls = split_srcset(srcset);
  return urls.length === element_urls.length && urls.every(([url, width], i) => width === element_urls[i][1] && (src_url_equal(element_urls[i][0], url) || src_url_equal(url, element_urls[i][0])));
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/input.js
function bind_value(input, get3, set2 = get3) {
  var batches = new WeakSet;
  listen_to_event_and_reset_event(input, "input", async (is_reset) => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = is_reset ? input.defaultValue : input.value;
    value = is_numberlike_input(input) ? to_number(value) : value;
    set2(value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
    await tick();
    if (value !== (value = get3())) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var length = input.value.length;
      input.value = value ?? "";
      if (end !== null) {
        var new_length = input.value.length;
        if (start === end && end === length && new_length > length) {
          input.selectionStart = new_length;
          input.selectionEnd = new_length;
        } else {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, new_length);
        }
      }
    }
  });
  if (hydrating && input.defaultValue !== input.value || untrack(get3) == null && input.value) {
    set2(is_numberlike_input(input) ? to_number(input.value) : input.value);
    if (current_batch !== null) {
      batches.add(current_batch);
    }
  }
  render_effect(() => {
    if (true_default && input.type === "checkbox") {
      bind_invalid_checkbox_value();
    }
    var value = get3();
    if (input === document.activeElement) {
      var batch = async_mode_flag ? previous_batch : current_batch;
      if (batches.has(batch)) {
        return;
      }
    }
    if (is_numberlike_input(input) && value === to_number(input.value)) {
      return;
    }
    if (input.type === "date" && !value && !input.value) {
      return;
    }
    if (value !== input.value) {
      input.value = value ?? "";
    }
  });
}
var pending = new Set;
function is_numberlike_input(input) {
  var type = input.type;
  return type === "number" || type === "range";
}
function to_number(value) {
  return value === "" ? null : +value;
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/size.js
class ResizeObserverSingleton {
  #listeners = new WeakMap;
  #observer;
  #options;
  static entries = new WeakMap;
  constructor(options) {
    this.#options = options;
  }
  observe(element2, listener) {
    var listeners2 = this.#listeners.get(element2) || new Set;
    listeners2.add(listener);
    this.#listeners.set(element2, listeners2);
    this.#getObserver().observe(element2, this.#options);
    return () => {
      var listeners3 = this.#listeners.get(element2);
      listeners3.delete(listener);
      if (listeners3.size === 0) {
        this.#listeners.delete(element2);
        this.#observer.unobserve(element2);
      }
    };
  }
  #getObserver() {
    return this.#observer ?? (this.#observer = new ResizeObserver((entries) => {
      for (var entry of entries) {
        ResizeObserverSingleton.entries.set(entry.target, entry);
        for (var listener of this.#listeners.get(entry.target) || []) {
          listener(entry);
        }
      }
    }));
  }
}
// node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function is_bound_this(bound_value, element_or_component) {
  return bound_value === element_or_component || bound_value?.[STATE_SYMBOL] === element_or_component;
}
function bind_this(element_or_component = {}, update2, get_value, get_parts) {
  var component_effect = component_context.r;
  var parent = active_effect;
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = get_parts?.() || [];
      untrack(() => {
        if (!is_bound_this(get_value(...parts), element_or_component)) {
          update2(element_or_component, ...parts);
          if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
            update2(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      let p = parent;
      while (p !== component_effect && p.parent !== null && p.parent.f & DESTROYING) {
        p = p.parent;
      }
      const teardown2 = () => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update2(null, ...parts);
        }
      };
      const original_teardown = p.teardown;
      p.teardown = () => {
        teardown2();
        original_teardown?.();
      };
    };
  });
  return element_or_component;
}
// node_modules/svelte/src/internal/client/dom/legacy/lifecycle.js
function init(immutable = false) {
  const context = component_context;
  const callbacks = context.l.u;
  if (!callbacks)
    return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = {};
    const d = derived(() => {
      let changed = false;
      const props2 = context.s;
      for (const key in props2) {
        if (props2[key] !== prev[key]) {
          prev[key] = props2[key];
          changed = true;
        }
      }
      if (changed)
        version++;
      return version;
    });
    props = () => get2(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s)
      get2(signal);
  }
  props();
}
// node_modules/svelte/src/internal/client/reactivity/props.js
var legacy_rest_props_handler = {
  get(target, key) {
    if (target.exclude.includes(key))
      return;
    get2(target.version);
    return key in target.special ? target.special[key]() : target.props[key];
  },
  set(target, key, value) {
    if (!(key in target.special)) {
      var previous_effect = active_effect;
      try {
        set_active_effect(target.parent_effect);
        target.special[key] = prop({
          get [key]() {
            return target.props[key];
          }
        }, key, PROPS_IS_UPDATED);
      } finally {
        set_active_effect(previous_effect);
      }
    }
    target.special[key](value);
    update(target.version);
    return true;
  },
  getOwnPropertyDescriptor(target, key) {
    if (target.exclude.includes(key))
      return;
    if (key in target.props) {
      return {
        enumerable: true,
        configurable: true,
        value: target.props[key]
      };
    }
  },
  deleteProperty(target, key) {
    if (target.exclude.includes(key))
      return true;
    target.exclude.push(key);
    update(target.version);
    return true;
  },
  has(target, key) {
    if (target.exclude.includes(key))
      return false;
    return key in target.props;
  },
  ownKeys(target) {
    return Reflect.ownKeys(target.props).filter((key) => !target.exclude.includes(key));
  }
};
function legacy_rest_props(props, exclude) {
  return new Proxy({
    props,
    exclude,
    special: {},
    version: source(0),
    parent_effect: active_effect
  }, legacy_rest_props_handler);
}
var spread_props_handler = {
  get(target, key) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      if (typeof p === "object" && p !== null && key in p)
        return p[key];
    }
  },
  set(target, key, value) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      const desc = get_descriptor(p, key);
      if (desc && desc.set) {
        desc.set(value);
        return true;
      }
    }
    return false;
  },
  getOwnPropertyDescriptor(target, key) {
    let i = target.props.length;
    while (i--) {
      let p = target.props[i];
      if (is_function(p))
        p = p();
      if (typeof p === "object" && p !== null && key in p) {
        const descriptor = get_descriptor(p, key);
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      }
    }
  },
  has(target, key) {
    if (key === STATE_SYMBOL || key === LEGACY_PROPS)
      return false;
    for (let p of target.props) {
      if (is_function(p))
        p = p();
      if (p != null && key in p)
        return true;
    }
    return false;
  },
  ownKeys(target) {
    const keys = [];
    for (let p of target.props) {
      if (is_function(p))
        p = p();
      if (!p)
        continue;
      for (const key in p) {
        if (!keys.includes(key))
          keys.push(key);
      }
      for (const key of Object.getOwnPropertySymbols(p)) {
        if (!keys.includes(key))
          keys.push(key);
      }
    }
    return keys;
  }
};
function spread_props(...props) {
  return new Proxy({ props }, spread_props_handler);
}
function prop(props, key, flags2, fallback) {
  var runes = !legacy_mode_flag || (flags2 & PROPS_IS_RUNES) !== 0;
  var bindable = (flags2 & PROPS_IS_BINDABLE) !== 0;
  var lazy = (flags2 & PROPS_IS_LAZY_INITIAL) !== 0;
  var fallback_value = fallback;
  var fallback_dirty = true;
  var fallback_signal = undefined;
  var get_fallback = () => {
    if (lazy && runes) {
      fallback_signal ??= derived(fallback);
      return get2(fallback_signal);
    }
    if (fallback_dirty) {
      fallback_dirty = false;
      fallback_value = lazy ? untrack(fallback) : fallback;
    }
    return fallback_value;
  };
  let setter;
  if (bindable) {
    var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
    setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : undefined);
  }
  var initial_value;
  var is_store_sub = false;
  if (bindable) {
    [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
  } else {
    initial_value = props[key];
  }
  if (initial_value === undefined && fallback !== undefined) {
    initial_value = get_fallback();
    if (setter) {
      if (runes)
        props_invalid_value(key);
      setter(initial_value);
    }
  }
  var getter;
  if (runes) {
    getter = () => {
      var value = props[key];
      if (value === undefined)
        return get_fallback();
      fallback_dirty = true;
      return value;
    };
  } else {
    getter = () => {
      var value = props[key];
      if (value !== undefined) {
        fallback_value = undefined;
      }
      return value === undefined ? fallback_value : value;
    };
  }
  if (runes && (flags2 & PROPS_IS_UPDATED) === 0) {
    return getter;
  }
  if (setter) {
    var legacy_parent = props.$$legacy;
    return function(value, mutation) {
      if (arguments.length > 0) {
        if (!runes || !mutation || legacy_parent || is_store_sub) {
          setter(mutation ? getter() : value);
        }
        return value;
      }
      return getter();
    };
  }
  var overridden = false;
  var d = ((flags2 & PROPS_IS_IMMUTABLE) !== 0 ? derived : derived_safe_equal)(() => {
    overridden = false;
    return getter();
  });
  if (true_default) {
    d.label = key;
  }
  if (bindable)
    get2(d);
  var parent_effect = active_effect;
  return function(value, mutation) {
    if (arguments.length > 0) {
      const new_value = mutation ? get2(d) : runes && bindable ? proxy(value) : value;
      set(d, new_value);
      overridden = true;
      if (fallback_value !== undefined) {
        fallback_value = new_value;
      }
      return value;
    }
    if (is_destroying_effect && overridden || (parent_effect.f & DESTROYED) !== 0) {
      return d.v;
    }
    return get2(d);
  };
}
// node_modules/svelte/src/legacy/legacy-client.js
function createClassComponent(options) {
  return new Svelte4Component(options);
}
class Svelte4Component {
  #events;
  #instance;
  constructor(options) {
    var sources = new Map;
    var add_source = (key, value) => {
      var s = mutable_source(value, false, false);
      sources.set(key, s);
      return s;
    };
    const props = new Proxy({ ...options.props || {}, $$events: {} }, {
      get(target, prop2) {
        return get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
      },
      has(target, prop2) {
        if (prop2 === LEGACY_PROPS)
          return true;
        get2(sources.get(prop2) ?? add_source(prop2, Reflect.get(target, prop2)));
        return Reflect.has(target, prop2);
      },
      set(target, prop2, value) {
        set(sources.get(prop2) ?? add_source(prop2, value), value);
        return Reflect.set(target, prop2, value);
      }
    });
    this.#instance = (options.hydrate ? hydrate : mount)(options.component, {
      target: options.target,
      anchor: options.anchor,
      props,
      context: options.context,
      intro: options.intro ?? false,
      recover: options.recover,
      transformError: options.transformError
    });
    if (!async_mode_flag && (!options?.props?.$$host || options.sync === false)) {
      flushSync();
    }
    this.#events = props.$$events;
    for (const key of Object.keys(this.#instance)) {
      if (key === "$set" || key === "$destroy" || key === "$on")
        continue;
      define_property(this, key, {
        get() {
          return this.#instance[key];
        },
        set(value) {
          this.#instance[key] = value;
        },
        enumerable: true
      });
    }
    this.#instance.$set = (next2) => {
      Object.assign(props, next2);
    };
    this.#instance.$destroy = () => {
      unmount(this.#instance);
    };
  }
  $set(props) {
    this.#instance.$set(props);
  }
  $on(event2, callback) {
    this.#events[event2] = this.#events[event2] || [];
    const cb = (...args) => callback.call(this, ...args);
    this.#events[event2].push(cb);
    return () => {
      this.#events[event2] = this.#events[event2].filter((fn) => fn !== cb);
    };
  }
  $destroy() {
    this.#instance.$destroy();
  }
}

// node_modules/svelte/src/internal/client/dom/elements/custom-element.js
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    $$ctor;
    $$s;
    $$c;
    $$cn = false;
    $$d = {};
    $$r = false;
    $$p_d = {};
    $$l = {};
    $$l_u = new Map;
    $$me;
    $$shadowRoot = null;
    constructor($$componentCtor, $$slots, shadow_root_init) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (shadow_root_init) {
        this.$$shadowRoot = this.attachShadow(shadow_root_init);
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return (anchor) => {
            const slot2 = create_element("slot");
            if (name !== "default")
              slot2.name = name;
            append(anchor, slot2);
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            if (name === "default" && !this.$$d.children) {
              this.$$d.children = create_slot(name);
              $$slots.default = true;
            } else {
              $$slots[name] = create_slot(name);
            }
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== undefined) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = createClassComponent({
          component: this.$$ctor,
          target: this.$$shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$host: this
          }
        });
        this.$$me = effect_root(() => {
          render_effect(() => {
            this.$$r = true;
            for (const key of object_keys(this.$$c)) {
              if (!this.$$p_d[key]?.reflect)
                continue;
              this.$$d[key] = this.$$c[key];
              const attribute_value = get_custom_element_value(key, this.$$d[key], this.$$p_d, "toAttribute");
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
            this.$$r = false;
          });
        });
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      if (this.$$r)
        return;
      attr = this.$$g_p(attr);
      this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr]: this.$$d[attr] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$me();
          this.$$c = undefined;
        }
      });
    }
    $$g_p(attribute_name) {
      return object_keys(this.$$p_d).find((key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name) || attribute_name;
    }
  };
}
function get_custom_element_value(prop2, value, props_definition, transform) {
  const type = props_definition[prop2]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop2]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach((node) => {
    result[node.slot || "default"] = true;
  });
  return result;
}
// node_modules/svelte/src/index-client.js
if (true_default) {
  let throw_rune_error = function(rune) {
    if (!(rune in globalThis)) {
      let value;
      Object.defineProperty(globalThis, rune, {
        configurable: true,
        get: () => {
          if (value !== undefined) {
            return value;
          }
          rune_outside_svelte(rune);
        },
        set: (v) => {
          value = v;
        }
      });
    }
  };
  throw_rune_error("$state");
  throw_rune_error("$effect");
  throw_rune_error("$derived");
  throw_rune_error("$inspect");
  throw_rune_error("$props");
  throw_rune_error("$bindable");
}
function onMount(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onMount");
  }
  if (legacy_mode_flag && component_context.l !== null) {
    init_update_callbacks(component_context).m.push(fn);
  } else {
    user_effect(() => {
      const cleanup = untrack(fn);
      if (typeof cleanup === "function")
        return cleanup;
    });
  }
}
function onDestroy(fn) {
  if (component_context === null) {
    lifecycle_outside_component("onDestroy");
  }
  onMount(() => () => untrack(fn));
}
function init_update_callbacks(context) {
  var l = context.l;
  return l.u ??= { a: [], b: [], m: [] };
}

// node_modules/svelte/src/version.js
var PUBLIC_VERSION = "5";

// node_modules/svelte/src/internal/disclose-version.js
if (typeof window !== "undefined") {
  ((window.__svelte ??= {}).v ??= new Set).add(PUBLIC_VERSION);
}

// node_modules/svelte/src/internal/flags/legacy.js
enable_legacy_mode_flag();

// node_modules/lucide-svelte/dist/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
var defaultAttributes_default = defaultAttributes;

// node_modules/lucide-svelte/dist/utils/hasA11yProp.js
var hasA11yProp = (props) => {
  for (const prop2 in props) {
    if (prop2.startsWith("aria-") || prop2 === "role" || prop2 === "title") {
      return true;
    }
  }
  return false;
};

// node_modules/lucide-svelte/dist/utils/mergeClasses.js
var mergeClasses = (...classes) => classes.filter((className, index2, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index2;
}).join(" ").trim();

// node_modules/lucide-svelte/dist/Icon.svelte
var root = from_svg(`
    <!>
  `, 1);
var root_1 = from_svg(`

<svg>
  <!>
  <!>
</svg>`, 1);
function Icon($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const $$restProps = legacy_rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  push($$props, false);
  let name = prop($$props, "name", 8, undefined);
  let color = prop($$props, "color", 8, "currentColor");
  let size = prop($$props, "size", 8, 24);
  let strokeWidth = prop($$props, "strokeWidth", 8, 2);
  let absoluteStrokeWidth = prop($$props, "absoluteStrokeWidth", 8, false);
  let iconNode = prop($$props, "iconNode", 24, () => []);
  init();
  next();
  var fragment = root_1();
  var svg = sibling(first_child(fragment));
  attribute_effect(svg, ($0, $1, $2) => ({
    ...defaultAttributes_default,
    ...$0,
    ...$$restProps,
    width: size(),
    height: size(),
    stroke: color(),
    "stroke-width": $1,
    class: $2
  }), [
    () => !hasA11yProp($$restProps) ? { "aria-hidden": "true" } : undefined,
    () => (deep_read_state(absoluteStrokeWidth()), deep_read_state(strokeWidth()), deep_read_state(size()), untrack(() => absoluteStrokeWidth() ? Number(strokeWidth()) * 24 / Number(size()) : strokeWidth())),
    () => (deep_read_state(mergeClasses), deep_read_state(name()), deep_read_state($$sanitized_props), untrack(() => mergeClasses("lucide-icon", "lucide", name() ? `lucide-${name()}` : "", $$sanitized_props.class)))
  ]);
  var node = sibling(child(svg));
  each(node, 1, iconNode, index, ($$anchor2, $$item) => {
    var $$array = user_derived(() => to_array(get2($$item), 2));
    let tag2 = () => get2($$array)[0];
    let attrs = () => get2($$array)[1];
    next();
    var fragment_1 = root();
    var node_1 = sibling(first_child(fragment_1));
    element(node_1, tag2, true, ($$element, $$anchor3) => {
      attribute_effect($$element, () => ({ ...attrs() }));
    });
    next();
    append($$anchor2, fragment_1);
  });
  var node_2 = sibling(node, 2);
  slot(node_2, $$props, "default", {}, null);
  next();
  reset(svg);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var Icon_default = Icon;

// node_modules/lucide-svelte/dist/icons/arrow-right.svelte
var root2 = from_html(`
  <!>
`, 1);
var root_12 = from_html(`

<!>`, 1);
function Arrow_right($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m12 5 7 7-7 7" }]
  ];
  next();
  var fragment = root_12();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "arrow-right" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root2();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var arrow_right_default = Arrow_right;
// node_modules/lucide-svelte/dist/icons/brain.svelte
var root3 = from_html(`
  <!>
`, 1);
var root_13 = from_html(`

<!>`, 1);
function Brain($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M12 18V5" }],
    [
      "path",
      { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" }
    ],
    [
      "path",
      { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" }
    ],
    ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77" }],
    ["path", { d: "M18 18a4 4 0 0 0 2-7.464" }],
    [
      "path",
      { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" }
    ],
    ["path", { d: "M6 18a4 4 0 0 1-2-7.464" }],
    ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77" }]
  ];
  next();
  var fragment = root_13();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "brain" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root3();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var brain_default = Brain;
// node_modules/lucide-svelte/dist/icons/check.svelte
var root4 = from_html(`
  <!>
`, 1);
var root_14 = from_html(`

<!>`, 1);
function Check($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [["path", { d: "M20 6 9 17l-5-5" }]];
  next();
  var fragment = root_14();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "check" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root4();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var check_default = Check;
// node_modules/lucide-svelte/dist/icons/circle-alert.svelte
var root5 = from_html(`
  <!>
`, 1);
var root_15 = from_html(`

<!>`, 1);
function Circle_alert($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    [
      "line",
      { x1: "12", x2: "12.01", y1: "16", y2: "16" }
    ]
  ];
  next();
  var fragment = root_15();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "circle-alert" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root5();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var circle_alert_default = Circle_alert;

// node_modules/lucide-svelte/dist/icons/database.svelte
var root6 = from_html(`
  <!>
`, 1);
var root_16 = from_html(`

<!>`, 1);
function Database($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12" }]
  ];
  next();
  var fragment = root_16();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "database" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root6();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var database_default = Database;
// node_modules/lucide-svelte/dist/icons/download.svelte
var root7 = from_html(`
  <!>
`, 1);
var root_17 = from_html(`

<!>`, 1);
function Download($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M12 15V3" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }]
  ];
  next();
  var fragment = root_17();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "download" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root7();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var download_default = Download;
// node_modules/lucide-svelte/dist/icons/eye.svelte
var root8 = from_html(`
  <!>
`, 1);
var root_18 = from_html(`

<!>`, 1);
function Eye($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ];
  next();
  var fragment = root_18();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "eye" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root8();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var eye_default = Eye;
// node_modules/lucide-svelte/dist/icons/file-spreadsheet.svelte
var root9 = from_html(`
  <!>
`, 1);
var root_19 = from_html(`

<!>`, 1);
function File_spreadsheet($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
    ["path", { d: "M8 13h2" }],
    ["path", { d: "M14 13h2" }],
    ["path", { d: "M8 17h2" }],
    ["path", { d: "M14 17h2" }]
  ];
  next();
  var fragment = root_19();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "file-spreadsheet" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root9();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var file_spreadsheet_default = File_spreadsheet;
// node_modules/lucide-svelte/dist/icons/folder.svelte
var root10 = from_html(`
  <!>
`, 1);
var root_110 = from_html(`

<!>`, 1);
function Folder($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      }
    ]
  ];
  next();
  var fragment = root_110();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "folder" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root10();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var folder_default = Folder;
// node_modules/lucide-svelte/dist/icons/info.svelte
var root11 = from_html(`
  <!>
`, 1);
var root_111 = from_html(`

<!>`, 1);
function Info($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }]
  ];
  next();
  var fragment = root_111();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "info" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root11();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var info_default = Info;
// node_modules/lucide-svelte/dist/icons/list-plus.svelte
var root12 = from_html(`
  <!>
`, 1);
var root_112 = from_html(`

<!>`, 1);
function List_plus($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "M18 9v6" }],
    ["path", { d: "M21 12h-6" }]
  ];
  next();
  var fragment = root_112();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "list-plus" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root12();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var list_plus_default = List_plus;
// node_modules/lucide-svelte/dist/icons/refresh-cw.svelte
var root13 = from_html(`
  <!>
`, 1);
var root_113 = from_html(`

<!>`, 1);
function Refresh_cw($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
    ],
    ["path", { d: "M21 3v5h-5" }],
    [
      "path",
      { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
    ],
    ["path", { d: "M8 16H3v5" }]
  ];
  next();
  var fragment = root_113();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "refresh-cw" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root13();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var refresh_cw_default = Refresh_cw;
// node_modules/lucide-svelte/dist/icons/rotate-ccw.svelte
var root14 = from_html(`
  <!>
`, 1);
var root_114 = from_html(`

<!>`, 1);
function Rotate_ccw($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { d: "M3 3v5h5" }]
  ];
  next();
  var fragment = root_114();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "rotate-ccw" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root14();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var rotate_ccw_default = Rotate_ccw;
// node_modules/lucide-svelte/dist/icons/settings.svelte
var root15 = from_html(`
  <!>
`, 1);
var root_115 = from_html(`

<!>`, 1);
function Settings($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ];
  next();
  var fragment = root_115();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "settings" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root15();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var settings_default = Settings;
// node_modules/lucide-svelte/dist/icons/tag.svelte
var root16 = from_html(`
  <!>
`, 1);
var root_116 = from_html(`

<!>`, 1);
function Tag($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
      }
    ],
    [
      "circle",
      { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }
    ]
  ];
  next();
  var fragment = root_116();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "tag" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root16();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var tag_default = Tag;
// node_modules/lucide-svelte/dist/icons/trash-2.svelte
var root17 = from_html(`
  <!>
`, 1);
var root_117 = from_html(`

<!>`, 1);
function Trash_2($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
  ];
  next();
  var fragment = root_117();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "trash-2" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root17();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var trash_2_default = Trash_2;
// node_modules/lucide-svelte/dist/icons/triangle-alert.svelte
var root18 = from_html(`
  <!>
`, 1);
var root_118 = from_html(`

<!>`, 1);
function Triangle_alert($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      }
    ],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }]
  ];
  next();
  var fragment = root_118();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "triangle-alert" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root18();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var triangle_alert_default = Triangle_alert;

// node_modules/lucide-svelte/dist/icons/upload.svelte
var root19 = from_html(`
  <!>
`, 1);
var root_119 = from_html(`

<!>`, 1);
function Upload($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M12 3v12" }],
    ["path", { d: "m17 8-5-5-5 5" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
  ];
  next();
  var fragment = root_119();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "upload" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root19();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var upload_default = Upload;
// node_modules/lucide-svelte/dist/icons/users.svelte
var root20 = from_html(`
  <!>
`, 1);
var root_120 = from_html(`

<!>`, 1);
function Users($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["circle", { cx: "9", cy: "7", r: "4" }]
  ];
  next();
  var fragment = root_120();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "users" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root20();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var users_default = Users;
// node_modules/lucide-svelte/dist/icons/wifi-off.svelte
var root21 = from_html(`
  <!>
`, 1);
var root_121 = from_html(`

<!>`, 1);
function Wifi_off($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69" }],
    ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643" }],
    ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764" }],
    ["path", { d: "m2 2 20 20" }]
  ];
  next();
  var fragment = root_121();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "wifi-off" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root21();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var wifi_off_default = Wifi_off;
// node_modules/lucide-svelte/dist/icons/wifi.svelte
var root22 = from_html(`
  <!>
`, 1);
var root_122 = from_html(`

<!>`, 1);
function Wifi($$anchor, $$props) {
  const $$sanitized_props = legacy_rest_props($$props, ["children", "$$slots", "$$events", "$$legacy"]);
  const iconNode = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }]
  ];
  next();
  var fragment = root_122();
  var node = sibling(first_child(fragment));
  Icon_default(node, spread_props({ name: "wifi" }, () => $$sanitized_props, {
    get iconNode() {
      return iconNode;
    },
    children: ($$anchor2, $$slotProps) => {
      next();
      var fragment_1 = root22();
      var node_1 = sibling(first_child(fragment_1));
      slot(node_1, $$props, "default", {}, null);
      next();
      append($$anchor2, fragment_1);
    },
    $$slots: { default: true }
  }));
  append($$anchor, fragment);
}
if (undefined) {}
var wifi_default = Wifi;
// src/utils/syncManager.ts
class SyncManager {
  syncQueueKey = "brain_crm_sync_queue";
  contactsCacheKey = "brain_crm_contacts_cache";
  groupsCacheKey = "brain_crm_groups_cache";
  tagsCacheKey = "brain_crm_tags_cache";
  syncListeners = [];
  connectionListeners = [];
  isSyncing = false;
  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        this.notifyConnection(true);
        this.syncNow();
      });
      window.addEventListener("offline", () => {
        this.notifyConnection(false);
      });
    }
  }
  isOnline() {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  }
  onSyncChange(callback) {
    this.syncListeners.push(callback);
    return () => {
      this.syncListeners = this.syncListeners.filter((l) => l !== callback);
    };
  }
  onConnectionChange(callback) {
    this.connectionListeners.push(callback);
    return () => {
      this.connectionListeners = this.connectionListeners.filter((l) => l !== callback);
    };
  }
  notifySync() {
    this.syncListeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error(e);
      }
    });
  }
  notifyConnection(online) {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(online);
      } catch (e) {
        console.error(e);
      }
    });
  }
  getCachedContacts() {
    const data = localStorage.getItem(this.contactsCacheKey);
    return data ? JSON.parse(data) : [];
  }
  setCachedContacts(contacts) {
    localStorage.setItem(this.contactsCacheKey, JSON.stringify(contacts));
  }
  getCachedGroups() {
    const data = localStorage.getItem(this.groupsCacheKey);
    return data ? JSON.parse(data) : [];
  }
  setCachedGroups(groups) {
    localStorage.setItem(this.groupsCacheKey, JSON.stringify(groups));
  }
  getCachedTags() {
    const data = localStorage.getItem(this.tagsCacheKey);
    return data ? JSON.parse(data) : [];
  }
  setCachedTags(tags) {
    localStorage.setItem(this.tagsCacheKey, JSON.stringify(tags));
  }
  getSyncQueue() {
    const data = localStorage.getItem(this.syncQueueKey);
    return data ? JSON.parse(data) : [];
  }
  saveSyncQueue(queue) {
    localStorage.setItem(this.syncQueueKey, JSON.stringify(queue));
    this.notifySync();
  }
  addToQueue(action2) {
    const queue = this.getSyncQueue();
    queue.push(action2);
    this.saveSyncQueue(queue);
    if (this.isOnline()) {
      this.syncNow();
    }
  }
  async getContacts(filters) {
    let contacts = [];
    if (this.isOnline()) {
      try {
        const queryParams = new URLSearchParams;
        if (filters) {
          if (filters.search)
            queryParams.append("search", filters.search);
          if (filters.group)
            queryParams.append("group", filters.group);
          if (filters.tag)
            queryParams.append("tag", filters.tag);
        }
        const url = `/api/contacts${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
        const response = await fetch(url);
        if (response.ok) {
          contacts = await response.json();
          if (!filters || !filters.search && !filters.group && !filters.tag) {
            this.setCachedContacts(contacts);
          } else {
            fetch("/api/contacts").then((res) => {
              if (res.ok)
                return res.json();
              throw new Error("Unfiltered fetch failed");
            }).then((allContacts) => {
              this.setCachedContacts(allContacts);
            }).catch((err) => {
              console.warn("[Sync Engine] Background cache warming failed:", err);
            });
          }
          this.fetchAndCacheGroupsAndTags();
        } else {
          contacts = this.getCachedContacts();
        }
      } catch (err) {
        console.warn("Failed to fetch contacts online. Using offline cache...", err);
        contacts = this.getCachedContacts();
      }
    } else {
      contacts = this.getCachedContacts();
    }
    if (filters) {
      const { search, group, tag: tag2 } = filters;
      if (search) {
        const lowerSearch = search.toLowerCase();
        contacts = contacts.filter((c) => c.name && c.name.toLowerCase().includes(lowerSearch) || c.email && c.email.toLowerCase().includes(lowerSearch) || c.phone && c.phone.includes(lowerSearch) || c.company && c.company.toLowerCase().includes(lowerSearch) || c.tags && c.tags.toLowerCase().includes(lowerSearch) || c.group_name && c.group_name.toLowerCase().includes(lowerSearch));
      }
      if (group) {
        const lowerGroup = group.trim().toLowerCase();
        contacts = contacts.filter((c) => c.group_name && c.group_name.trim().toLowerCase() === lowerGroup);
      }
      if (tag2) {
        const lowerTag = tag2.trim().toLowerCase();
        contacts = contacts.filter((c) => c.tags && c.tags.split(",").map((t) => t.trim().toLowerCase()).includes(lowerTag));
      }
    }
    return contacts;
  }
  async fetchAndCacheGroupsAndTags() {
    try {
      const [gRes, tRes] = await Promise.all([
        fetch("/api/groups"),
        fetch("/api/tags")
      ]);
      if (gRes.ok) {
        const groups = await gRes.json();
        this.setCachedGroups(groups);
      }
      if (tRes.ok) {
        const tags = await tRes.json();
        this.setCachedTags(tags);
      }
    } catch (e) {
      console.warn("Failed to refresh groups/tags cache in background:", e);
    }
  }
  getGroups() {
    if (this.isOnline()) {
      this.fetchAndCacheGroupsAndTags();
    }
    const contacts = this.getCachedContacts();
    const groupsSet = new Set;
    contacts.forEach((c) => {
      if (c.group_name && c.group_name.trim()) {
        groupsSet.add(c.group_name.trim());
      }
    });
    const computed = Array.from(groupsSet).sort();
    const cached = this.getCachedGroups();
    return computed.length > 0 ? computed : cached;
  }
  getTags() {
    if (this.isOnline()) {
      this.fetchAndCacheGroupsAndTags();
    }
    const contacts = this.getCachedContacts();
    const tagsSet = new Set;
    contacts.forEach((c) => {
      if (c.tags) {
        c.tags.split(",").forEach((t) => {
          const trimmed = t.trim();
          if (trimmed)
            tagsSet.add(trimmed);
        });
      }
    });
    const computed = Array.from(tagsSet).sort();
    const cached = this.getCachedTags();
    return computed.length > 0 ? computed : cached;
  }
  async createContact(contact) {
    if (this.isOnline()) {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
      });
      if (response.ok) {
        const newContact = await response.json();
        const cache = this.getCachedContacts();
        cache.push(newContact);
        this.setCachedContacts(cache);
        this.fetchAndCacheGroupsAndTags();
        return newContact;
      }
      throw new Error("Server returned error on creating contact");
    } else {
      const tempId = "temp_" + Date.now();
      const newContact = {
        ...contact,
        id: tempId,
        created_at: new Date().toISOString()
      };
      const cache = this.getCachedContacts();
      cache.push(newContact);
      this.setCachedContacts(cache);
      this.addToQueue({
        action: "CREATE",
        tempId,
        data: contact,
        timestamp: Date.now()
      });
      return newContact;
    }
  }
  async updateContact(id, contact) {
    if (this.isOnline() && typeof id === "number") {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact)
      });
      if (response.ok) {
        const updated = await response.json();
        const cache = this.getCachedContacts();
        const index2 = cache.findIndex((c) => c.id === id);
        if (index2 !== -1) {
          cache[index2] = updated;
          this.setCachedContacts(cache);
        }
        this.fetchAndCacheGroupsAndTags();
        return updated;
      }
      throw new Error("Server returned error on updating contact");
    } else {
      const cache = this.getCachedContacts();
      const index2 = cache.findIndex((c) => c.id === id);
      const updatedContact = { ...contact, id };
      if (index2 !== -1) {
        cache[index2] = updatedContact;
        this.setCachedContacts(cache);
      }
      if (typeof id === "string" && id.startsWith("temp_")) {
        const queue = this.getSyncQueue();
        const createIdx = queue.findIndex((q) => q.action === "CREATE" && q.tempId === id);
        if (createIdx !== -1) {
          queue[createIdx].data = contact;
          this.saveSyncQueue(queue);
          return updatedContact;
        }
      }
      this.addToQueue({
        action: "UPDATE",
        id,
        data: contact,
        timestamp: Date.now()
      });
      return updatedContact;
    }
  }
  async deleteContact(id) {
    if (this.isOnline() && typeof id === "number") {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        const cache = this.getCachedContacts();
        const updatedCache = cache.filter((c) => c.id !== id);
        this.setCachedContacts(updatedCache);
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error("Server returned error on deleting contact");
    } else {
      const cache = this.getCachedContacts();
      const updatedCache = cache.filter((c) => c.id !== id);
      this.setCachedContacts(updatedCache);
      if (typeof id === "string" && id.startsWith("temp_")) {
        const queue = this.getSyncQueue();
        const filteredQueue = queue.filter((q) => !(q.action === "CREATE" && q.tempId === id));
        this.saveSyncQueue(filteredQueue);
        return;
      }
      this.addToQueue({
        action: "DELETE",
        id,
        data: null,
        timestamp: Date.now()
      });
    }
  }
  async bulkDelete(ids) {
    const realIds = ids.filter((id) => typeof id === "number");
    const tempIds = ids.filter((id) => typeof id === "string" && id.startsWith("temp_"));
    const cache = this.getCachedContacts();
    const updatedCache = cache.filter((c) => !ids.includes(c.id));
    this.setCachedContacts(updatedCache);
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      const filteredQueue = queue.filter((q) => !(q.action === "CREATE" && tempIds.includes(q.tempId || "")));
      this.saveSyncQueue(filteredQueue);
    }
    if (realIds.length === 0)
      return;
    if (this.isOnline()) {
      const response = await fetch("/api/contacts/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: realIds })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error("Server bulk-delete failed");
    } else {
      this.addToQueue({
        action: "BULK_DELETE",
        data: { ids: realIds },
        timestamp: Date.now()
      });
    }
  }
  async bulkUpdateGroups(ids, groupName) {
    const realIds = ids.filter((id) => typeof id === "number");
    const tempIds = ids.filter((id) => typeof id === "string" && id.startsWith("temp_"));
    const cache = this.getCachedContacts();
    cache.forEach((c) => {
      if (ids.includes(c.id)) {
        c.group_name = groupName;
      }
    });
    this.setCachedContacts(cache);
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      queue.forEach((q) => {
        if (q.action === "CREATE" && tempIds.includes(q.tempId || "")) {
          q.data.group_name = groupName;
        }
      });
      this.saveSyncQueue(queue);
    }
    if (realIds.length === 0)
      return;
    if (this.isOnline()) {
      const response = await fetch("/api/contacts/bulk-update-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: realIds, group_name: groupName })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error("Server bulk group update failed");
    } else {
      this.addToQueue({
        action: "BULK_UPDATE_GROUPS",
        data: { ids: realIds, group_name: groupName },
        timestamp: Date.now()
      });
    }
  }
  async bulkUpdateTags(ids, tags, action2) {
    const realIds = ids.filter((id) => typeof id === "number");
    const tempIds = ids.filter((id) => typeof id === "string" && id.startsWith("temp_"));
    const cache = this.getCachedContacts();
    cache.forEach((c) => {
      if (ids.includes(c.id)) {
        let currentTags = c.tags ? c.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
        if (action2 === "set") {
          currentTags = tags.map((t) => t.trim()).filter(Boolean);
        } else if (action2 === "add") {
          tags.forEach((tag2) => {
            const trimmed = tag2.trim();
            if (trimmed && !currentTags.includes(trimmed)) {
              currentTags.push(trimmed);
            }
          });
        } else if (action2 === "remove") {
          const tagsToRemove = tags.map((t) => t.trim());
          currentTags = currentTags.filter((tag2) => !tagsToRemove.includes(tag2));
        }
        c.tags = currentTags.join(", ");
      }
    });
    this.setCachedContacts(cache);
    if (tempIds.length > 0) {
      const queue = this.getSyncQueue();
      queue.forEach((q) => {
        if (q.action === "CREATE" && tempIds.includes(q.tempId || "")) {
          let currentTags = q.data.tags ? q.data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
          if (action2 === "set") {
            currentTags = tags.map((t) => t.trim()).filter(Boolean);
          } else if (action2 === "add") {
            tags.forEach((tag2) => {
              if (tag2.trim() && !currentTags.includes(tag2.trim())) {
                currentTags.push(tag2.trim());
              }
            });
          } else if (action2 === "remove") {
            currentTags = currentTags.filter((tag2) => !tags.map((t) => t.trim()).includes(tag2));
          }
          q.data.tags = currentTags.join(", ");
        }
      });
      this.saveSyncQueue(queue);
    }
    if (realIds.length === 0)
      return;
    if (this.isOnline()) {
      const response = await fetch("/api/contacts/bulk-update-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: realIds, tags, action: action2 })
      });
      if (response.ok) {
        this.fetchAndCacheGroupsAndTags();
        return;
      }
      throw new Error("Server bulk tags update failed");
    } else {
      this.addToQueue({
        action: "BULK_UPDATE_TAGS",
        data: { ids: realIds, tags, action: action2 },
        timestamp: Date.now()
      });
    }
  }
  async importContacts(contacts, defaultGroup, defaultTags) {
    if (this.isOnline()) {
      const response = await fetch("/api/contacts/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts, defaultGroup, defaultTags })
      });
      if (!response.ok) {
        throw new Error("Failed to import contacts to server");
      }
      await this.getContacts();
    } else {
      const cache = this.getCachedContacts();
      const actionsToQueue = [];
      const timestamp = Date.now();
      contacts.forEach((c, idx) => {
        const tempId = `temp_import_${timestamp}_${idx}`;
        let finalGroup = c.group_name || "";
        if (!finalGroup && defaultGroup) {
          finalGroup = defaultGroup;
        }
        let importedTags = c.tags ? String(c.tags).split(",").map((t) => t.trim()).filter(Boolean) : [];
        if (defaultTags && Array.isArray(defaultTags)) {
          defaultTags.forEach((t) => {
            if (t.trim() && !importedTags.includes(t.trim())) {
              importedTags.push(t.trim());
            }
          });
        }
        const tagsStr = importedTags.join(", ");
        const contactToSave = {
          ...c,
          group_name: finalGroup,
          tags: tagsStr,
          id: tempId,
          created_at: new Date().toISOString()
        };
        cache.push(contactToSave);
        actionsToQueue.push({
          action: "CREATE",
          tempId,
          data: {
            ...c,
            group_name: finalGroup,
            tags: tagsStr
          },
          timestamp
        });
      });
      this.setCachedContacts(cache);
      const queue = this.getSyncQueue();
      queue.push(...actionsToQueue);
      this.saveSyncQueue(queue);
    }
  }
  async resetServerDatabase() {
    if (!this.isOnline()) {
      throw new Error("Must be online to reset the server database.");
    }
    localStorage.removeItem(this.contactsCacheKey);
    localStorage.removeItem(this.groupsCacheKey);
    localStorage.removeItem(this.tagsCacheKey);
    localStorage.removeItem(this.syncQueueKey);
    await fetch("/api/contacts/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from({ length: 1000 }, (_, i) => i + 1) })
    });
    this.notifySync();
  }
  async syncNow() {
    if (this.isSyncing || !this.isOnline())
      return;
    const queue = this.getSyncQueue();
    if (queue.length === 0)
      return;
    this.isSyncing = true;
    console.log(`[Sync Engine] Found ${queue.length} offline operations. Starting replay...`);
    const tempIdMap = {};
    try {
      for (const action2 of queue) {
        console.log(`[Sync Engine] Replaying action: ${action2.action}`, action2);
        if (action2.action === "CREATE") {
          const response = await fetch("/api/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action2.data)
          });
          if (response.ok) {
            const createdContact = await response.json();
            if (action2.tempId) {
              tempIdMap[action2.tempId] = createdContact.id;
            }
          } else {
            console.error("[Sync Engine] CREATE replaying failed on server:", response.statusText);
          }
        } else if (action2.action === "UPDATE") {
          let id = action2.id;
          if (typeof id === "string" && id.startsWith("temp_") && tempIdMap[id]) {
            id = tempIdMap[id];
          }
          if (typeof id === "number") {
            const response = await fetch(`/api/contacts/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(action2.data)
            });
            if (!response.ok) {
              console.error(`[Sync Engine] UPDATE failed for ID ${id}`);
            }
          } else {
            console.warn("[Sync Engine] UPDATE skipped due to invalid non-resolved temp ID:", id);
          }
        } else if (action2.action === "DELETE") {
          let id = action2.id;
          if (typeof id === "string" && id.startsWith("temp_") && tempIdMap[id]) {
            id = tempIdMap[id];
          }
          if (typeof id === "number") {
            const response = await fetch(`/api/contacts/${id}`, {
              method: "DELETE"
            });
            if (!response.ok) {
              console.error(`[Sync Engine] DELETE failed for ID ${id}`);
            }
          } else {
            console.warn("[Sync Engine] DELETE skipped due to invalid non-resolved temp ID:", id);
          }
        } else if (action2.action === "BULK_DELETE") {
          const { ids } = action2.data;
          const mappedIds = ids.map((id) => typeof id === "string" && id.startsWith("temp_") ? tempIdMap[id] : id).filter(Boolean);
          if (mappedIds.length > 0) {
            await fetch("/api/contacts/bulk-delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: mappedIds })
            });
          }
        } else if (action2.action === "BULK_UPDATE_GROUPS") {
          const { ids, group_name } = action2.data;
          const mappedIds = ids.map((id) => typeof id === "string" && id.startsWith("temp_") ? tempIdMap[id] : id).filter(Boolean);
          if (mappedIds.length > 0) {
            await fetch("/api/contacts/bulk-update-groups", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: mappedIds, group_name })
            });
          }
        } else if (action2.action === "BULK_UPDATE_TAGS") {
          const { ids, tags, action: tagAction } = action2.data;
          const mappedIds = ids.map((id) => typeof id === "string" && id.startsWith("temp_") ? tempIdMap[id] : id).filter(Boolean);
          if (mappedIds.length > 0) {
            await fetch("/api/contacts/bulk-update-tags", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids: mappedIds, tags, action: tagAction })
            });
          }
        }
      }
      localStorage.removeItem(this.syncQueueKey);
      console.log("[Sync Engine] Replay completed successfully. Fetching fresh database state...");
      await this.getContacts();
      this.notifySync();
    } catch (err) {
      console.error("[Sync Engine] Error during synchronization replay:", err);
    } finally {
      this.isSyncing = false;
    }
  }
}
var syncManager = new SyncManager;

// src/components/ContactsScreen.svelte
function ContactsScreen($$anchor, $$props) {
  push($$props, true);
  let contacts = state(proxy([]));
  let groups = state(proxy([]));
  let tags = state(proxy([]));
  let loading = state(true);
  let error = state(null);
  let searchQuery = "";
  let activeGroupFilter = state("");
  let activeTagFilter = state("");
  let currentPage = state(1);
  const recordsPerPage = 100;
  let selectedIds = state(proxy([]));
  let quickSelectGroup = state("");
  let quickSelectTag = state("");
  let isAddModalOpen = state(false);
  let viewingContact = state(null);
  let isEditing = state(false);
  let isBulkGroupModalOpen = state(false);
  let bulkGroupValue = state("");
  let isBulkTagModalOpen = state(false);
  let bulkTagValue = state("");
  let bulkTagAction = "add";
  let contactForm = state(proxy({
    name: "",
    phone: "",
    email: "",
    website: "",
    group_name: "",
    tags: "",
    address: "",
    company: "",
    job_title: "",
    notes: "",
    birthday: ""
  }));
  const fetchData = async () => {
    set(loading, true);
    set(error, null);
    try {
      const contactsData = await syncManager.getContacts({
        search: searchQuery,
        group: get2(activeGroupFilter),
        tag: get2(activeTagFilter)
      });
      const groupsData = syncManager.getGroups();
      const tagsData = syncManager.getTags();
      set(contacts, contactsData, true);
      set(groups, groupsData, true);
      set(tags, tagsData, true);
    } catch (err) {
      set(error, err.message || "An error occurred while loading contacts.", true);
    } finally {
      set(loading, false);
    }
  };
  user_effect(() => {
    set(currentPage, 1);
    fetchData();
    syncManager.onSyncChange(fetchData);
  });
  const totalPages = user_derived(() => Math.ceil(get2(contacts).length / recordsPerPage));
  const currentRecords = user_derived(() => get2(contacts).slice((get2(currentPage) - 1) * recordsPerPage, get2(currentPage) * recordsPerPage));
  const handleSelectAll = () => {
    const currentPageIds = get2(currentRecords).map((c) => c.id).filter((id) => id !== undefined);
    const allSelectedOnPage = currentPageIds.every((id) => get2(selectedIds).includes(id));
    if (allSelectedOnPage) {
      set(selectedIds, get2(selectedIds).filter((id) => !currentPageIds.includes(id)), true);
    } else {
      set(selectedIds, [
        ...get2(selectedIds).filter((id) => !currentPageIds.includes(id)),
        ...currentPageIds
      ], true);
    }
  };
  const handleSelectToggle = (id) => {
    if (get2(selectedIds).includes(id)) {
      set(selectedIds, get2(selectedIds).filter((item) => item !== id), true);
    } else {
      set(selectedIds, [...get2(selectedIds), id], true);
    }
  };
  const applyBulkSelectionByGroup = (groupName) => {
    if (!groupName)
      return;
    set(activeGroupFilter, groupName, true);
    const idsInGroup = get2(contacts).filter((c) => c.group_name && c.group_name.trim().toLowerCase() === groupName.trim().toLowerCase()).map((c) => c.id).filter((id) => id !== undefined);
    const union = new Set([...get2(selectedIds), ...idsInGroup]);
    set(selectedIds, Array.from(union), true);
    set(quickSelectGroup, "");
  };
  const applyBulkSelectionByTag = (tagName) => {
    if (!tagName)
      return;
    set(activeTagFilter, tagName, true);
    const idsWithTag = get2(contacts).filter((c) => {
      const contactTags = c.tags ? c.tags.split(",").map((t) => t.trim().toLowerCase()) : [];
      return contactTags.includes(tagName.trim().toLowerCase());
    }).map((c) => c.id).filter((id) => id !== undefined);
    const union = new Set([...get2(selectedIds), ...idsWithTag]);
    set(selectedIds, Array.from(union), true);
    set(quickSelectTag, "");
  };
  const handleBulkDelete = async () => {
    if (get2(selectedIds).length === 0)
      return;
    if (!confirm(`Are you sure you want to delete the ${get2(selectedIds).length} selected contacts?`)) {
      return;
    }
    try {
      await syncManager.bulkDelete(get2(selectedIds));
      set(selectedIds, [], true);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message || "Failed to complete bulk delete.");
    }
  };
  const handleBulkUpdateGroup = async () => {
    try {
      await syncManager.bulkUpdateGroups(get2(selectedIds), get2(bulkGroupValue));
      set(isBulkGroupModalOpen, false);
      set(bulkGroupValue, "");
      set(selectedIds, [], true);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message || "Failed to update groups.");
    }
  };
  const handleBulkUpdateTags = async () => {
    if (!get2(bulkTagValue).trim())
      return;
    const tagsArray = get2(bulkTagValue).split(",").map((t) => t.trim()).filter(Boolean);
    try {
      await syncManager.bulkUpdateTags(get2(selectedIds), tagsArray, bulkTagAction);
      set(isBulkTagModalOpen, false);
      set(bulkTagValue, "");
      set(selectedIds, [], true);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message || "Failed to update tags.");
    }
  };
  const handleBulkExportVCF = () => {
    if (get2(selectedIds).length === 0)
      return;
    const selectedContacts = get2(contacts).filter((c) => c.id !== undefined && get2(selectedIds).includes(c.id));
    if (selectedContacts.length === 0) {
      alert("No matching contacts found to export.");
      return;
    }
    const vcards = selectedContacts.map((contact) => {
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${contact.name}`,
        contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : "",
        contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : "",
        contact.website ? `URL:${contact.website}` : "",
        contact.company ? `ORG:${contact.company}` : "",
        contact.job_title ? `TITLE:${contact.job_title}` : "",
        contact.address ? `ADR;TYPE=WORK:;;${contact.address.replace(/\n/g, ";")}` : "",
        contact.birthday ? `BDAY:${contact.birthday}` : "",
        contact.notes ? `NOTE:${contact.notes.replace(/\n/g, "\\n")}` : "",
        contact.group_name ? `CATEGORIES:${contact.group_name}${contact.tags ? "," + contact.tags : ""}` : contact.tags ? `CATEGORIES:${contact.tags}` : "",
        "END:VCARD"
      ].filter(Boolean).join(`\r
`);
    }).join(`\r
`);
    const blob = new Blob([vcards], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link2 = document.createElement("a");
    link2.href = url;
    let filename = "contacts_export.vcf";
    if (get2(activeGroupFilter)) {
      filename = `contacts_group_${get2(activeGroupFilter).replace(/\s+/g, "_")}.vcf`;
    } else if (get2(activeTagFilter)) {
      filename = `contacts_tag_${get2(activeTagFilter).replace(/\s+/g, "_")}.vcf`;
    } else if (selectedContacts.length === 1) {
      filename = `${selectedContacts[0].name.replace(/\s+/g, "_")}.vcf`;
    } else {
      filename = `contacts_export_${selectedContacts.length}.vcf`;
    }
    link2.setAttribute("download", filename);
    document.body.appendChild(link2);
    link2.click();
    document.body.removeChild(link2);
  };
  const handleAddContactSubmit = async (e) => {
    e.preventDefault();
    if (!get2(contactForm).name.trim())
      return;
    try {
      await syncManager.createContact(get2(contactForm));
      set(isAddModalOpen, false);
      set(contactForm, {
        name: "",
        phone: "",
        email: "",
        website: "",
        group_name: "",
        tags: "",
        address: "",
        company: "",
        job_title: "",
        notes: "",
        birthday: ""
      }, true);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message || "Failed to save contact.");
    }
  };
  const handleEditContactSubmit = async (e) => {
    e.preventDefault();
    if (!get2(viewingContact) || !get2(viewingContact).id)
      return;
    try {
      const updated = await syncManager.updateContact(get2(viewingContact).id, { ...get2(contactForm), id: get2(viewingContact).id });
      set(viewingContact, updated, true);
      set(isEditing, false);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message || "Failed to save changes.");
    }
  };
  const startEditing = (contact) => {
    set(contactForm, {
      name: contact.name,
      phone: contact.phone || "",
      email: contact.email || "",
      website: contact.website || "",
      group_name: contact.group_name || "",
      tags: contact.tags || "",
      address: contact.address || "",
      company: contact.company || "",
      job_title: contact.job_title || "",
      notes: contact.notes || "",
      birthday: contact.birthday || ""
    }, true);
    set(isEditing, true);
  };
  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?"))
      return;
    try {
      await syncManager.deleteContact(id);
      set(viewingContact, null);
      fetchData();
      if ($$props.onContactsChange)
        $$props.onContactsChange();
    } catch (err) {
      alert(err.message);
    }
  };
  const downloadVCard = (contact) => {
    const vcardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${contact.name}`,
      contact.phone ? `TEL;TYPE=CELL:${contact.phone}` : "",
      contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : "",
      contact.website ? `URL:${contact.website}` : "",
      contact.company ? `ORG:${contact.company}` : "",
      contact.job_title ? `TITLE:${contact.job_title}` : "",
      contact.address ? `ADR;TYPE=WORK:;;${contact.address.replace(/\n/g, ";")}` : "",
      contact.birthday ? `BDAY:${contact.birthday}` : "",
      contact.notes ? `NOTE:${contact.notes.replace(/\n/g, "\\n")}` : "",
      contact.group_name ? `CATEGORIES:${contact.group_name}${contact.tags ? "," + contact.tags : ""}` : contact.tags ? `CATEGORIES:${contact.tags}` : "",
      "END:VCARD"
    ].filter(Boolean).join(`\r
`);
    const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link2 = document.createElement("a");
    link2.href = url;
    link2.setAttribute("download", `${contact.name.replace(/\s+/g, "_")}.vcf`);
    document.body.appendChild(link2);
    link2.click();
    document.body.removeChild(link2);
  };
  next();
  var text2 = text(`

`);
  append($$anchor, text2);
  pop();
}
if (undefined) {}
var ContactsScreen_default = ContactsScreen;

// src/components/ImportScreen.svelte
var import_papaparse = __toESM(require_papaparse_min(), 1);
var root23 = from_html(`
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-xs text-red-700 max-w-2xl mx-auto items-start">
            <!>
            <div>
              <h4 class="font-bold">Parsing Failure</h4>
              <p class="mt-0.5 text-slate-600"> </p>
            </div>
          </div>
        `, 1);
var root_123 = from_html(`
      <div class="space-y-6">
        <div>
          <input type="file" accept=".csv" class="hidden"/>
          <div class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
            <!>
          </div>
          <h3 class="text-sm font-semibold text-slate-800">
            Drag &amp; drop your CSV file here, or click to browse
          </h3>
          <p class="text-xs text-slate-400 mt-1 max-w-xs">
            Supports only comma-separated .csv files. First row should contain the column headers.
          </p>
        </div>

        <!>

        <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">
            CRM CSV Formatting Guide
          </h4>
          <p class="text-xs text-slate-600">
            To maximize mapping speed, we recommend naming your spreadsheet headers similar to:
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono bg-slate-50 p-3 rounded-lg border border-slate-150">
            <div>• Name / Full Name</div>
            <div>• Phone / Mobile</div>
            <div>• Email / Address</div>
            <div>• Website / URL</div>
            <div>• Group / Folder</div>
            <div>• Tags / Labels</div>
            <div>• Company / Org</div>
            <div>• Job Title / Role</div>
          </div>
          <p class="text-xs text-slate-500 italic">
            Our smart parser automatically identifies standard variants and pre-fills mappings for you.
          </p>
        </div>
      </div>
    `, 1);
var root_2 = from_html(`
                      <span class="text-red-500 font-bold">*</span>
                    `, 1);
var root_3 = from_html(`
                        <option> </option>
                      `, 1);
var root_4 = from_html(`
                      <!>
                    `, 1);
var root_5 = from_html(`
                
                <div class="grid grid-cols-12 gap-2 items-center">
                  <div class="col-span-5 flex items-center gap-1">
                    <span class="text-xs font-semibold text-slate-700"> </span>
                    <!>
                  </div>
                  <div class="col-span-7 relative">
                    <select>
                      <option>-- Ignored / Skip Field --</option>
                      <!>
                    </select>
                    <!>
                  </div>
                </div>
              `, 1);
var root_6 = from_html(`
                        <div> </div>
                      `, 1);
var root_7 = from_html(`
                    <div class="text-slate-600 space-y-0.5 font-mono text-[10px]">
                      <!>
                      <!>
                    </div>
                  `, 1);
var root_8 = from_html(`
                    <div class="text-slate-700 italic text-[11px]"> </div>
                  `, 1);
var root_9 = from_html(`
                      <span class="bg-slate-200 text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wide"> </span>
                    `, 1);
var root_10 = from_html(`
                          <span class="bg-white border border-slate-250 text-slate-600 text-[9px] px-1.5 py-0.1 rounded-full"> </span>
                        `, 1);
var root_11 = from_html(`
                        
                        <!>
                      `, 1);
var root_124 = from_html(`
                <div class="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span class="font-bold text-slate-900 truncate pr-2"> </span>
                    <span class="text-[9px] text-slate-400"></span>
                  </div>
                  
                  <!>

                  <!>

                  <div class="flex flex-wrap gap-1 pt-1 items-center">
                    <!>
                    <!>
                  </div>
                </div>
              `, 1);
var root_132 = from_html(`
              <div class="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs text-red-700">
                <!>
                <div>
                  <h4 class="font-bold">Execution Error</h4>
                  <p class="mt-0.5"> </p>
                </div>
              </div>
            `, 1);
var root_142 = from_html(`
                  <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Writing to SQLite...</span>
                `, 1);
var root_152 = from_html(`
                  <!>
                  <span> </span>
                `, 1);
var root_162 = from_html(`
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div class="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs">
            <div>
              <h3 class="text-sm font-bold text-slate-900 border-b border-slate-150 pb-2 flex items-center gap-1.5">
                <!>
                <span>Map CSV Headers to CRM Database fields</span>
              </h3>
              <p class="text-[11px] text-slate-400 mt-1">
                Select which column from your CSV file represents each CRM field. Leaving a selector empty is acceptable, except for Full Name.
              </p>
            </div>

            <div class="space-y-3">
              <!>
            </div>

            <div class="border-t border-slate-150 pt-4 space-y-4">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <!>
                  <span>Append default labels to all contacts</span>
                </h3>
                <p class="text-[10px] text-slate-400 mt-0.5">
                  Need to immediately sort this import? Apply a default group or append tags to every single incoming contact.
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 mb-1">Default Group</label>
                  <input id="default-group-input" type="text" placeholder="e.g. Imported Leads" class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"/>
                  <span class="text-[9px] text-slate-400">Only applied if contact does not have a mapped group row.</span>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-500 mb-1">Default Tags (Comma-separated)</label>
                  <input id="default-tags-input" type="text" placeholder="e.g. bulk-import-2026, raw" class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-400"/>
                  <span class="text-[9px] text-slate-400">These tags will be appended to every imported contact.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs h-fit sticky top-24">
            <div>
              <h3 class="text-sm font-bold text-slate-900 border-b border-slate-150 pb-2 flex items-center gap-1.5">
                <!>
                <span>Real-time Import Preview</span>
              </h3>
              <p class="text-[11px] text-slate-400 mt-1"> </p>
            </div>

            <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
              <!>
            </div>

            <!>

            <div class="flex items-center gap-3 pt-2">
              <button class="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer">
                <!>
                <span>Reset</span>
              </button>
              <button id="execute-import-btn" class="flex-2 py-2 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <!>
              </button>
            </div>
          </div>
        </div>
      </div>
    `, 1);
var root_172 = from_html(`
            <div class="flex justify-between">
              <span>Default Group applied:</span>
              <span class="font-bold text-slate-900"> </span>
            </div>
          `, 1);
var root_182 = from_html(`
            <div class="flex justify-between items-start">
              <span>Default Tags appended:</span>
              <span class="font-bold text-slate-900 text-right max-w-[200px] truncate"> </span>
            </div>
          `, 1);
var root_192 = from_html(`
      <div class="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center space-y-6 shadow-sm my-10">
        <div class="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-150">
          <!>
        </div>
        <div class="space-y-2">
          <h3 class="text-base font-bold text-slate-900">Import Successful!</h3>
          <p class="text-xs text-slate-500">
            A batch of <span class="font-bold text-slate-950"> </span> has been successfully mapped, processed, and loaded into your SQLite database.
          </p>
        </div>

        <div class="bg-slate-50 rounded-lg p-4 border border-slate-150 space-y-2 text-xs text-slate-600 text-left">
          <div class="flex justify-between">
            <span>Total records inserted:</span>
            <span class="font-bold text-slate-900"> </span>
          </div>
          <!>
          <!>
        </div>

        <div class="flex gap-3">
          <button class="flex-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors font-medium cursor-pointer">
            Import another file
          </button>
          <button id="view-contacts-after-import-btn" class="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-lg text-xs transition-all font-bold cursor-pointer">
            View Contacts Book
          </button>
        </div>
      </div>
    `, 1);
var root_20 = from_html(`



<div class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 flex flex-col h-full">
  
  <div class="mb-6">
    <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
      <!>
      <span>CSV Contact Importer</span>
    </h2>
    <p class="text-xs text-slate-500 mt-1">
      Upload any standard spreadsheet in .csv format. Match your column headers to our database schema, and bulk load thousands of records instantly into SQLite.
    </p>
  </div>

  <div class="mb-6 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs max-w-4xl mx-auto w-full">
    <div class="flex items-center gap-2">
      <div>
        1
      </div>
      <span>Upload file</span>
    </div>
    <!>
    <div class="flex items-center gap-2">
      <div>
        2
      </div>
      <span>Map fields &amp; Defaults</span>
    </div>
    <!>
    <div class="flex items-center gap-2">
      <div>
        3
      </div>
      <span>Import completed</span>
    </div>
  </div>

  <div class="flex-1 max-w-4xl mx-auto w-full">
    <!>

    <!>

    <!>
  </div>
</div>`, 1);
function ImportScreen($$anchor, $$props) {
  push($$props, true);
  let step = state(1);
  let file = state(null);
  let isDragActive = state(false);
  let parsedHeaders = state(proxy([]));
  let parsedRows = state(proxy([]));
  let parseError = state(null);
  let fieldMapping = state(proxy({
    name: "",
    phone: "",
    email: "",
    website: "",
    group_name: "",
    tags: "",
    address: "",
    company: "",
    job_title: "",
    notes: "",
    birthday: ""
  }));
  let defaultGroup = state("");
  let defaultTags = state("");
  let importing = state(false);
  let importCount = state(null);
  let importError = state(null);
  let fileInputRef = state(null);
  const handleDragOver = (e) => {
    e.preventDefault();
    set(isDragActive, true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    set(isDragActive, false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    set(isDragActive, false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        processCSV(droppedFile);
      } else {
        set(parseError, "Unsupported file format. Please upload a .csv file.");
      }
    }
  };
  const handleFileSelect = (e) => {
    const target = e.target;
    if (target.files && target.files[0]) {
      const selectedFile = target.files[0];
      processCSV(selectedFile);
    }
  };
  const processCSV = (csvFile) => {
    set(parseError, null);
    set(file, csvFile, true);
    import_papaparse.default.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          set(parseError, "Failed to parse CSV file: " + results.errors[0].message);
          return;
        }
        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          set(parseError, "Empty CSV file or headers not detected.");
          return;
        }
        set(parsedHeaders, headers, true);
        set(parsedRows, results.data, true);
        const initialMapping = { ...get2(fieldMapping) };
        headers.forEach((h) => {
          const lower = h.toLowerCase().replace(/[\s_-]/g, "");
          if (lower === "name" || lower === "fullname" || lower === "displayname" || lower === "contactname") {
            initialMapping.name = h;
          } else if (lower === "phone" || lower === "mobile" || lower === "tel" || lower === "cellphone" || lower === "cell") {
            initialMapping.phone = h;
          } else if (lower === "email" || lower === "emailaddress" || lower === "mail") {
            initialMapping.email = h;
          } else if (lower === "website" || lower === "web" || lower === "site" || lower === "url") {
            initialMapping.website = h;
          } else if (lower === "group" || lower === "folder" || lower === "category" || lower === "groups_name" || lower === "group_name") {
            initialMapping.group_name = h;
          } else if (lower === "tag" || lower === "tags" || lower === "label" || lower === "labels") {
            initialMapping.tags = h;
          } else if (lower === "address" || lower === "location" || lower === "addr" || lower === "street") {
            initialMapping.address = h;
          } else if (lower === "company" || lower === "org" || lower === "organization" || lower === "employer") {
            initialMapping.company = h;
          } else if (lower === "title" || lower === "role" || lower === "jobtitle" || lower === "job") {
            initialMapping.job_title = h;
          } else if (lower === "notes" || lower === "note" || lower === "description" || lower === "memo" || lower === "history") {
            initialMapping.notes = h;
          } else if (lower === "birthday" || lower === "bday" || lower === "birthdate" || lower === "birth") {
            initialMapping.birthday = h;
          }
        });
        if (!initialMapping.name && headers.length > 0) {
          initialMapping.name = headers[0];
        }
        set(fieldMapping, initialMapping, true);
        set(step, 2);
      },
      error: (err) => {
        set(parseError, "An error occurred while parsing the CSV file: " + err.message);
      }
    });
  };
  const handleFieldMapChange = (crmField, csvHeader) => {
    set(fieldMapping, { ...get2(fieldMapping), [crmField]: csvHeader }, true);
  };
  const handleExecuteImport = async () => {
    if (get2(parsedRows).length === 0)
      return;
    if (!get2(fieldMapping).name) {
      alert('The "Full Name" field must be mapped to proceed with the import.');
      return;
    }
    set(importing, true);
    set(importError, null);
    const structuredContacts = get2(parsedRows).map((row) => {
      return {
        name: row[get2(fieldMapping).name] || "Unnamed Contact",
        phone: get2(fieldMapping).phone ? row[get2(fieldMapping).phone] : "",
        email: get2(fieldMapping).email ? row[get2(fieldMapping).email] : "",
        website: get2(fieldMapping).website ? row[get2(fieldMapping).website] : "",
        group_name: get2(fieldMapping).group_name ? row[get2(fieldMapping).group_name] : "",
        tags: get2(fieldMapping).tags ? row[get2(fieldMapping).tags] : "",
        address: get2(fieldMapping).address ? row[get2(fieldMapping).address] : "",
        company: get2(fieldMapping).company ? row[get2(fieldMapping).company] : "",
        job_title: get2(fieldMapping).job_title ? row[get2(fieldMapping).job_title] : "",
        notes: get2(fieldMapping).notes ? row[get2(fieldMapping).notes] : "",
        birthday: get2(fieldMapping).birthday ? row[get2(fieldMapping).birthday] : ""
      };
    });
    const tagsArray = get2(defaultTags).split(",").map((t) => t.trim()).filter(Boolean);
    try {
      await syncManager.importContacts(structuredContacts, get2(defaultGroup).trim(), tagsArray);
      set(importCount, structuredContacts.length, true);
      set(step, 3);
    } catch (err) {
      set(importError, err.message || "Import failed.", true);
    } finally {
      set(importing, false);
    }
  };
  const handleReset = () => {
    set(file, null);
    set(parsedHeaders, [], true);
    set(parsedRows, [], true);
    set(parseError, null);
    set(fieldMapping, {
      name: "",
      phone: "",
      email: "",
      website: "",
      group_name: "",
      tags: "",
      address: "",
      company: "",
      job_title: "",
      notes: "",
      birthday: ""
    }, true);
    set(defaultGroup, "");
    set(defaultTags, "");
    set(importCount, null);
    set(importError, null);
    set(step, 1);
  };
  const getPreviewContacts = () => {
    return get2(parsedRows).slice(0, 3).map((row) => {
      const rawTags = get2(fieldMapping).tags ? row[get2(fieldMapping).tags] : "";
      let combinedTagsList = rawTags ? String(rawTags).split(",").map((t) => t.trim()).filter(Boolean) : [];
      if (get2(defaultTags)) {
        get2(defaultTags).split(",").forEach((dt) => {
          const trimmed = dt.trim();
          if (trimmed && !combinedTagsList.includes(trimmed)) {
            combinedTagsList.push(trimmed);
          }
        });
      }
      return {
        name: row[get2(fieldMapping).name] || "Unnamed Contact",
        phone: get2(fieldMapping).phone ? row[get2(fieldMapping).phone] : "",
        email: get2(fieldMapping).email ? row[get2(fieldMapping).email] : "",
        group: (get2(fieldMapping).group_name ? row[get2(fieldMapping).group_name] : "") || get2(defaultGroup),
        tags: combinedTagsList.join(", "),
        company: get2(fieldMapping).company ? row[get2(fieldMapping).company] : "",
        job_title: get2(fieldMapping).job_title ? row[get2(fieldMapping).job_title] : ""
      };
    });
  };
  const crmFieldsConfig = [
    { key: "name", label: "Full Name", required: true },
    { key: "phone", label: "Phone Number", required: false },
    { key: "email", label: "Email Address", required: false },
    { key: "website", label: "Website URL", required: false },
    { key: "company", label: "Company / Org", required: false },
    { key: "job_title", label: "Job Title / Role", required: false },
    { key: "group_name", label: "Primary Group", required: false },
    { key: "tags", label: "Tags List", required: false },
    { key: "address", label: "Physical Address", required: false },
    { key: "birthday", label: "Birthday", required: false },
    { key: "notes", label: "Biography / Notes", required: false }
  ];
  next();
  var fragment = root_20();
  var div = sibling(first_child(fragment));
  var div_1 = sibling(child(div));
  var h2 = sibling(child(div_1));
  var node = sibling(child(h2));
  file_spreadsheet_default(node, { class: "h-5 w-5 text-slate-600" });
  next(3);
  reset(h2);
  next(3);
  reset(div_1);
  var div_2 = sibling(div_1, 2);
  var div_3 = sibling(child(div_2));
  var div_4 = sibling(child(div_3));
  var span = sibling(div_4, 2);
  next();
  reset(div_3);
  var node_1 = sibling(div_3, 2);
  arrow_right_default(node_1, { class: "h-4 w-4 text-slate-300" });
  var div_5 = sibling(node_1, 2);
  var div_6 = sibling(child(div_5));
  var span_1 = sibling(div_6, 2);
  next();
  reset(div_5);
  var node_2 = sibling(div_5, 2);
  arrow_right_default(node_2, { class: "h-4 w-4 text-slate-300" });
  var div_7 = sibling(node_2, 2);
  var div_8 = sibling(child(div_7));
  var span_2 = sibling(div_8, 2);
  next();
  reset(div_7);
  next();
  reset(div_2);
  var div_9 = sibling(div_2, 2);
  var node_3 = sibling(child(div_9));
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_1 = root_123();
      var div_10 = sibling(first_child(fragment_1));
      var div_11 = sibling(child(div_10));
      var input = sibling(child(div_11));
      bind_this(input, ($$value) => set(fileInputRef, $$value), () => get2(fileInputRef));
      var div_12 = sibling(input, 2);
      var node_4 = sibling(child(div_12));
      upload_default(node_4, { class: "h-6 w-6" });
      next();
      reset(div_12);
      next(5);
      reset(div_11);
      var node_5 = sibling(div_11, 2);
      {
        var consequent = ($$anchor3) => {
          var fragment_2 = root23();
          var div_13 = sibling(first_child(fragment_2));
          var node_6 = sibling(child(div_13));
          circle_alert_default(node_6, { class: "h-4 w-4 shrink-0 mt-0.5" });
          var div_14 = sibling(node_6, 2);
          var p = sibling(child(div_14), 3);
          var text2 = child(p, true);
          reset(p);
          next();
          reset(div_14);
          next();
          reset(div_13);
          next();
          template_effect(() => set_text(text2, get2(parseError)));
          append($$anchor3, fragment_2);
        };
        if_block(node_5, ($$render) => {
          if (get2(parseError))
            $$render(consequent);
        });
      }
      next(3);
      reset(div_10);
      next();
      template_effect(() => set_class(div_11, 1, `border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${get2(isDragActive) ? "border-slate-800 bg-slate-100/50 scale-[1.01]" : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-xs"}`));
      event("dragover", div_11, handleDragOver);
      event("dragleave", div_11, handleDragLeave);
      event("drop", div_11, handleDrop);
      delegated("click", div_11, () => get2(fileInputRef)?.click());
      delegated("change", input, handleFileSelect);
      append($$anchor2, fragment_1);
    };
    if_block(node_3, ($$render) => {
      if (get2(step) === 1)
        $$render(consequent_1);
    });
  }
  var node_7 = sibling(node_3, 2);
  {
    var consequent_13 = ($$anchor2) => {
      var fragment_3 = root_162();
      var div_15 = sibling(first_child(fragment_3));
      var div_16 = sibling(child(div_15));
      var div_17 = sibling(child(div_16));
      var div_18 = sibling(child(div_17));
      var h3 = sibling(child(div_18));
      var node_8 = sibling(child(h3));
      settings_default(node_8, { class: "h-4 w-4 text-slate-500" });
      next(3);
      reset(h3);
      next(3);
      reset(div_18);
      var div_19 = sibling(div_18, 2);
      var node_9 = sibling(child(div_19));
      each(node_9, 17, () => crmFieldsConfig, (field) => field.key, ($$anchor3, field) => {
        const isMapped = user_derived(() => !!get2(fieldMapping)[get2(field).key]);
        next();
        var fragment_4 = root_5();
        var div_20 = sibling(first_child(fragment_4));
        var div_21 = sibling(child(div_20));
        var span_3 = sibling(child(div_21));
        var text_1 = child(span_3, true);
        reset(span_3);
        var node_10 = sibling(span_3, 2);
        {
          var consequent_2 = ($$anchor4) => {
            var fragment_5 = root_2();
            next(2);
            append($$anchor4, fragment_5);
          };
          if_block(node_10, ($$render) => {
            if (get2(field).required)
              $$render(consequent_2);
          });
        }
        next();
        reset(div_21);
        var div_22 = sibling(div_21, 2);
        var select = sibling(child(div_22));
        var option = sibling(child(select));
        option.value = option.__value = "";
        var node_11 = sibling(option, 2);
        each(node_11, 17, () => get2(parsedHeaders), index, ($$anchor4, h) => {
          next();
          var fragment_6 = root_3();
          var option_1 = sibling(first_child(fragment_6));
          var text_2 = child(option_1, true);
          reset(option_1);
          var option_1_value = {};
          next();
          template_effect(() => {
            set_text(text_2, get2(h));
            if (option_1_value !== (option_1_value = get2(h))) {
              option_1.value = (option_1.__value = get2(h)) ?? "";
            }
          });
          append($$anchor4, fragment_6);
        });
        next();
        reset(select);
        var node_12 = sibling(select, 2);
        {
          var consequent_3 = ($$anchor4) => {
            var fragment_7 = root_4();
            var node_13 = sibling(first_child(fragment_7));
            check_default(node_13, {
              class: "absolute right-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-green-600"
            });
            next();
            append($$anchor4, fragment_7);
          };
          if_block(node_12, ($$render) => {
            if (get2(isMapped))
              $$render(consequent_3);
          });
        }
        next();
        reset(div_22);
        next();
        reset(div_20);
        next();
        template_effect(() => {
          set_text(text_1, get2(field).label);
          set_attribute2(select, "id", `map-${get2(field).key}-select`);
          set_class(select, 1, `w-full px-3 py-1.5 text-xs bg-slate-50 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-400 ${get2(isMapped) ? "border-slate-300 font-medium text-slate-800 bg-emerald-50/20" : "border-slate-200 text-slate-400"}`);
        });
        delegated("change", select, (e) => handleFieldMapChange(get2(field).key, e.target.value));
        bind_select_value(select, () => get2(fieldMapping)[get2(field).key], ($$value) => get2(fieldMapping)[get2(field).key] = $$value);
        append($$anchor3, fragment_4);
      });
      next();
      reset(div_19);
      var div_23 = sibling(div_19, 2);
      var div_24 = sibling(child(div_23));
      var h3_1 = sibling(child(div_24));
      var node_14 = sibling(child(h3_1));
      list_plus_default(node_14, { class: "h-4 w-4 text-slate-400" });
      next(3);
      reset(h3_1);
      next(3);
      reset(div_24);
      var div_25 = sibling(div_24, 2);
      var div_26 = sibling(child(div_25));
      var input_1 = sibling(child(div_26), 3);
      remove_input_defaults(input_1);
      next(3);
      reset(div_26);
      var div_27 = sibling(div_26, 2);
      var input_2 = sibling(child(div_27), 3);
      remove_input_defaults(input_2);
      next(3);
      reset(div_27);
      next();
      reset(div_25);
      next();
      reset(div_23);
      next();
      reset(div_17);
      var div_28 = sibling(div_17, 2);
      var div_29 = sibling(child(div_28));
      var h3_2 = sibling(child(div_29));
      var node_15 = sibling(child(h3_2));
      eye_default(node_15, { class: "h-4 w-4 text-slate-500" });
      next(3);
      reset(h3_2);
      var p_1 = sibling(h3_2, 2);
      var text_3 = child(p_1);
      reset(p_1);
      next();
      reset(div_29);
      var div_30 = sibling(div_29, 2);
      var node_16 = sibling(child(div_30));
      each(node_16, 17, getPreviewContacts, index, ($$anchor3, contact, index2) => {
        next();
        var fragment_8 = root_124();
        var div_31 = sibling(first_child(fragment_8));
        var div_32 = sibling(child(div_31));
        var span_4 = sibling(child(div_32));
        var text_4 = child(span_4, true);
        reset(span_4);
        var span_5 = sibling(span_4, 2);
        span_5.textContent = `Preview #${index2 + 1}`;
        next();
        reset(div_32);
        var node_17 = sibling(div_32, 2);
        {
          var consequent_6 = ($$anchor4) => {
            var fragment_9 = root_7();
            var div_33 = sibling(first_child(fragment_9));
            var node_18 = sibling(child(div_33));
            {
              var consequent_4 = ($$anchor5) => {
                var fragment_10 = root_6();
                var div_34 = sibling(first_child(fragment_10));
                var text_5 = child(div_34);
                reset(div_34);
                next();
                template_effect(() => set_text(text_5, `\uD83D\uDCDE ${get2(contact).phone ?? ""}`));
                append($$anchor5, fragment_10);
              };
              if_block(node_18, ($$render) => {
                if (get2(contact).phone)
                  $$render(consequent_4);
              });
            }
            var node_19 = sibling(node_18, 2);
            {
              var consequent_5 = ($$anchor5) => {
                var fragment_11 = root_6();
                var div_35 = sibling(first_child(fragment_11));
                var text_6 = child(div_35);
                reset(div_35);
                next();
                template_effect(() => set_text(text_6, `✉️ ${get2(contact).email ?? ""}`));
                append($$anchor5, fragment_11);
              };
              if_block(node_19, ($$render) => {
                if (get2(contact).email)
                  $$render(consequent_5);
              });
            }
            next();
            reset(div_33);
            next();
            append($$anchor4, fragment_9);
          };
          if_block(node_17, ($$render) => {
            if (get2(contact).phone || get2(contact).email)
              $$render(consequent_6);
          });
        }
        var node_20 = sibling(node_17, 2);
        {
          var consequent_7 = ($$anchor4) => {
            var fragment_12 = root_8();
            var div_36 = sibling(first_child(fragment_12));
            var text_7 = child(div_36);
            reset(div_36);
            next();
            template_effect(() => set_text(text_7, `
                      \uD83D\uDCBC ${get2(contact).job_title ?? ""} ${get2(contact).company ? `at ${get2(contact).company}` : ""}
                    `));
            append($$anchor4, fragment_12);
          };
          if_block(node_20, ($$render) => {
            if (get2(contact).company || get2(contact).job_title)
              $$render(consequent_7);
          });
        }
        var div_37 = sibling(node_20, 2);
        var node_21 = sibling(child(div_37));
        {
          var consequent_8 = ($$anchor4) => {
            var fragment_13 = root_9();
            var span_6 = sibling(first_child(fragment_13));
            var text_8 = child(span_6);
            reset(span_6);
            next();
            template_effect(() => set_text(text_8, `
                        ${get2(contact).group ?? ""}
                      `));
            append($$anchor4, fragment_13);
          };
          if_block(node_21, ($$render) => {
            if (get2(contact).group)
              $$render(consequent_8);
          });
        }
        var node_22 = sibling(node_21, 2);
        {
          var consequent_10 = ($$anchor4) => {
            var fragment_14 = root_4();
            var node_23 = sibling(first_child(fragment_14));
            each(node_23, 17, () => get2(contact).tags.split(","), index, ($$anchor5, tag2) => {
              const trimmed = user_derived(() => get2(tag2).trim());
              next();
              var fragment_15 = root_11();
              var node_24 = sibling(first_child(fragment_15));
              {
                var consequent_9 = ($$anchor6) => {
                  var fragment_16 = root_10();
                  var span_7 = sibling(first_child(fragment_16));
                  var text_9 = child(span_7);
                  reset(span_7);
                  next();
                  template_effect(() => set_text(text_9, `
                            ${get2(trimmed) ?? ""}
                          `));
                  append($$anchor6, fragment_16);
                };
                if_block(node_24, ($$render) => {
                  if (get2(trimmed))
                    $$render(consequent_9);
                });
              }
              next();
              append($$anchor5, fragment_15);
            });
            next();
            append($$anchor4, fragment_14);
          };
          if_block(node_22, ($$render) => {
            if (get2(contact).tags)
              $$render(consequent_10);
          });
        }
        next();
        reset(div_37);
        next();
        reset(div_31);
        next();
        template_effect(() => set_text(text_4, get2(contact).name));
        append($$anchor3, fragment_8);
      });
      next();
      reset(div_30);
      var node_25 = sibling(div_30, 2);
      {
        var consequent_11 = ($$anchor3) => {
          var fragment_17 = root_132();
          var div_38 = sibling(first_child(fragment_17));
          var node_26 = sibling(child(div_38));
          circle_alert_default(node_26, { class: "h-4 w-4 shrink-0 mt-0.5" });
          var div_39 = sibling(node_26, 2);
          var p_2 = sibling(child(div_39), 3);
          var text_10 = child(p_2, true);
          reset(p_2);
          next();
          reset(div_39);
          next();
          reset(div_38);
          next();
          template_effect(() => set_text(text_10, get2(importError)));
          append($$anchor3, fragment_17);
        };
        if_block(node_25, ($$render) => {
          if (get2(importError))
            $$render(consequent_11);
        });
      }
      var div_40 = sibling(node_25, 2);
      var button = sibling(child(div_40));
      var node_27 = sibling(child(button));
      rotate_ccw_default(node_27, { class: "h-3.5 w-3.5" });
      next(3);
      reset(button);
      var button_1 = sibling(button, 2);
      var node_28 = sibling(child(button_1));
      {
        var consequent_12 = ($$anchor3) => {
          var fragment_18 = root_142();
          next(4);
          append($$anchor3, fragment_18);
        };
        var alternate = ($$anchor3) => {
          var fragment_19 = root_152();
          var node_29 = sibling(first_child(fragment_19));
          database_default(node_29, { class: "h-4 w-4" });
          var span_8 = sibling(node_29, 2);
          var text_11 = child(span_8);
          reset(span_8);
          next();
          template_effect(() => set_text(text_11, `Import ${get2(parsedRows).length ?? ""} Contacts`));
          append($$anchor3, fragment_19);
        };
        if_block(node_28, ($$render) => {
          if (get2(importing))
            $$render(consequent_12);
          else
            $$render(alternate, -1);
        });
      }
      next();
      reset(button_1);
      next();
      reset(div_40);
      next();
      reset(div_28);
      next();
      reset(div_16);
      next();
      reset(div_15);
      next();
      template_effect(($0) => {
        set_text(text_3, `
                Showing how the first ${$0 ?? ""} rows will resolve inside the CRM database.
              `);
        button_1.disabled = get2(importing) || !get2(fieldMapping).name;
      }, [() => Math.min(3, get2(parsedRows).length)]);
      bind_value(input_1, () => get2(defaultGroup), ($$value) => set(defaultGroup, $$value));
      bind_value(input_2, () => get2(defaultTags), ($$value) => set(defaultTags, $$value));
      delegated("click", button, handleReset);
      delegated("click", button_1, handleExecuteImport);
      append($$anchor2, fragment_3);
    };
    if_block(node_7, ($$render) => {
      if (get2(step) === 2)
        $$render(consequent_13);
    });
  }
  var node_30 = sibling(node_7, 2);
  {
    var consequent_16 = ($$anchor2) => {
      var fragment_20 = root_192();
      var div_41 = sibling(first_child(fragment_20));
      var div_42 = sibling(child(div_41));
      var node_31 = sibling(child(div_42));
      check_default(node_31, { class: "h-7 w-7" });
      next();
      reset(div_42);
      var div_43 = sibling(div_42, 2);
      var p_3 = sibling(child(div_43), 3);
      var span_9 = sibling(child(p_3));
      var text_12 = child(span_9);
      reset(span_9);
      next();
      reset(p_3);
      next();
      reset(div_43);
      var div_44 = sibling(div_43, 2);
      var div_45 = sibling(child(div_44));
      var span_10 = sibling(child(div_45), 3);
      var text_13 = child(span_10, true);
      reset(span_10);
      next();
      reset(div_45);
      var node_32 = sibling(div_45, 2);
      {
        var consequent_14 = ($$anchor3) => {
          var fragment_21 = root_172();
          var div_46 = sibling(first_child(fragment_21));
          var span_11 = sibling(child(div_46), 3);
          var text_14 = child(span_11, true);
          reset(span_11);
          next();
          reset(div_46);
          next();
          template_effect(() => set_text(text_14, get2(defaultGroup)));
          append($$anchor3, fragment_21);
        };
        if_block(node_32, ($$render) => {
          if (get2(defaultGroup))
            $$render(consequent_14);
        });
      }
      var node_33 = sibling(node_32, 2);
      {
        var consequent_15 = ($$anchor3) => {
          var fragment_22 = root_182();
          var div_47 = sibling(first_child(fragment_22));
          var span_12 = sibling(child(div_47), 3);
          var text_15 = child(span_12, true);
          reset(span_12);
          next();
          reset(div_47);
          next();
          template_effect(() => set_text(text_15, get2(defaultTags)));
          append($$anchor3, fragment_22);
        };
        if_block(node_33, ($$render) => {
          if (get2(defaultTags))
            $$render(consequent_15);
        });
      }
      next();
      reset(div_44);
      var div_48 = sibling(div_44, 2);
      var button_2 = sibling(child(div_48));
      var button_3 = sibling(button_2, 2);
      next();
      reset(div_48);
      next();
      reset(div_41);
      next();
      template_effect(() => {
        set_text(text_12, `${get2(importCount) ?? ""} contacts`);
        set_text(text_13, get2(importCount));
      });
      delegated("click", button_2, handleReset);
      delegated("click", button_3, function(...$$args) {
        $$props.onImportSuccess?.apply(this, $$args);
      });
      append($$anchor2, fragment_20);
    };
    if_block(node_30, ($$render) => {
      if (get2(step) === 3)
        $$render(consequent_16);
    });
  }
  next();
  reset(div_9);
  next();
  reset(div);
  template_effect(() => {
    set_class(div_4, 1, `h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${get2(step) >= 1 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`);
    set_class(span, 1, `text-xs font-semibold ${get2(step) >= 1 ? "text-slate-900" : "text-slate-400"}`);
    set_class(div_6, 1, `h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${get2(step) >= 2 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`);
    set_class(span_1, 1, `text-xs font-semibold ${get2(step) >= 2 ? "text-slate-900" : "text-slate-400"}`);
    set_class(div_8, 1, `h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${get2(step) >= 3 ? "bg-green-700 text-white" : "bg-slate-200 text-slate-500"}`);
    set_class(span_2, 1, `text-xs font-semibold ${get2(step) >= 3 ? "text-green-800" : "text-slate-400"}`);
  });
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var ImportScreen_default = ImportScreen;
delegate(["click", "change"]);

// src/components/SettingsScreen.svelte
var root24 = from_html(`
        <!>
      `, 1);
var root_125 = from_html(`
    <div>
      <!>
      <span> </span>
    </div>
  `, 1);
var root_22 = from_html(`
          <div class="py-6 text-center text-xs text-slate-400 animate-pulse">Loading active metrics...</div>
        `, 1);
var root_32 = from_html(`
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100"> </span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <!>
                <span>Contacts</span>
              </span>
            </div>
            
            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100"> </span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <!>
                <span>Groups</span>
              </span>
            </div>

            <div class="bg-slate-950/60 border border-slate-850/80 rounded-lg p-3">
              <span class="block text-2xl font-black text-slate-100"> </span>
              <span class="text-[10px] text-slate-400 font-semibold uppercase flex items-center justify-center gap-1 mt-1">
                <!>
                <span>Tags</span>
              </span>
            </div>
          </div>
        `, 1);
var root_42 = from_html(`
          <div class="py-4 text-center text-xs text-slate-500 animate-pulse">Loading breakdowns...</div>
        `, 1);
var root_52 = from_html(`
          <p class="text-xs text-slate-500 italic">No groups registered yet.</p>
        `, 1);
var root_62 = from_html(`
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-900/50 last:border-0">
                <span class="font-medium text-slate-300"> </span>
                <span class="bg-teal-950/50 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-900/40"> </span>
              </div>
            `, 1);
var root_72 = from_html(`
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <!>
          </div>
        `, 1);
var root_82 = from_html(`

<div class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 text-slate-100 flex flex-col h-full">
  <!>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto w-full mb-12">
    <div class="md:col-span-6 space-y-6">
      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <!>
          <span>Offline-First CRM Metrics</span>
        </h3>

        <!>
      </div>

      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2">
          Contacts by Group
        </h3>
        <!>
      </div>
    </div>

    <div class="md:col-span-6 space-y-6">
      <div class="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <!>
          <span>Full Database Backups</span>
        </h3>
        
        <p class="text-xs text-slate-400 leading-relaxed">
          Compile your contact book offline at any time. Ideal for importing directory files into third-party CRM platforms or spreadsheets.
        </p>

        <div class="space-y-2 pt-1">
          <button class="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-900/20">
            <!>
            <span>Export to CSV Spreadsheet (.csv)</span>
          </button>

          <button class="w-full py-2.5 border border-slate-800 hover:border-teal-800 hover:bg-teal-950/20 text-teal-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer">
            <!>
            <span>Export all to standard vCard (.vcf)</span>
          </button>
        </div>
      </div>

      <div class="bg-slate-900/40 border border-red-900/40 backdrop-blur-md rounded-xl p-5 space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-red-400 border-b border-red-950 pb-2 flex items-center gap-1.5">
          <!>
          <span>Database Maintenance</span>
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-slate-200">Reset & Seed Sandbox</span>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              This wipes the active database and reloads 5 beautifully detailed demo profiles with emails, websites, tags, and groups.
            </p>
            <button id="reset-db-btn" class="mt-2 w-full py-2 border border-red-900 hover:border-red-600 hover:bg-red-950/20 text-red-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <!>
              <span>Restore Demo Seed Contacts</span>
            </button>
          </div>

          <div class="border-t border-slate-800/80 pt-3 flex flex-col gap-1">
            <span class="text-xs font-bold text-red-400">Factory Wipe Database</span>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Permanently clear all contact cards and tags, starting your Brain CRM system from an absolute pristine clean slate.
            </p>
            <button id="wipe-db-btn" class="mt-2 w-full py-2.5 bg-red-950 border border-red-800/60 hover:bg-red-900 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/35">
              <!>
              <span>Delete All Contacts (Wipe Database)</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-teal-950/20 border border-teal-900/40 rounded-xl p-4 flex gap-3 text-xs text-slate-300 backdrop-blur-md">
        <!>
        <div>
          <h4 class="font-bold text-teal-300">PWA Offline & Cloud Sync Active</h4>
          <p class="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
            This app runs completely offline. All actions — including resets and deletions — are instantly cached and will transparently replay and synchronize with the SQLite backend the moment you regain internet access!
          </p>
        </div>
      </div>

    </div>
  </div>

</div>`, 1);
function SettingsScreen($$anchor, $$props) {
  push($$props, true);
  let triggerRefreshStats = prop($$props, "triggerRefreshStats", 3, 0);
  let stats = state(proxy({
    totalContacts: 0,
    totalGroups: 0,
    totalTags: 0,
    groupDistribution: []
  }));
  let loading = state(true);
  let feedback = state(null);
  const fetchStats = async () => {
    set(loading, true);
    try {
      const contacts = await syncManager.getContacts();
      const groups = syncManager.getGroups();
      const tags = syncManager.getTags();
      const groupCounts = {};
      contacts.forEach((c) => {
        const gName = c.group_name || "Unassigned";
        groupCounts[gName] = (groupCounts[gName] || 0) + 1;
      });
      const groupDistribution = Object.entries(groupCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
      set(stats, {
        totalContacts: contacts.length,
        totalGroups: groups.length,
        totalTags: tags.length,
        groupDistribution
      }, true);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      set(loading, false);
    }
  };
  user_effect(() => {
    fetchStats();
  });
  const showFeedback = (message, type = "success") => {
    set(feedback, { message, type }, true);
    setTimeout(() => set(feedback, null), 4000);
  };
  const handleExportCSV = async () => {
    try {
      const contacts = await syncManager.getContacts();
      if (contacts.length === 0) {
        showFeedback("No contacts exist in the database to export.", "error");
        return;
      }
      const headers = [
        "Name",
        "Phone",
        "Email",
        "Website",
        "Group",
        "Tags",
        "Address",
        "Company",
        "Job Title",
        "Notes",
        "Birthday"
      ];
      const csvRows = [headers.join(",")];
      contacts.forEach((c) => {
        const row = [
          `"${(c.name || "").replace(/"/g, '""')}"`,
          `"${(c.phone || "").replace(/"/g, '""')}"`,
          `"${(c.email || "").replace(/"/g, '""')}"`,
          `"${(c.website || "").replace(/"/g, '""')}"`,
          `"${(c.group_name || "").replace(/"/g, '""')}"`,
          `"${(c.tags || "").replace(/"/g, '""')}"`,
          `"${(c.address || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
          `"${(c.company || "").replace(/"/g, '""')}"`,
          `"${(c.job_title || "").replace(/"/g, '""')}"`,
          `"${(c.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
          `"${(c.birthday || "").replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(","));
      });
      const blob = new Blob([csvRows.join(`\r
`)], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link2 = document.createElement("a");
      link2.href = url;
      link2.setAttribute("download", `crm_contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link2);
      link2.click();
      document.body.removeChild(link2);
      showFeedback("CSV file compiled and downloaded successfully.");
    } catch (err) {
      showFeedback("CSV Export failed: " + err.message, "error");
    }
  };
  const handleExportVCard = async () => {
    try {
      const contacts = await syncManager.getContacts();
      if (contacts.length === 0) {
        showFeedback("No contacts exist in the database to export.", "error");
        return;
      }
      const vcards = contacts.map((c) => {
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${c.name}`,
          c.phone ? `TEL;TYPE=CELL:${c.phone}` : "",
          c.email ? `EMAIL;TYPE=INTERNET:${c.email}` : "",
          c.website ? `URL:${c.website}` : "",
          c.company ? `ORG:${c.company}` : "",
          c.job_title ? `TITLE:${c.job_title}` : "",
          c.address ? `ADR;TYPE=WORK:;;${c.address.replace(/\n/g, ";")}` : "",
          c.birthday ? `BDAY:${c.birthday}` : "",
          c.notes ? `NOTE:${c.notes.replace(/\n/g, "\\n")}` : "",
          c.group_name ? `CATEGORIES:${c.group_name}${c.tags ? "," + c.tags : ""}` : c.tags ? `CATEGORIES:${c.tags}` : "",
          "END:VCARD"
        ].filter(Boolean).join(`\r
`);
      }).join(`\r
`);
      const blob = new Blob([vcards], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link2 = document.createElement("a");
      link2.href = url;
      link2.setAttribute("download", `crm_contacts_backup_${new Date().toISOString().slice(0, 10)}.vcf`);
      document.body.appendChild(link2);
      link2.click();
      document.body.removeChild(link2);
      showFeedback("vCard package file downloaded successfully.");
    } catch (err) {
      showFeedback("vCard Export failed: " + err.message, "error");
    }
  };
  const handleResetDatabase = async () => {
    if (!confirm("Warning: This will delete ALL current contacts and restore the 5 original Demo contacts. Proceed?")) {
      return;
    }
    try {
      const contacts = await syncManager.getContacts();
      const ids = contacts.map((c) => c.id).filter((id) => id !== undefined);
      if (ids.length > 0) {
        await syncManager.bulkDelete(ids);
      }
      const demoContacts = [
        {
          name: "Alice Smith",
          phone: "+1 (555) 123-4567",
          email: "alice@alphacorp.com",
          website: "https://alphacorp.com",
          group_name: "Customers",
          tags: "vip, follow-up",
          address: "123 Main St, New York, NY",
          company: "Alpha Corp",
          job_title: "Sales Manager",
          notes: "Prefers email communication. Interested in our enterprise product demo.",
          birthday: "1990-05-15"
        },
        {
          name: "Bob Jones",
          phone: "+1 (555) 987-6543",
          email: "bob@betalabs.co",
          website: "https://betalabs.co",
          group_name: "Leads",
          tags: "tech, cold-lead",
          address: "456 Science Dr, Boston, MA",
          company: "Beta Labs",
          job_title: "Lead Engineer",
          notes: "Met at TechConf 2026. Very interested in our API integrations.",
          birthday: "1985-11-22"
        },
        {
          name: "Charlie Brown",
          phone: "+1 (555) 456-7890",
          email: "charlie@gammaventures.com",
          website: "https://gammaventures.com",
          group_name: "Partners",
          tags: "investor, high-priority",
          address: "789 Capital Way, San Francisco, CA",
          company: "Gamma Ventures",
          job_title: "CEO",
          notes: "Looking for a strategic partnership in Q3. Keep updated regularly.",
          birthday: "1978-02-28"
        },
        {
          name: "Diana Prince",
          phone: "+1 (555) 321-7654",
          email: "diana@deltaltd.org",
          website: "https://deltaltd.org",
          group_name: "Customers",
          tags: "active, friendly",
          address: "101 Amazon Pl, Seattle, WA",
          company: "Delta Ltd",
          job_title: "Marketing Director",
          notes: "Regular customer, very happy with services. Loves receiving holiday greeting cards.",
          birthday: "1988-08-18"
        },
        {
          name: "Evan Wright",
          phone: "+1 (555) 654-3210",
          email: "evan@wrightconsulting.net",
          website: "https://wrightconsulting.net",
          group_name: "Consultants",
          tags: "external, contract",
          address: "202 Solo Blvd, Austin, TX",
          company: "Wright Consulting",
          job_title: "Principal Consultant",
          notes: "Helped with our system architecture setup. Key external resource.",
          birthday: "1993-12-05"
        }
      ];
      await syncManager.importContacts(demoContacts, "", []);
      showFeedback("Database has been completely reset and re-seeded with original demo contacts!");
      fetchStats();
      $$props.onDatabaseReset();
    } catch (err) {
      showFeedback("Database reset failed: " + err.message, "error");
    }
  };
  const handleClearDatabase = async () => {
    if (!confirm("CRITICAL WARNING: This will permanently delete ALL contacts and tags in your CRM. This action is irreversible. Proceed?")) {
      return;
    }
    try {
      const contacts = await syncManager.getContacts();
      const ids = contacts.map((c) => c.id).filter((id) => id !== undefined);
      if (ids.length > 0) {
        await syncManager.bulkDelete(ids);
      }
      showFeedback("Database completely wiped! You now have a blank contact book.");
      fetchStats();
      $$props.onDatabaseReset();
    } catch (err) {
      showFeedback("Failed to wipe database: " + err.message, "error");
    }
  };
  next();
  var fragment = root_82();
  var div = sibling(first_child(fragment));
  var node = sibling(child(div));
  {
    var consequent_1 = ($$anchor2) => {
      var fragment_1 = root_125();
      var div_1 = sibling(first_child(fragment_1));
      var node_1 = sibling(child(div_1));
      {
        var consequent = ($$anchor3) => {
          var fragment_2 = root24();
          var node_2 = sibling(first_child(fragment_2));
          check_default(node_2, { class: "h-4 w-4 text-teal-400" });
          next();
          append($$anchor3, fragment_2);
        };
        var alternate = ($$anchor3) => {
          var fragment_3 = root24();
          var node_3 = sibling(first_child(fragment_3));
          triangle_alert_default(node_3, { class: "h-4 w-4 text-rose-400" });
          next();
          append($$anchor3, fragment_3);
        };
        if_block(node_1, ($$render) => {
          if (get2(feedback).type === "success")
            $$render(consequent);
          else
            $$render(alternate, -1);
        });
      }
      var span = sibling(node_1, 2);
      var text2 = child(span, true);
      reset(span);
      next();
      reset(div_1);
      next();
      template_effect(() => {
        set_class(div_1, 1, `fixed bottom-24 left-1/2 -translate-x-1/2 z-50 rounded-full px-5 py-2.5 shadow-2xl flex items-center gap-2 text-xs font-semibold border ${get2(feedback).type === "success" ? "bg-teal-950/90 border-teal-500/50 text-teal-300 backdrop-blur-md" : "bg-rose-950/90 border-rose-500/50 text-rose-300 backdrop-blur-md"}`);
        set_text(text2, get2(feedback).message);
      });
      append($$anchor2, fragment_1);
    };
    if_block(node, ($$render) => {
      if (get2(feedback))
        $$render(consequent_1);
    });
  }
  var div_2 = sibling(node, 2);
  var div_3 = sibling(child(div_2));
  var div_4 = sibling(child(div_3));
  var h3 = sibling(child(div_4));
  var node_4 = sibling(child(h3));
  database_default(node_4, { class: "h-4 w-4 text-teal-400" });
  next(3);
  reset(h3);
  var node_5 = sibling(h3, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment_4 = root_22();
      next(2);
      append($$anchor2, fragment_4);
    };
    var alternate_1 = ($$anchor2) => {
      var fragment_5 = root_32();
      var div_5 = sibling(first_child(fragment_5));
      var div_6 = sibling(child(div_5));
      var span_1 = sibling(child(div_6));
      var text_1 = child(span_1, true);
      reset(span_1);
      var span_2 = sibling(span_1, 2);
      var node_6 = sibling(child(span_2));
      users_default(node_6, { class: "h-3 w-3 text-teal-400" });
      next(3);
      reset(span_2);
      next();
      reset(div_6);
      var div_7 = sibling(div_6, 2);
      var span_3 = sibling(child(div_7));
      var text_2 = child(span_3, true);
      reset(span_3);
      var span_4 = sibling(span_3, 2);
      var node_7 = sibling(child(span_4));
      folder_default(node_7, { class: "h-3 w-3 text-teal-400" });
      next(3);
      reset(span_4);
      next();
      reset(div_7);
      var div_8 = sibling(div_7, 2);
      var span_5 = sibling(child(div_8));
      var text_3 = child(span_5, true);
      reset(span_5);
      var span_6 = sibling(span_5, 2);
      var node_8 = sibling(child(span_6));
      tag_default(node_8, { class: "h-3 w-3 text-teal-400" });
      next(3);
      reset(span_6);
      next();
      reset(div_8);
      next();
      reset(div_5);
      next();
      template_effect(() => {
        set_text(text_1, get2(stats).totalContacts);
        set_text(text_2, get2(stats).totalGroups);
        set_text(text_3, get2(stats).totalTags);
      });
      append($$anchor2, fragment_5);
    };
    if_block(node_5, ($$render) => {
      if (get2(loading))
        $$render(consequent_2);
      else
        $$render(alternate_1, -1);
    });
  }
  next();
  reset(div_4);
  var div_9 = sibling(div_4, 2);
  var node_9 = sibling(child(div_9), 3);
  {
    var consequent_3 = ($$anchor2) => {
      var fragment_6 = root_42();
      next(2);
      append($$anchor2, fragment_6);
    };
    var consequent_4 = ($$anchor2) => {
      var fragment_7 = root_52();
      next(2);
      append($$anchor2, fragment_7);
    };
    var alternate_2 = ($$anchor2) => {
      var fragment_8 = root_72();
      var div_10 = sibling(first_child(fragment_8));
      var node_10 = sibling(child(div_10));
      each(node_10, 17, () => get2(stats).groupDistribution, (group) => group.name, ($$anchor3, group) => {
        next();
        var fragment_9 = root_62();
        var div_11 = sibling(first_child(fragment_9));
        var span_7 = sibling(child(div_11));
        var text_4 = child(span_7, true);
        reset(span_7);
        var span_8 = sibling(span_7, 2);
        var text_5 = child(span_8);
        reset(span_8);
        next();
        reset(div_11);
        next();
        template_effect(() => {
          set_text(text_4, get2(group).name);
          set_text(text_5, `
                  ${get2(group).count ?? ""}
                `);
        });
        append($$anchor3, fragment_9);
      });
      next();
      reset(div_10);
      next();
      append($$anchor2, fragment_8);
    };
    if_block(node_9, ($$render) => {
      if (get2(loading))
        $$render(consequent_3);
      else if (get2(stats).groupDistribution.length === 0)
        $$render(consequent_4, 1);
      else
        $$render(alternate_2, -1);
    });
  }
  next();
  reset(div_9);
  next();
  reset(div_3);
  var div_12 = sibling(div_3, 2);
  var div_13 = sibling(child(div_12));
  var h3_1 = sibling(child(div_13));
  var node_11 = sibling(child(h3_1));
  download_default(node_11, { class: "h-4 w-4 text-teal-400" });
  next(3);
  reset(h3_1);
  var div_14 = sibling(h3_1, 4);
  var button = sibling(child(div_14));
  var node_12 = sibling(child(button));
  file_spreadsheet_default(node_12, { class: "h-4 w-4" });
  next(3);
  reset(button);
  var button_1 = sibling(button, 2);
  var node_13 = sibling(child(button_1));
  download_default(node_13, { class: "h-4 w-4" });
  next(3);
  reset(button_1);
  next();
  reset(div_14);
  next();
  reset(div_13);
  var div_15 = sibling(div_13, 2);
  var h3_2 = sibling(child(div_15));
  var node_14 = sibling(child(h3_2));
  triangle_alert_default(node_14, { class: "h-4 w-4 text-red-400 animate-pulse" });
  next(3);
  reset(h3_2);
  var div_16 = sibling(h3_2, 2);
  var div_17 = sibling(child(div_16));
  var button_2 = sibling(child(div_17), 5);
  var node_15 = sibling(child(button_2));
  refresh_cw_default(node_15, { class: "h-3.5 w-3.5" });
  next(3);
  reset(button_2);
  next();
  reset(div_17);
  var div_18 = sibling(div_17, 2);
  var button_3 = sibling(child(div_18), 5);
  var node_16 = sibling(child(button_3));
  trash_2_default(node_16, { class: "h-3.5 w-3.5" });
  next(3);
  reset(button_3);
  next();
  reset(div_18);
  next();
  reset(div_16);
  next();
  reset(div_15);
  var div_19 = sibling(div_15, 2);
  var node_17 = sibling(child(div_19));
  info_default(node_17, { class: "h-4 w-4 text-teal-400 shrink-0 mt-0.5" });
  next(3);
  reset(div_19);
  next();
  reset(div_12);
  next();
  reset(div_2);
  next();
  reset(div);
  delegated("click", button, handleExportCSV);
  delegated("click", button_1, handleExportVCard);
  delegated("click", button_2, handleResetDatabase);
  delegated("click", button_3, handleClearDatabase);
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var SettingsScreen_default = SettingsScreen;
delegate(["click"]);

// src/App.svelte
var root25 = from_html(`
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold tracking-wider uppercase">
              <!>
              <span>Cloud Synced</span>
            </div>
          `, 1);
var root_127 = from_html(`
            <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-400 font-bold tracking-wider uppercase animate-pulse">
              <!>
              <span>Offline Active</span>
            </div>
          `, 1);
var root_23 = from_html(`
          <span class="text-[10px] bg-teal-500 text-white px-1 py-0.2 rounded-sm font-bold uppercase tracking-wider">
            Sync Now
          </span>
        `, 1);
var root_33 = from_html(`
      <div>
        <!>
        <span> </span>
        <!>
      </div>
    `, 1);
var root_43 = from_html(`
          <button class="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold">
            Sync
          </button>
        `, 1);
var root_53 = from_html(`
      <div class="sm:hidden bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs py-1.5 px-3 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <!>
          <span> </span>
        </div>
        <!>
      </div>
    `, 1);
var root_63 = from_html(`
      <div class="absolute inset-0 flex flex-col h-full">
        <!>
      </div>
    `, 1);
var root_73 = from_html(`

<div class="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans select-none text-slate-100">
  <header class="bg-slate-900/80 backdrop-blur-md px-4 py-3 md:px-6 flex items-center justify-between border-b border-slate-800/80 shrink-0 z-50">
    <div class="flex items-center gap-3">
      <div class="relative flex items-center justify-center bg-gradient-to-tr from-teal-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-teal-500/20">
        <!>
        <span class="absolute -bottom-1 -right-1 bg-white text-teal-600 rounded-full p-0.5 border border-teal-100 shadow-xs">
          <span class="block w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
        </span>
      </div>
      <div>
        <div class="flex items-center gap-1.5">
          <h1 class="text-sm md:text-base font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
            Brain CRM
          </h1>
          <!>
        </div>
        <p class="text-[10px] text-teal-400/80 font-semibold uppercase tracking-widest">
          Fluid Database Environment
        </p>
      </div>
    </div>

    <!>

    <div class="hidden md:block text-xs text-slate-500 font-medium">
      Offline Cache & Cloud Synchronization Active
    </div>
  </header>

  <main class="flex-1 overflow-hidden relative bg-slate-950">
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <!>

    <!>
  </main>

  <nav class="bg-slate-900 border-t border-slate-800/80 py-2.5 px-4 shrink-0 shadow-2xl z-50">
    <div class="max-w-md mx-auto flex justify-around items-center">
      <button id="nav-contacts-btn">
        <!>
        <span class="text-[10px] tracking-wide">Contacts</span>
      </button>

      <button id="nav-import-btn">
        <!>
        <span class="text-[10px] tracking-wide">Import CSV</span>
      </button>

      <button id="nav-settings-btn">
        <!>
        <span class="text-[10px] tracking-wide">Settings</span>
      </button>
    </div>
  </nav>
</div>`, 1);
function App($$anchor, $$props) {
  push($$props, true);
  let currentScreen = state("contacts");
  let isOnline = state(proxy(syncManager.isOnline()));
  let pendingSyncCount = state(proxy(syncManager.getSyncQueue().length));
  let isSyncing = state(false);
  let triggerRefreshStats = state(0);
  let unsubConnection = null;
  let unsubSync = null;
  let timer = null;
  onMount(() => {
    unsubConnection = syncManager.onConnectionChange((online) => {
      set(isOnline, online, true);
      set(pendingSyncCount, syncManager.getSyncQueue().length, true);
    });
    unsubSync = syncManager.onSyncChange(() => {
      set(pendingSyncCount, syncManager.getSyncQueue().length, true);
      update(triggerRefreshStats);
    });
    timer = setInterval(() => {
      set(isOnline, syncManager.isOnline(), true);
      set(pendingSyncCount, syncManager.getSyncQueue().length, true);
    }, 3000);
  });
  onDestroy(() => {
    unsubConnection?.();
    unsubSync?.();
    if (timer)
      clearInterval(timer);
  });
  const handleDatabaseChange = () => {
    update(triggerRefreshStats);
    set(pendingSyncCount, syncManager.getSyncQueue().length, true);
  };
  const triggerManualSync = async () => {
    if (!get2(isOnline))
      return;
    set(isSyncing, true);
    await syncManager.syncNow();
    set(isSyncing, false);
    handleDatabaseChange();
  };
  next();
  var fragment = root_73();
  var div = sibling(first_child(fragment));
  var header = sibling(child(div));
  var div_1 = sibling(child(header));
  var div_2 = sibling(child(div_1));
  var node = sibling(child(div_2));
  brain_default(node, { class: "h-5 w-5 text-white" });
  next(3);
  reset(div_2);
  var div_3 = sibling(div_2, 2);
  var div_4 = sibling(child(div_3));
  var node_1 = sibling(child(div_4), 3);
  {
    var consequent = ($$anchor2) => {
      var fragment_1 = root25();
      var div_5 = sibling(first_child(fragment_1));
      var node_2 = sibling(child(div_5));
      wifi_default(node_2, { class: "h-2.5 w-2.5" });
      next(3);
      reset(div_5);
      next();
      append($$anchor2, fragment_1);
    };
    var alternate = ($$anchor2) => {
      var fragment_2 = root_127();
      var div_6 = sibling(first_child(fragment_2));
      var node_3 = sibling(child(div_6));
      wifi_off_default(node_3, { class: "h-2.5 w-2.5" });
      next(3);
      reset(div_6);
      next();
      append($$anchor2, fragment_2);
    };
    if_block(node_1, ($$render) => {
      if (get2(isOnline))
        $$render(consequent);
      else
        $$render(alternate, -1);
    });
  }
  next();
  reset(div_4);
  next(3);
  reset(div_3);
  next();
  reset(div_1);
  var node_4 = sibling(div_1, 2);
  {
    var consequent_2 = ($$anchor2) => {
      var fragment_3 = root_33();
      var div_7 = sibling(first_child(fragment_3));
      var node_5 = sibling(child(div_7));
      {
        let $0 = user_derived(() => "h-3 w-3 " + (get2(isSyncing) ? "animate-spin" : ""));
        refresh_cw_default(node_5, {
          get class() {
            return get2($0);
          }
        });
      }
      var span = sibling(node_5, 2);
      var text2 = child(span);
      reset(span);
      var node_6 = sibling(span, 2);
      {
        var consequent_1 = ($$anchor3) => {
          var fragment_4 = root_23();
          next(2);
          append($$anchor3, fragment_4);
        };
        if_block(node_6, ($$render) => {
          if (get2(isOnline))
            $$render(consequent_1);
        });
      }
      next();
      reset(div_7);
      next();
      template_effect(() => {
        set_class(div_7, 1, "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all hover:bg-slate-800 " + (get2(isOnline) ? "bg-teal-500/10 border-teal-500/30 text-teal-300" : "bg-amber-500/10 border-amber-500/30 text-amber-300"));
        set_attribute2(div_7, "title", get2(isOnline) ? "Click to trigger manual server sync" : "Offline. Queue will auto-sync when online.");
        set_text(text2, `
          ${get2(pendingSyncCount) ?? ""} pending change${get2(pendingSyncCount) > 1 ? "s" : ""}
        `);
      });
      delegated("click", div_7, triggerManualSync);
      append($$anchor2, fragment_3);
    };
    if_block(node_4, ($$render) => {
      if (get2(pendingSyncCount) > 0)
        $$render(consequent_2);
    });
  }
  next(3);
  reset(header);
  var main = sibling(header, 2);
  var node_7 = sibling(child(main), 5);
  {
    var consequent_4 = ($$anchor2) => {
      var fragment_5 = root_53();
      var div_8 = sibling(first_child(fragment_5));
      var div_9 = sibling(child(div_8));
      var node_8 = sibling(child(div_9));
      refresh_cw_default(node_8, { class: "h-3 w-3 animate-spin" });
      var span_1 = sibling(node_8, 2);
      var text_1 = child(span_1);
      reset(span_1);
      next();
      reset(div_9);
      var node_9 = sibling(div_9, 2);
      {
        var consequent_3 = ($$anchor3) => {
          var fragment_6 = root_43();
          var button = sibling(first_child(fragment_6));
          next();
          delegated("click", button, triggerManualSync);
          append($$anchor3, fragment_6);
        };
        if_block(node_9, ($$render) => {
          if (get2(isOnline))
            $$render(consequent_3);
        });
      }
      next();
      reset(div_8);
      next();
      template_effect(() => set_text(text_1, `${get2(pendingSyncCount) ?? ""} offline modification${get2(pendingSyncCount) > 1 ? "s" : ""} queued`));
      append($$anchor2, fragment_5);
    };
    if_block(node_7, ($$render) => {
      if (get2(pendingSyncCount) > 0)
        $$render(consequent_4);
    });
  }
  var node_10 = sibling(node_7, 2);
  {
    var consequent_5 = ($$anchor2) => {
      var fragment_7 = root_63();
      var div_10 = sibling(first_child(fragment_7));
      var node_11 = sibling(child(div_10));
      ContactsScreen_default(node_11, { onContactsChange: handleDatabaseChange });
      next();
      reset(div_10);
      next();
      append($$anchor2, fragment_7);
    };
    var consequent_6 = ($$anchor2) => {
      var fragment_8 = root_63();
      var div_11 = sibling(first_child(fragment_8));
      var node_12 = sibling(child(div_11));
      ImportScreen_default(node_12, { onImportSuccess: () => set(currentScreen, "contacts") });
      next();
      reset(div_11);
      next();
      append($$anchor2, fragment_8);
    };
    var consequent_7 = ($$anchor2) => {
      var fragment_9 = root_63();
      var div_12 = sibling(first_child(fragment_9));
      var node_13 = sibling(child(div_12));
      SettingsScreen_default(node_13, {
        onDatabaseReset: handleDatabaseChange,
        get triggerRefreshStats() {
          return get2(triggerRefreshStats);
        }
      });
      next();
      reset(div_12);
      next();
      append($$anchor2, fragment_9);
    };
    if_block(node_10, ($$render) => {
      if (get2(currentScreen) === "contacts")
        $$render(consequent_5);
      else if (get2(currentScreen) === "import")
        $$render(consequent_6, 1);
      else if (get2(currentScreen) === "settings")
        $$render(consequent_7, 2);
    });
  }
  next();
  reset(main);
  var nav = sibling(main, 2);
  var div_13 = sibling(child(nav));
  var button_1 = sibling(child(div_13));
  var node_14 = sibling(child(button_1));
  {
    let $0 = user_derived(() => "h-5 w-5 transition-transform " + (get2(currentScreen) === "contacts" ? "stroke-[2.5px]" : ""));
    users_default(node_14, {
      get class() {
        return get2($0);
      }
    });
  }
  next(3);
  reset(button_1);
  var button_2 = sibling(button_1, 2);
  var node_15 = sibling(child(button_2));
  {
    let $0 = user_derived(() => "h-5 w-5 transition-transform " + (get2(currentScreen) === "import" ? "stroke-[2.5px]" : ""));
    upload_default(node_15, {
      get class() {
        return get2($0);
      }
    });
  }
  next(3);
  reset(button_2);
  var button_3 = sibling(button_2, 2);
  var node_16 = sibling(child(button_3));
  {
    let $0 = user_derived(() => "h-5 w-5 transition-transform " + (get2(currentScreen) === "settings" ? "stroke-[2.5px]" : ""));
    settings_default(node_16, {
      get class() {
        return get2($0);
      }
    });
  }
  next(3);
  reset(button_3);
  next();
  reset(div_13);
  next();
  reset(nav);
  next();
  reset(div);
  template_effect(() => {
    set_class(button_1, 1, "flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (get2(currentScreen) === "contacts" ? "text-teal-400 scale-105 font-bold" : "text-slate-400 hover:text-slate-200"));
    set_class(button_2, 1, "flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (get2(currentScreen) === "import" ? "text-teal-400 scale-105 font-bold" : "text-slate-400 hover:text-slate-200"));
    set_class(button_3, 1, "flex flex-col items-center gap-1 transition-all duration-200 group cursor-pointer " + (get2(currentScreen) === "settings" ? "text-teal-400 scale-105 font-bold" : "text-slate-400 hover:text-slate-200"));
  });
  delegated("click", button_1, () => set(currentScreen, "contacts"));
  delegated("click", button_2, () => set(currentScreen, "import"));
  delegated("click", button_3, () => set(currentScreen, "settings"));
  append($$anchor, fragment);
  pop();
}
if (undefined) {}
var App_default = App;
delegate(["click"]);

// src/main.ts
var app = mount(App_default, {
  target: document.getElementById("root")
});
var main_default = app;
export {
  main_default as default
};
