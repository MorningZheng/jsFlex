/**
 * Created by morning on 2017/6/17.
 */
(function () {
    var ALPHA_CHAR_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70];
    var mx='mx_internal_uid';
    var $r=/[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}/;
    $package('mx.utils')
        .class('UIDUtil')
        .static({
            createUID:function () {
                var uid = new Array(36);
                var index = 0;

                var i;
                var j;

                for (i = 0; i < 8; i++) {
                    uid[index++] = ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
                }

                for (i = 0; i < 3; i++) {
                    uid[index++] = 45; // charCode for "-"
                    for (j = 0; j < 4; j++) {
                        uid[index++] = ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
                    };
                };

                uid[index++] = 45; // charCode for "-"

                var time = new Date().getTime();
                var timeString = ("0000000" + time.toString(16).toUpperCase()).substr(-8);

                for (i = 0; i < 8; i++) {
                    uid[index++] = timeString.charCodeAt(i);
                }

                for (i = 0; i < 4; i++) {
                    uid[index++] = ALPHA_CHAR_CODES[Math.floor(Math.random() *  16)];
                }

                return String.fromCharCode.apply(null, uid);
            },
            isUID:function (uid) {
                return $r.test(uid);
            },
            getUID:function(item){
                if(item){
                    if(item.hasOwnProperty(mx)===true){
                        return item[mx];
                    }else{
                        return null;
                    };
                }else{
                    return null;
                };
            },
        });
})();


(function () {
    'use strict';
    $package('mx.utils')
        .class('flex')
        .static((function () {
            'use strict';

            document.query=function (somthing) {
                var $=[];
                Array.prototype.forEach.call(document.querySelectorAll(somthing),function (_) {
                    $.push(_.hasOwnProperty('flexElementInstance')===true?_.flexElementInstance:_);
                });
                return $;
            };

            var exports={};
            ;(function (sax) { // wrapper for non-node envs
                sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
                sax.SAXParser = SAXParser
                sax.SAXStream = SAXStream
                sax.createStream = createStream

                // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
                // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
                // since that's the earliest that a buffer overrun could occur.  This way, checks are
                // as rare as required, but as often as necessary to ensure never crossing this bound.
                // Furthermore, buffers are only tested at most once per write(), so passing a very
                // large string into write() might have undesirable effects, but this is manageable by
                // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
                // edge case, result in creating at most one complete copy of the string passed in.
                // Set to Infinity to have unlimited buffers.
                sax.MAX_BUFFER_LENGTH = 64 * 1024

                var buffers = [
                    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
                    'procInstName', 'procInstBody', 'entity', 'attribName',
                    'attribValue', 'cdata', 'script'
                ]

                sax.EVENTS = [
                    'text',
                    'processinginstruction',
                    'sgmldeclaration',
                    'doctype',
                    'comment',
                    'opentagstart',
                    'attribute',
                    'opentag',
                    'closetag',
                    'opencdata',
                    'cdata',
                    'closecdata',
                    'error',
                    'end',
                    'ready',
                    'script',
                    'opennamespace',
                    'closenamespace'
                ]

                function SAXParser (strict, opt) {
                    if (!(this instanceof SAXParser)) {
                        return new SAXParser(strict, opt)
                    }

                    var parser = this
                    clearBuffers(parser)
                    parser.q = parser.c = ''
                    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
                    parser.opt = opt || {}
                    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
                    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
                    parser.tags = []
                    parser.closed = parser.closedRoot = parser.sawRoot = false
                    parser.tag = parser.error = null
                    parser.strict = !!strict
                    parser.noscript = !!(strict || parser.opt.noscript)
                    parser.state = S.BEGIN
                    parser.strictEntities = parser.opt.strictEntities
                    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
                    parser.attribList = []

                    // namespaces form a prototype chain.
                    // it always points at the current tag,
                    // which protos to its parent tag.
                    if (parser.opt.xmlns) {
                        parser.ns = Object.create(rootNS)
                    }

                    // mostly just for error reporting
                    parser.trackPosition = parser.opt.position !== false
                    if (parser.trackPosition) {
                        parser.position = parser.line = parser.column = 0
                    }
                    emit(parser, 'onready')
                }

                if (!Object.create) {
                    Object.create = function (o) {
                        function F () {}
                        F.prototype = o
                        var newf = new F()
                        return newf
                    }
                }

                if (!Object.keys) {
                    Object.keys = function (o) {
                        var a = []
                        for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
                        return a
                    }
                }

                function checkBufferLength (parser) {
                    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
                    var maxActual = 0
                    for (var i = 0, l = buffers.length; i < l; i++) {
                        var len = parser[buffers[i]].length
                        if (len > maxAllowed) {
                            // Text/cdata nodes can get big, and since they're buffered,
                            // we can get here under normal conditions.
                            // Avoid issues by emitting the text node now,
                            // so at least it won't get any bigger.
                            switch (buffers[i]) {
                                case 'textNode':
                                    closeText(parser)
                                    break

                                case 'cdata':
                                    emitNode(parser, 'oncdata', parser.cdata)
                                    parser.cdata = ''
                                    break

                                case 'script':
                                    emitNode(parser, 'onscript', parser.script)
                                    parser.script = ''
                                    break

                                default:
                                    error(parser, 'Max buffer length exceeded: ' + buffers[i])
                            }
                        }
                        maxActual = Math.max(maxActual, len)
                    }
                    // schedule the next check for the earliest possible buffer overrun.
                    var m = sax.MAX_BUFFER_LENGTH - maxActual
                    parser.bufferCheckPosition = m + parser.position
                }

                function clearBuffers (parser) {
                    for (var i = 0, l = buffers.length; i < l; i++) {
                        parser[buffers[i]] = ''
                    }
                }

                function flushBuffers (parser) {
                    closeText(parser)
                    if (parser.cdata !== '') {
                        emitNode(parser, 'oncdata', parser.cdata)
                        parser.cdata = ''
                    }
                    if (parser.script !== '') {
                        emitNode(parser, 'onscript', parser.script)
                        parser.script = ''
                    }
                }

                SAXParser.prototype = {
                    end: function () { end(this) },
                    write: write,
                    resume: function () { this.error = null; return this },
                    close: function () { return this.write(null) },
                    flush: function () { flushBuffers(this) }
                }

                var Stream
                try {
                    Stream = require('stream').Stream
                } catch (ex) {
                    Stream = function () {}
                }

                var streamWraps = sax.EVENTS.filter(function (ev) {
                    return ev !== 'error' && ev !== 'end'
                })

                function createStream (strict, opt) {
                    return new SAXStream(strict, opt)
                }

                function SAXStream (strict, opt) {
                    if (!(this instanceof SAXStream)) {
                        return new SAXStream(strict, opt)
                    }

                    Stream.apply(this)

                    this._parser = new SAXParser(strict, opt)
                    this.writable = true
                    this.readable = true

                    var me = this

                    this._parser.onend = function () {
                        me.emit('end')
                    }

                    this._parser.onerror = function (er) {
                        me.emit('error', er)

                        // if didn't throw, then means error was handled.
                        // go ahead and clear error, so we can write again.
                        me._parser.error = null
                    }

                    this._decoder = null

                    streamWraps.forEach(function (ev) {
                        Object.defineProperty(me, 'on' + ev, {
                            get: function () {
                                return me._parser['on' + ev]
                            },
                            set: function (h) {
                                if (!h) {
                                    me.removeAllListeners(ev)
                                    me._parser['on' + ev] = h
                                    return h
                                }
                                me.on(ev, h)
                            },
                            enumerable: true,
                            configurable: false
                        })
                    })
                }

                SAXStream.prototype = Object.create(Stream.prototype, {
                    constructor: {
                        value: SAXStream
                    }
                })

                SAXStream.prototype.write = function (data) {
                    if (typeof Buffer === 'function' &&
                        typeof Buffer.isBuffer === 'function' &&
                        Buffer.isBuffer(data)) {
                        if (!this._decoder) {
                            var SD = require('string_decoder').StringDecoder
                            this._decoder = new SD('utf8')
                        }
                        data = this._decoder.write(data)
                    }

                    this._parser.write(data.toString())
                    this.emit('data', data)
                    return true
                }

                SAXStream.prototype.end = function (chunk) {
                    if (chunk && chunk.length) {
                        this.write(chunk)
                    }
                    this._parser.end()
                    return true
                }

                SAXStream.prototype.on = function (ev, handler) {
                    var me = this
                    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
                        me._parser['on' + ev] = function () {
                            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
                            args.splice(0, 0, ev)
                            me.emit.apply(me, args)
                        }
                    }

                    return Stream.prototype.on.call(me, ev, handler)
                }

                // character classes and tokens
                var whitespace = '\r\n\t '

                // this really needs to be replaced with character classes.
                // XML allows all manner of ridiculous numbers and digits.

                // (Letter | "_" | ":")
                var quote = '\'"'
                var attribEnd = whitespace + '>'
                var CDATA = '[CDATA['
                var DOCTYPE = 'DOCTYPE'
                var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
                var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
                var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

                // turn all the string character sets into character class objects.
                whitespace = charClass(whitespace)

                // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
                // This implementation works on strings, a single character at a time
                // as such, it cannot ever support astral-plane characters (10000-EFFFF)
                // without a significant breaking change to either this  parser, or the
                // JavaScript language.  Implementation of an emoji-capable xml parser
                // is left as an exercise for the reader.
                var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

                var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

                var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
                var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

                quote = charClass(quote)
                attribEnd = charClass(attribEnd)

                function charClass (str) {
                    return str.split('').reduce(function (s, c) {
                        s[c] = true
                        return s
                    }, {})
                }

                function isMatch (regex, c) {
                    return regex.test(c)
                }

                function is (charclass, c) {
                    return charclass[c]
                }

                function notMatch (regex, c) {
                    return !isMatch(regex, c)
                }

                function not (charclass, c) {
                    return !is(charclass, c)
                }

                var S = 0
                sax.STATE = {
                    BEGIN: S++, // leading byte order mark or whitespace
                    BEGIN_WHITESPACE: S++, // leading whitespace
                    TEXT: S++, // general stuff
                    TEXT_ENTITY: S++, // &amp and such.
                    OPEN_WAKA: S++, // <
                    SGML_DECL: S++, // <!BLARG
                    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
                    DOCTYPE: S++, // <!DOCTYPE
                    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
                    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
                    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
                    COMMENT_STARTING: S++, // <!-
                    COMMENT: S++, // <!--
                    COMMENT_ENDING: S++, // <!-- blah -
                    COMMENT_ENDED: S++, // <!-- blah --
                    CDATA: S++, // <![CDATA[ something
                    CDATA_ENDING: S++, // ]
                    CDATA_ENDING_2: S++, // ]]
                    PROC_INST: S++, // <?hi
                    PROC_INST_BODY: S++, // <?hi there
                    PROC_INST_ENDING: S++, // <?hi "there" ?
                    OPEN_TAG: S++, // <strong
                    OPEN_TAG_SLASH: S++, // <strong /
                    ATTRIB: S++, // <a
                    ATTRIB_NAME: S++, // <a foo
                    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
                    ATTRIB_VALUE: S++, // <a foo=
                    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
                    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
                    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
                    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
                    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
                    CLOSE_TAG: S++, // </a
                    CLOSE_TAG_SAW_WHITE: S++, // </a   >
                    SCRIPT: S++, // <script> ...
                    SCRIPT_ENDING: S++ // <script> ... <
                }

                sax.XML_ENTITIES = {
                    'amp': '&',
                    'gt': '>',
                    'lt': '<',
                    'quot': '"',
                    'apos': "'"
                }

                sax.ENTITIES = {
                    'amp': '&',
                    'gt': '>',
                    'lt': '<',
                    'quot': '"',
                    'apos': "'",
                    'AElig': 198,
                    'Aacute': 193,
                    'Acirc': 194,
                    'Agrave': 192,
                    'Aring': 197,
                    'Atilde': 195,
                    'Auml': 196,
                    'Ccedil': 199,
                    'ETH': 208,
                    'Eacute': 201,
                    'Ecirc': 202,
                    'Egrave': 200,
                    'Euml': 203,
                    'Iacute': 205,
                    'Icirc': 206,
                    'Igrave': 204,
                    'Iuml': 207,
                    'Ntilde': 209,
                    'Oacute': 211,
                    'Ocirc': 212,
                    'Ograve': 210,
                    'Oslash': 216,
                    'Otilde': 213,
                    'Ouml': 214,
                    'THORN': 222,
                    'Uacute': 218,
                    'Ucirc': 219,
                    'Ugrave': 217,
                    'Uuml': 220,
                    'Yacute': 221,
                    'aacute': 225,
                    'acirc': 226,
                    'aelig': 230,
                    'agrave': 224,
                    'aring': 229,
                    'atilde': 227,
                    'auml': 228,
                    'ccedil': 231,
                    'eacute': 233,
                    'ecirc': 234,
                    'egrave': 232,
                    'eth': 240,
                    'euml': 235,
                    'iacute': 237,
                    'icirc': 238,
                    'igrave': 236,
                    'iuml': 239,
                    'ntilde': 241,
                    'oacute': 243,
                    'ocirc': 244,
                    'ograve': 242,
                    'oslash': 248,
                    'otilde': 245,
                    'ouml': 246,
                    'szlig': 223,
                    'thorn': 254,
                    'uacute': 250,
                    'ucirc': 251,
                    'ugrave': 249,
                    'uuml': 252,
                    'yacute': 253,
                    'yuml': 255,
                    'copy': 169,
                    'reg': 174,
                    'nbsp': 160,
                    'iexcl': 161,
                    'cent': 162,
                    'pound': 163,
                    'curren': 164,
                    'yen': 165,
                    'brvbar': 166,
                    'sect': 167,
                    'uml': 168,
                    'ordf': 170,
                    'laquo': 171,
                    'not': 172,
                    'shy': 173,
                    'macr': 175,
                    'deg': 176,
                    'plusmn': 177,
                    'sup1': 185,
                    'sup2': 178,
                    'sup3': 179,
                    'acute': 180,
                    'micro': 181,
                    'para': 182,
                    'middot': 183,
                    'cedil': 184,
                    'ordm': 186,
                    'raquo': 187,
                    'frac14': 188,
                    'frac12': 189,
                    'frac34': 190,
                    'iquest': 191,
                    'times': 215,
                    'divide': 247,
                    'OElig': 338,
                    'oelig': 339,
                    'Scaron': 352,
                    'scaron': 353,
                    'Yuml': 376,
                    'fnof': 402,
                    'circ': 710,
                    'tilde': 732,
                    'Alpha': 913,
                    'Beta': 914,
                    'Gamma': 915,
                    'Delta': 916,
                    'Epsilon': 917,
                    'Zeta': 918,
                    'Eta': 919,
                    'Theta': 920,
                    'Iota': 921,
                    'Kappa': 922,
                    'Lambda': 923,
                    'Mu': 924,
                    'Nu': 925,
                    'Xi': 926,
                    'Omicron': 927,
                    'Pi': 928,
                    'Rho': 929,
                    'Sigma': 931,
                    'Tau': 932,
                    'Upsilon': 933,
                    'Phi': 934,
                    'Chi': 935,
                    'Psi': 936,
                    'Omega': 937,
                    'alpha': 945,
                    'beta': 946,
                    'gamma': 947,
                    'delta': 948,
                    'epsilon': 949,
                    'zeta': 950,
                    'eta': 951,
                    'theta': 952,
                    'iota': 953,
                    'kappa': 954,
                    'lambda': 955,
                    'mu': 956,
                    'nu': 957,
                    'xi': 958,
                    'omicron': 959,
                    'pi': 960,
                    'rho': 961,
                    'sigmaf': 962,
                    'sigma': 963,
                    'tau': 964,
                    'upsilon': 965,
                    'phi': 966,
                    'chi': 967,
                    'psi': 968,
                    'omega': 969,
                    'thetasym': 977,
                    'upsih': 978,
                    'piv': 982,
                    'ensp': 8194,
                    'emsp': 8195,
                    'thinsp': 8201,
                    'zwnj': 8204,
                    'zwj': 8205,
                    'lrm': 8206,
                    'rlm': 8207,
                    'ndash': 8211,
                    'mdash': 8212,
                    'lsquo': 8216,
                    'rsquo': 8217,
                    'sbquo': 8218,
                    'ldquo': 8220,
                    'rdquo': 8221,
                    'bdquo': 8222,
                    'dagger': 8224,
                    'Dagger': 8225,
                    'bull': 8226,
                    'hellip': 8230,
                    'permil': 8240,
                    'prime': 8242,
                    'Prime': 8243,
                    'lsaquo': 8249,
                    'rsaquo': 8250,
                    'oline': 8254,
                    'frasl': 8260,
                    'euro': 8364,
                    'image': 8465,
                    'weierp': 8472,
                    'real': 8476,
                    'trade': 8482,
                    'alefsym': 8501,
                    'larr': 8592,
                    'uarr': 8593,
                    'rarr': 8594,
                    'darr': 8595,
                    'harr': 8596,
                    'crarr': 8629,
                    'lArr': 8656,
                    'uArr': 8657,
                    'rArr': 8658,
                    'dArr': 8659,
                    'hArr': 8660,
                    'forall': 8704,
                    'part': 8706,
                    'exist': 8707,
                    'empty': 8709,
                    'nabla': 8711,
                    'isin': 8712,
                    'notin': 8713,
                    'ni': 8715,
                    'prod': 8719,
                    'sum': 8721,
                    'minus': 8722,
                    'lowast': 8727,
                    'radic': 8730,
                    'prop': 8733,
                    'infin': 8734,
                    'ang': 8736,
                    'and': 8743,
                    'or': 8744,
                    'cap': 8745,
                    'cup': 8746,
                    'int': 8747,
                    'there4': 8756,
                    'sim': 8764,
                    'cong': 8773,
                    'asymp': 8776,
                    'ne': 8800,
                    'equiv': 8801,
                    'le': 8804,
                    'ge': 8805,
                    'sub': 8834,
                    'sup': 8835,
                    'nsub': 8836,
                    'sube': 8838,
                    'supe': 8839,
                    'oplus': 8853,
                    'otimes': 8855,
                    'perp': 8869,
                    'sdot': 8901,
                    'lceil': 8968,
                    'rceil': 8969,
                    'lfloor': 8970,
                    'rfloor': 8971,
                    'lang': 9001,
                    'rang': 9002,
                    'loz': 9674,
                    'spades': 9824,
                    'clubs': 9827,
                    'hearts': 9829,
                    'diams': 9830
                }

                Object.keys(sax.ENTITIES).forEach(function (key) {
                    var e = sax.ENTITIES[key]
                    var s = typeof e === 'number' ? String.fromCharCode(e) : e
                    sax.ENTITIES[key] = s
                })

                for (var s in sax.STATE) {
                    sax.STATE[sax.STATE[s]] = s
                }

                // shorthand
                S = sax.STATE

                function emit (parser, event, data) {
                    parser[event] && parser[event](data,parser.tag);
                }

                function emitNode (parser, nodeType, data) {
                    if (parser.textNode) closeText(parser)
                    emit(parser, nodeType, data)
                }

                function closeText (parser) {
                    parser.textNode = textopts(parser.opt, parser.textNode)
                    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
                    parser.textNode = ''
                }

                function textopts (opt, text) {
                    if (opt.trim) text = text.trim()
                    if (opt.normalize) text = text.replace(/\s+/g, ' ')
                    return text
                }

                function error (parser, er) {
                    closeText(parser)
                    if (parser.trackPosition) {
                        er += '\nLine: ' + parser.line +
                            '\nColumn: ' + parser.column +
                            '\nChar: ' + parser.c
                    }
                    er = new Error(er)
                    parser.error = er
                    emit(parser, 'onerror', er)
                    return parser
                }

                function end (parser) {
                    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
                    if ((parser.state !== S.BEGIN) &&
                        (parser.state !== S.BEGIN_WHITESPACE) &&
                        (parser.state !== S.TEXT)) {
                        error(parser, 'Unexpected end')
                    }
                    closeText(parser)
                    parser.c = ''
                    parser.closed = true
                    emit(parser, 'onend')
                    SAXParser.call(parser, parser.strict, parser.opt)
                    return parser
                }

                function strictFail (parser, message) {
                    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
                        throw new Error('bad call to strictFail')
                    }
                    if (parser.strict) {
                        error(parser, message)
                    }
                }

                function newTag (parser) {
                    parser.nodeName=parser.tagName;
                    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
                    var parent = parser.tags[parser.tags.length - 1] || parser;
                    var tag = parser.tag = { name: parser.tagName, attributes: {},nodeName:parser.nodeName};

                    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
                    if (parser.opt.xmlns) tag.ns = parent.ns;
                    parser.attribList.length = 0;
                    emitNode(parser, 'onopentagstart', tag);
                }

                function qname (name, attribute) {
                    var i = name.indexOf(':')
                    var qualName = i < 0 ? [ '', name ] : name.split(':')
                    var prefix = qualName[0]
                    var local = qualName[1]

                    // <x "xmlns"="http://foo">
                    if (attribute && name === 'xmlns') {
                        prefix = 'xmlns'
                        local = ''
                    }

                    return { prefix: prefix, local: local }
                }

                function attrib (parser) {
                    // if (!parser.strict) {
                    //     parser.attribName = parser.attribName[parser.looseCase]()
                    // }

                    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
                        parser.tag.attributes.hasOwnProperty(parser.attribName)) {
                        parser.attribName = parser.attribValue = ''
                        return
                    }

                    if (parser.opt.xmlns) {
                        var qn = qname(parser.attribName, true)
                        var prefix = qn.prefix
                        var local = qn.local

                        if (prefix === 'xmlns') {
                            // namespace binding attribute. push the binding into scope
                            if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
                                strictFail(parser,
                                    'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
                                    'Actual: ' + parser.attribValue)
                            } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
                                strictFail(parser,
                                    'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
                                    'Actual: ' + parser.attribValue)
                            } else {
                                var tag = parser.tag
                                var parent = parser.tags[parser.tags.length - 1] || parser
                                if (tag.ns === parent.ns) {
                                    tag.ns = Object.create(parent.ns)
                                }
                                tag.ns[local] = parser.attribValue
                            }
                        }

                        // defer onattribute events until all attributes have been seen
                        // so any new bindings can take effect. preserve attribute order
                        // so deferred events can be emitted in document order
                        parser.attribList.push([parser.attribName, parser.attribValue])
                    } else {
                        // in non-xmlns mode, we can emit the event right away
                        parser.tag.attributes[parser.attribName] = parser.attribValue;
                        emitNode(parser, 'onattribute', {
                            name: parser.attribName,
                            value: parser.attribValue
                        })
                    }

                    parser.attribName = parser.attribValue = ''
                }

                function openTag (parser, selfClosing) {
                    if (parser.opt.xmlns) {
                        // emit namespace binding events
                        var tag = parser.tag

                        // add namespace info to tag
                        var qn = qname(parser.tagName)
                        tag.prefix = qn.prefix
                        tag.local = qn.local
                        tag.uri = tag.ns[qn.prefix] || ''

                        if (tag.prefix && !tag.uri) {
                            strictFail(parser, 'Unbound namespace prefix: ' +
                                JSON.stringify(parser.tagName))
                            tag.uri = qn.prefix
                        }

                        var parent = parser.tags[parser.tags.length - 1] || parser
                        if (tag.ns && parent.ns !== tag.ns) {
                            Object.keys(tag.ns).forEach(function (p) {
                                emitNode(parser, 'onopennamespace', {
                                    prefix: p,
                                    uri: tag.ns[p]
                                })
                            })
                        }

                        // handle deferred onattribute events
                        // Note: do not apply default ns to attributes:
                        //   http://www.w3.org/TR/REC-xml-names/#defaulting
                        for (var i = 0, l = parser.attribList.length; i < l; i++) {
                            var nv = parser.attribList[i]
                            var name = nv[0]
                            var value = nv[1]
                            var qualName = qname(name, true)
                            var prefix = qualName.prefix
                            var local = qualName.local
                            var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
                            var a = {
                                name: name,
                                value: value,
                                prefix: prefix,
                                local: local,
                                uri: uri
                            }

                            // if there's any attributes with an undefined namespace,
                            // then fail on them now.
                            if (prefix && prefix !== 'xmlns' && !uri) {
                                strictFail(parser, 'Unbound namespace prefix: ' +
                                    JSON.stringify(prefix))
                                a.uri = prefix
                            }
                            parser.tag.attributes[name] = a
                            emitNode(parser, 'onattribute', a)
                        }
                        parser.attribList.length = 0
                    }


                    if(parser.opt.hasOwnProperty('selfClosingTags')&&parser.opt.selfClosingTags.hasOwnProperty(parser.tagName.toUpperCase()))selfClosing=true;
                    parser.tag.isSelfClosing = !!selfClosing;

                    // process the tag
                    parser.sawRoot = true
                    parser.tags.push(parser.tag)
                    emitNode(parser, 'onopentag', parser.tag)
                    if (!selfClosing) {
                        // special case for <script> in non-strict mode.
                        if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
                            parser.state = S.SCRIPT
                        } else {
                            parser.state = S.TEXT
                        }
                        parser.tag = null
                        parser.tagName = ''
                    }else{
                        closeTag(parser);
                    };
                    parser.attribName = parser.attribValue = ''
                    parser.attribList.length = 0
                }

                function closeTag (parser) {
                    if (!parser.tagName) {
                        strictFail(parser, 'Weird empty close tag.')
                        parser.textNode += '</>'
                        parser.state = S.TEXT
                        return
                    }

                    if (parser.script) {
                        if (parser.tagName !== 'script') {
                            parser.script += '</' + parser.tagName + '>'
                            parser.tagName = ''
                            parser.state = S.SCRIPT
                            return
                        }
                        emitNode(parser, 'onscript', parser.script)
                        parser.script = ''
                    }

                    // first make sure that the closing tag actually exists.
                    // <a><b></c></b></a> will close everything, otherwise.
                    var t = parser.tags.length
                    var tagName = parser.tagName
                    if (!parser.strict) {
                        tagName = tagName[parser.looseCase]()
                    }
                    var closeTo = tagName
                    while (t--) {
                        var close = parser.tags[t]
                        if (close.name !== closeTo) {
                            // fail the first time in strict mode
                            strictFail(parser, 'Unexpected close tag')
                        } else {
                            break
                        }
                    }

                    // didn't find it.  we already failed for strict, so just abort.
                    if (t < 0) {
                        strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
                        parser.textNode += '</' + parser.tagName + '>'
                        parser.state = S.TEXT
                        return
                    }
                    parser.tagName = tagName
                    var s = parser.tags.length
                    while (s-- > t) {
                        var tag = parser.tag = parser.tags.pop()
                        parser.tagName = parser.tag.name
                        emitNode(parser, 'onclosetag', parser.tagName)

                        var x = {}
                        for (var i in tag.ns) {
                            x[i] = tag.ns[i]
                        }

                        var parent = parser.tags[parser.tags.length - 1] || parser
                        if (parser.opt.xmlns && tag.ns !== parent.ns) {
                            // remove namespace bindings introduced by tag
                            Object.keys(tag.ns).forEach(function (p) {
                                var n = tag.ns[p]
                                emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
                            })
                        }
                    }
                    if (t === 0) parser.closedRoot = true
                    parser.tagName = parser.attribValue = parser.attribName = ''
                    parser.attribList.length = 0
                    parser.state = S.TEXT
                }

                function parseEntity (parser) {
                    var entity = parser.entity
                    var entityLC = entity.toLowerCase()
                    var num
                    var numStr = ''

                    if (parser.ENTITIES[entity]) {
                        return parser.ENTITIES[entity]
                    }
                    if (parser.ENTITIES[entityLC]) {
                        return parser.ENTITIES[entityLC]
                    }
                    entity = entityLC
                    if (entity.charAt(0) === '#') {
                        if (entity.charAt(1) === 'x') {
                            entity = entity.slice(2)
                            num = parseInt(entity, 16)
                            numStr = num.toString(16)
                        } else {
                            entity = entity.slice(1)
                            num = parseInt(entity, 10)
                            numStr = num.toString(10)
                        }
                    }
                    entity = entity.replace(/^0+/, '')
                    if (numStr.toLowerCase() !== entity) {
                        strictFail(parser, 'Invalid character entity')
                        return '&' + parser.entity + ';'
                    }

                    return String.fromCodePoint(num)
                }

                function beginWhiteSpace (parser, c) {
                    if (c === '<') {
                        parser.state = S.OPEN_WAKA
                        parser.startTagPosition = parser.position
                    } else if (not(whitespace, c)) {
                        // have to process this as a text node.
                        // weird, but happens.
                        strictFail(parser, 'Non-whitespace before first tag.')
                        parser.textNode = c
                        parser.state = S.TEXT
                    }
                }

                function charAt (chunk, i) {
                    var result = ''
                    if (i < chunk.length) {
                        result = chunk.charAt(i)
                    }
                    return result
                }

                function write (chunk) {
                    var parser = this
                    if (this.error) {
                        throw this.error
                    }
                    if (parser.closed) {
                        return error(parser,
                            'Cannot write after close. Assign an onready handler.')
                    }
                    if (chunk === null) {
                        return end(parser)
                    }
                    if (typeof chunk === 'object') {
                        chunk = chunk.toString()
                    }
                    var i = 0
                    var c = ''
                    while (true) {
                        c = charAt(chunk, i++)
                        parser.c = c

                        if (!c) {
                            break
                        }

                        if (parser.trackPosition) {
                            parser.position++
                            if (c === '\n') {
                                parser.line++
                                parser.column = 0
                            } else {
                                parser.column++
                            }
                        }

                        switch (parser.state) {
                            case S.BEGIN:
                                parser.state = S.BEGIN_WHITESPACE
                                if (c === '\uFEFF') {
                                    continue
                                }
                                beginWhiteSpace(parser, c)
                                continue

                            case S.BEGIN_WHITESPACE:
                                beginWhiteSpace(parser, c)
                                continue

                            case S.TEXT:
                                if (parser.sawRoot && !parser.closedRoot) {
                                    var starti = i - 1
                                    while (c && c !== '<' && c !== '&') {
                                        c = charAt(chunk, i++)
                                        if (c && parser.trackPosition) {
                                            parser.position++
                                            if (c === '\n') {
                                                parser.line++
                                                parser.column = 0
                                            } else {
                                                parser.column++
                                            }
                                        }
                                    }
                                    parser.textNode += chunk.substring(starti, i - 1)
                                }
                                if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                                    parser.state = S.OPEN_WAKA
                                    parser.startTagPosition = parser.position
                                } else {
                                    if (not(whitespace, c) && (!parser.sawRoot || parser.closedRoot)) {
                                        strictFail(parser, 'Text data outside of root node.')
                                    }
                                    if (c === '&') {
                                        parser.state = S.TEXT_ENTITY
                                    } else {
                                        parser.textNode += c
                                    }
                                }
                                continue

                            case S.SCRIPT:
                                // only non-strict
                                if (c === '<') {
                                    parser.state = S.SCRIPT_ENDING
                                } else {
                                    parser.script += c
                                }
                                continue

                            case S.SCRIPT_ENDING:
                                if (c === '/') {
                                    parser.state = S.CLOSE_TAG
                                } else {
                                    parser.script += '<' + c
                                    parser.state = S.SCRIPT
                                }
                                continue

                            case S.OPEN_WAKA:
                                // either a /, ?, !, or text is coming next.
                                if (c === '!') {
                                    parser.state = S.SGML_DECL
                                    parser.sgmlDecl = ''
                                } else if (is(whitespace, c)) {
                                    // wait for it...
                                } else if (isMatch(nameStart, c)) {
                                    parser.state = S.OPEN_TAG
                                    parser.tagName = c
                                } else if (c === '/') {
                                    parser.state = S.CLOSE_TAG
                                    parser.tagName = ''
                                } else if (c === '?') {
                                    parser.state = S.PROC_INST
                                    parser.procInstName = parser.procInstBody = ''
                                } else {
                                    strictFail(parser, 'Unencoded <')
                                    // if there was some whitespace, then add that in.
                                    if (parser.startTagPosition + 1 < parser.position) {
                                        var pad = parser.position - parser.startTagPosition
                                        c = new Array(pad).join(' ') + c
                                    }
                                    parser.textNode += '<' + c
                                    parser.state = S.TEXT
                                }
                                continue

                            case S.SGML_DECL:
                                if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                                    emitNode(parser, 'onopencdata')
                                    parser.state = S.CDATA
                                    parser.sgmlDecl = ''
                                    parser.cdata = ''
                                } else if (parser.sgmlDecl + c === '--') {
                                    parser.state = S.COMMENT
                                    parser.comment = ''
                                    parser.sgmlDecl = ''
                                } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                                    parser.state = S.DOCTYPE
                                    if (parser.doctype || parser.sawRoot) {
                                        strictFail(parser,
                                            'Inappropriately located doctype declaration')
                                    }
                                    parser.doctype = ''
                                    parser.sgmlDecl = ''
                                } else if (c === '>') {
                                    emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
                                    parser.sgmlDecl = ''
                                    parser.state = S.TEXT
                                } else if (is(quote, c)) {
                                    parser.state = S.SGML_DECL_QUOTED
                                    parser.sgmlDecl += c
                                } else {
                                    parser.sgmlDecl += c
                                }
                                continue

                            case S.SGML_DECL_QUOTED:
                                if (c === parser.q) {
                                    parser.state = S.SGML_DECL
                                    parser.q = ''
                                }
                                parser.sgmlDecl += c
                                continue

                            case S.DOCTYPE:
                                if (c === '>') {
                                    parser.state = S.TEXT
                                    emitNode(parser, 'ondoctype', parser.doctype)
                                    parser.doctype = true // just remember that we saw it.
                                } else {
                                    parser.doctype += c
                                    if (c === '[') {
                                        parser.state = S.DOCTYPE_DTD
                                    } else if (is(quote, c)) {
                                        parser.state = S.DOCTYPE_QUOTED
                                        parser.q = c
                                    }
                                }
                                continue

                            case S.DOCTYPE_QUOTED:
                                parser.doctype += c
                                if (c === parser.q) {
                                    parser.q = ''
                                    parser.state = S.DOCTYPE
                                }
                                continue

                            case S.DOCTYPE_DTD:
                                parser.doctype += c
                                if (c === ']') {
                                    parser.state = S.DOCTYPE
                                } else if (is(quote, c)) {
                                    parser.state = S.DOCTYPE_DTD_QUOTED
                                    parser.q = c
                                }
                                continue

                            case S.DOCTYPE_DTD_QUOTED:
                                parser.doctype += c
                                if (c === parser.q) {
                                    parser.state = S.DOCTYPE_DTD
                                    parser.q = ''
                                }
                                continue

                            case S.COMMENT:
                                if (c === '-') {
                                    parser.state = S.COMMENT_ENDING
                                } else {
                                    parser.comment += c
                                }
                                continue

                            case S.COMMENT_ENDING:
                                if (c === '-') {
                                    parser.state = S.COMMENT_ENDED
                                    parser.comment = textopts(parser.opt, parser.comment)
                                    if (parser.comment) {
                                        emitNode(parser, 'oncomment', parser.comment)
                                    }
                                    parser.comment = ''
                                } else {
                                    parser.comment += '-' + c
                                    parser.state = S.COMMENT
                                }
                                continue

                            case S.COMMENT_ENDED:
                                if (c !== '>') {
                                    strictFail(parser, 'Malformed comment')
                                    // allow <!-- blah -- bloo --> in non-strict mode,
                                    // which is a comment of " blah -- bloo "
                                    parser.comment += '--' + c
                                    parser.state = S.COMMENT
                                } else {
                                    parser.state = S.TEXT
                                }
                                continue

                            case S.CDATA:
                                if (c === ']') {
                                    parser.state = S.CDATA_ENDING
                                } else {
                                    parser.cdata += c
                                }
                                continue

                            case S.CDATA_ENDING:
                                if (c === ']') {
                                    parser.state = S.CDATA_ENDING_2
                                } else {
                                    parser.cdata += ']' + c
                                    parser.state = S.CDATA
                                }
                                continue

                            case S.CDATA_ENDING_2:
                                if (c === '>') {
                                    if (parser.cdata) {
                                        emitNode(parser, 'oncdata', parser.cdata)
                                    }
                                    emitNode(parser, 'onclosecdata')
                                    parser.cdata = ''
                                    parser.state = S.TEXT
                                } else if (c === ']') {
                                    parser.cdata += ']'
                                } else {
                                    parser.cdata += ']]' + c
                                    parser.state = S.CDATA
                                }
                                continue

                            case S.PROC_INST:
                                if (c === '?') {
                                    parser.state = S.PROC_INST_ENDING
                                } else if (is(whitespace, c)) {
                                    parser.state = S.PROC_INST_BODY
                                } else {
                                    parser.procInstName += c
                                }
                                continue

                            case S.PROC_INST_BODY:
                                if (!parser.procInstBody && is(whitespace, c)) {
                                    continue
                                } else if (c === '?') {
                                    parser.state = S.PROC_INST_ENDING
                                } else {
                                    parser.procInstBody += c
                                }
                                continue

                            case S.PROC_INST_ENDING:
                                if (c === '>') {
                                    emitNode(parser, 'onprocessinginstruction', {
                                        name: parser.procInstName,
                                        body: parser.procInstBody
                                    })
                                    parser.procInstName = parser.procInstBody = ''
                                    parser.state = S.TEXT
                                } else {
                                    parser.procInstBody += '?' + c
                                    parser.state = S.PROC_INST_BODY
                                }
                                continue

                            case S.OPEN_TAG:
                                if (isMatch(nameBody, c)) {
                                    parser.tagName += c
                                } else {
                                    newTag(parser)
                                    if (c === '>') {
                                        openTag(parser)
                                    } else if (c === '/') {
                                        parser.state = S.OPEN_TAG_SLASH
                                    } else {
                                        if (not(whitespace, c)) {
                                            strictFail(parser, 'Invalid character in tag name')
                                        }
                                        parser.state = S.ATTRIB
                                    }
                                }
                                continue

                            case S.OPEN_TAG_SLASH:
                                if (c === '>') {
                                    openTag(parser, true)
                                    closeTag(parser)
                                } else {
                                    strictFail(parser, 'Forward-slash in opening tag not followed by >')
                                    parser.state = S.ATTRIB
                                }
                                continue

                            case S.ATTRIB:
                                // haven't read the attribute name yet.
                                if (is(whitespace, c)) {
                                    continue
                                } else if (c === '>') {
                                    openTag(parser)
                                } else if (c === '/') {
                                    parser.state = S.OPEN_TAG_SLASH
                                } else if (isMatch(nameStart, c)) {
                                    parser.attribName = c
                                    parser.attribValue = ''
                                    parser.state = S.ATTRIB_NAME
                                } else {
                                    strictFail(parser, 'Invalid attribute name')
                                }
                                continue

                            case S.ATTRIB_NAME:
                                if (c === '=') {
                                    parser.state = S.ATTRIB_VALUE
                                } else if (c === '>') {
                                    strictFail(parser, 'Attribute without value')
                                    parser.attribValue = parser.attribName
                                    attrib(parser)
                                    openTag(parser)
                                } else if (is(whitespace, c)) {
                                    parser.state = S.ATTRIB_NAME_SAW_WHITE
                                } else if (isMatch(nameBody, c)) {
                                    parser.attribName += c
                                } else {
                                    strictFail(parser, 'Invalid attribute name')
                                }
                                continue

                            case S.ATTRIB_NAME_SAW_WHITE:
                                if (c === '=') {
                                    parser.state = S.ATTRIB_VALUE
                                } else if (is(whitespace, c)) {
                                    continue
                                } else {
                                    strictFail(parser, 'Attribute without value')
                                    parser.tag.attributes[parser.attribName] = ''
                                    parser.attribValue = ''
                                    emitNode(parser, 'onattribute', {
                                        name: parser.attribName,
                                        value: ''
                                    })
                                    parser.attribName = ''
                                    if (c === '>') {
                                        openTag(parser)
                                    } else if (isMatch(nameStart, c)) {
                                        parser.attribName = c
                                        parser.state = S.ATTRIB_NAME
                                    } else {
                                        strictFail(parser, 'Invalid attribute name')
                                        parser.state = S.ATTRIB
                                    }
                                }
                                continue

                            case S.ATTRIB_VALUE:
                                if (is(whitespace, c)) {
                                    continue
                                } else if (is(quote, c)) {
                                    parser.q = c
                                    parser.state = S.ATTRIB_VALUE_QUOTED
                                } else {
                                    strictFail(parser, 'Unquoted attribute value')
                                    parser.state = S.ATTRIB_VALUE_UNQUOTED
                                    parser.attribValue = c
                                }
                                continue

                            case S.ATTRIB_VALUE_QUOTED:
                                if (c !== parser.q) {
                                    if (c === '&') {
                                        parser.state = S.ATTRIB_VALUE_ENTITY_Q
                                    } else {
                                        parser.attribValue += c
                                    }
                                    continue
                                }
                                attrib(parser)
                                parser.q = ''
                                parser.state = S.ATTRIB_VALUE_CLOSED
                                continue

                            case S.ATTRIB_VALUE_CLOSED:
                                if (is(whitespace, c)) {
                                    parser.state = S.ATTRIB
                                } else if (c === '>') {
                                    openTag(parser)
                                } else if (c === '/') {
                                    parser.state = S.OPEN_TAG_SLASH
                                } else if (isMatch(nameStart, c)) {
                                    strictFail(parser, 'No whitespace between attributes')
                                    parser.attribName = c
                                    parser.attribValue = ''
                                    parser.state = S.ATTRIB_NAME
                                } else {
                                    strictFail(parser, 'Invalid attribute name')
                                }
                                continue

                            case S.ATTRIB_VALUE_UNQUOTED:
                                if (not(attribEnd, c)) {
                                    if (c === '&') {
                                        parser.state = S.ATTRIB_VALUE_ENTITY_U
                                    } else {
                                        parser.attribValue += c
                                    }
                                    continue
                                }
                                attrib(parser)
                                if (c === '>') {
                                    openTag(parser)
                                } else {
                                    parser.state = S.ATTRIB
                                }
                                continue

                            case S.CLOSE_TAG:
                                if (!parser.tagName) {
                                    if (is(whitespace, c)) {
                                        continue
                                    } else if (notMatch(nameStart, c)) {
                                        if (parser.script) {
                                            parser.script += '</' + c
                                            parser.state = S.SCRIPT
                                        } else {
                                            strictFail(parser, 'Invalid tagname in closing tag.')
                                        }
                                    } else {
                                        parser.tagName = c
                                    }
                                } else if (c === '>') {
                                    closeTag(parser)
                                } else if (isMatch(nameBody, c)) {
                                    parser.tagName += c
                                } else if (parser.script) {
                                    parser.script += '</' + parser.tagName
                                    parser.tagName = ''
                                    parser.state = S.SCRIPT
                                } else {
                                    if (not(whitespace, c)) {
                                        strictFail(parser, 'Invalid tagname in closing tag')
                                    }
                                    parser.state = S.CLOSE_TAG_SAW_WHITE
                                }
                                continue

                            case S.CLOSE_TAG_SAW_WHITE:
                                if (is(whitespace, c)) {
                                    continue
                                }
                                if (c === '>') {
                                    closeTag(parser)
                                } else {
                                    strictFail(parser, 'Invalid characters in closing tag')
                                }
                                continue

                            case S.TEXT_ENTITY:
                            case S.ATTRIB_VALUE_ENTITY_Q:
                            case S.ATTRIB_VALUE_ENTITY_U:
                                var returnState
                                var buffer
                                switch (parser.state) {
                                    case S.TEXT_ENTITY:
                                        returnState = S.TEXT
                                        buffer = 'textNode'
                                        break

                                    case S.ATTRIB_VALUE_ENTITY_Q:
                                        returnState = S.ATTRIB_VALUE_QUOTED
                                        buffer = 'attribValue'
                                        break

                                    case S.ATTRIB_VALUE_ENTITY_U:
                                        returnState = S.ATTRIB_VALUE_UNQUOTED
                                        buffer = 'attribValue'
                                        break
                                }

                                if (c === ';') {
                                    parser[buffer] += parseEntity(parser)
                                    parser.entity = ''
                                    parser.state = returnState
                                } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                                    parser.entity += c
                                } else {
                                    strictFail(parser, 'Invalid character in entity name')
                                    parser[buffer] += '&' + parser.entity + c
                                    parser.entity = ''
                                    parser.state = returnState
                                }

                                continue

                            default:
                                throw new Error(parser, 'Unknown state: ' + parser.state)
                        }
                    } // while

                    if (parser.position >= parser.bufferCheckPosition) {
                        checkBufferLength(parser)
                    }
                    return parser
                }

                /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
                /* istanbul ignore next */
                if (!String.fromCodePoint) {
                    (function () {
                        var stringFromCharCode = String.fromCharCode
                        var floor = Math.floor
                        var fromCodePoint = function () {
                            var MAX_SIZE = 0x4000
                            var codeUnits = []
                            var highSurrogate
                            var lowSurrogate
                            var index = -1
                            var length = arguments.length
                            if (!length) {
                                return ''
                            }
                            var result = ''
                            while (++index < length) {
                                var codePoint = Number(arguments[index])
                                if (
                                    !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                                    codePoint < 0 || // not a valid Unicode code point
                                    codePoint > 0x10FFFF || // not a valid Unicode code point
                                    floor(codePoint) !== codePoint // not an integer
                                ) {
                                    throw RangeError('Invalid code point: ' + codePoint)
                                }
                                if (codePoint <= 0xFFFF) { // BMP code point
                                    codeUnits.push(codePoint)
                                } else { // Astral code point; split in surrogate halves
                                    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                                    codePoint -= 0x10000
                                    highSurrogate = (codePoint >> 10) + 0xD800
                                    lowSurrogate = (codePoint % 0x400) + 0xDC00
                                    codeUnits.push(highSurrogate, lowSurrogate)
                                }
                                if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                                    result += stringFromCharCode.apply(null, codeUnits)
                                    codeUnits.length = 0
                                }
                            }
                            return result
                        }
                        /* istanbul ignore next */
                        if (Object.defineProperty) {
                            Object.defineProperty(String, 'fromCodePoint', {
                                value: fromCodePoint,
                                configurable: true,
                                writable: true
                            })
                        } else {
                            String.fromCodePoint = fromCodePoint
                        }
                    }())
                }
            })(typeof exports === 'undefined' ? this.sax = {} : exports);

            var namespace=[{data:{'':{uri:['antetype']}}}];
            var nodeFactory=function (node) {
                var ns=node.nodeName.split(':');
                if(ns.length===1)ns.unshift('');
                node.ns=ns;
                var $=$Singleton;
                node.maybe.data[ns[0]].uri.concat(ns[1]).some(function (_) {
                    if($.hasOwnProperty(_)){
                        $=$[_];
                    }else{
                        $=null;
                        return true;
                    };
                });
                return $;
            };

            var SAX=function () {};
            SAX.prototype=(function ($) {
                $.onerror = function(error) {
                    // console.log(error);
                    this.resume();
                };

                $.onattribute=function (data,node) {
                    if(data.name.indexOf('xmlns:')===0){
                        if(namespace.length===0 || namespace[0].node!==node.nodeName)namespace.unshift(
                            {time:1,node:node.nodeName,data:{'':{uri:['antetype']}}}
                        );
                        var _=data.name.substr(6);
                        if(namespace[0].data.hasOwnProperty(_)===false)namespace[0].data[_]={prefix:_,uri:data.value.split('.')};
                        delete node.attributes[data.name];
                    };
                };
                $.onopentag =function(node) {
                    if(namespace.length>0 && namespace[0].node===node.nodeName)namespace[0].time++;
                };
                $.onclosetag = function(name,node) {
                    node.maybe=namespace[0];
                    if(namespace.length>0){
                        if(namespace[0].node===node.nodeName)namespace[0].time--;
                        if(namespace[0].time===0)sax.space.push(namespace.shift());
                    };
                };
                return $;
            })(exports.parser(false,{
                noscript:false,
                trim: false,
                normalize: false,
                xmlns: false,
                position:true,
                strictEntities:false,
                //            for html autoClosing
                selfClosingTags:(function () {
                    var _={};
                    'img|meta|br|input|LINK'
                        .split('|')
                        .forEach(function (k) {_[k.toUpperCase()]=true;});
                    return _;
                })()
            }));

            var remote=(function () {
                var loader=new XMLHttpRequest();
                var stack;
                var sax=new SAX();
                sax.onopentag=function (node) {
                    SAX.prototype.onopentag.call(this,node);
                    node.childNodes=[];
                    stack.unshift(node);
                };

                sax.onclosetag = function(name,node) {
                    stack.shift();
                    sax.list.unshift(node);

                    //保证脚本按顺序执行
                    if(name==='SCRIPT'||name==='LINK' || name==='STYLE') {
                        node.text = node.childNodes.join('').trim();
                        delete node.childNodes;
                        sax.inject.push(node);
                    }else{
                        if(stack.length>0)stack[0].childNodes.push(node);
                    };
                    SAX.prototype.onclosetag.apply(this,arguments);
                };

                sax.oncdata = sax.onscript=sax.ontext=function(text,node) {
                    text='\r\n'+text.trim();
                    if(text!=='\r\n') stack[0].childNodes.push(text);
                };

                return {
                    get:function (url) {
                        try{
                            loader.abort();
                        }catch(_){};
                        loader.onload=function () {
                            remote.parse(loader.responseText);
                        };
                        loader.open('get',url);
                        loader.send();
                    },
                    parse:function (text) {
                        stack=[];
                        namespace.length=1;
                        sax.dom={};
                        sax.inject=[];
                        sax.local=[];
                        sax.list=[];
                        sax.space=[namespace[0]];
                        sax.write(text).close();

                        var exist={};
                        sax.space.forEach(function (_) {
                            for(var $ in _.data){
                                var u=_.data[$].uri.join('.');
                                if(exist.hasOwnProperty(u)===false){
                                    exist[u]=true;
                                    $import(u+'.*');
                                };
                            };
                        });
                        exist=null;
                        sax.space.length=0;
                        $main(this.asy.bind(this));//自动运行
                    },
                    commit:function () {
                        sax.tags={};
                        sax.list.forEach(function (node) {
                            var _class=nodeFactory(node);
                            if(_class!==null){
                                if(sax.tags.hasOwnProperty(node.name)===false){
                                    sax.tags[node.name]={
                                        classFactory:_class,
                                        nodeName:node.nodeName,
                                        attributes:{},
                                    };
                                }
                                for(var a in node.attributes)sax.tags[node.name].attributes[a]=true;
                            };
                        });

                        sax.list.unshift([]);
                        var $=sax.list
                            .reduce(function ($,node) {
                                if(node.hasOwnProperty('name') && sax.tags.hasOwnProperty(node.name))$.push(this.each(node));
                                return $;
                            }.bind(this))
                            .filter(function ($) {
                                $.commitProperties();
                                return $.constructor.__GLOBAL__.name==='Application';
                            },this)[0];

                        if($){
                            document.body.appendChild($.htmlElementInstance);
                            $export.application=$;
                        };

                        //回收内存
                        delete sax.tags;
                        sax.list.length=0;
                    },
                    each:function (node) {
                        var _=sax.tags[node.name];
                        var ele;
                        ele=_===undefined?new FlexSprite(document.createElement(node.name)):new _.classFactory();
                        for(var a in node.attributes){
                            var val=node.attributes[a];
                            if(a in ele){
                                try{val=JSON.parse(val)}catch(e){};
                                ele[a]=val;
                            }else if(ele.attributes.hasOwnProperty(a)===false){
                                ele.attributes[a]=val;
                            }else if(ele.attributes[a] instanceof Array){
                                ele.attributes[a].push(val);
                            }else{
                                ele.attributes[a]+=val;
                            };
                        };
                        node.childNodes.forEach(function ($) {
                            ele.addElement($.constructor===String?document.createTextNode($):this.each($));
                        },this);
                        //回收内存
                        for(var $ in node)delete node[$];
                        return ele;
                    },
                    loadAsy:null,
                    asy:function () {
                        if(arguments.length===1)arguments[0].target.removeEventListener('load',this.loadAsy);

                        if(sax.inject.length===0){
                            delete this.tagHash;
                            this.commit();
                        }else{
                            var _=sax.inject.shift();

                            var h=_.attributes.src||_.attributes.href;
                            if(h===undefined){
                                if(this.hasOwnProperty('tagHash')===false)this.tagHash={};
                                if(this.tagHash.hasOwnProperty(_.name)===false){
                                    this.tagHash[_.name]={};
                                    Array.prototype.forEach.call(document.getElementsByTagName(_.name),function ($) {
                                        if($.text){
                                            this.tagHash[_.name][$.text.trim().substr(0,500).replace(/\s/g,'').substr(0,255)]=true;
                                        };
                                    },this);
                                };
                                var t=_.text.trim().substr(0,500).replace(/\s/g,'').substr(0,255)
                                if(this.tagHash[_.name].hasOwnProperty(t)===true)_=null;
                            }else if(document.querySelector('script[src="'+h+'"]') || document.querySelector('link[href="'+h+'"]'));//_=null;

                            if(_===null){
                                this.asy();
                            }else{
                                var e=document.createElement(_.name);
                                for(var a in _.attributes)e.setAttribute(a,_.attributes[a]);
                                if(_.text!=='')e.text=_.text;
                                document.head.appendChild(e);
                                if(_.name==='SCRIPT' && h!==undefined){
                                    if(this.loadAsy===null)this.loadAsy=this.asy.bind(this);
                                    e.addEventListener('load',this.loadAsy);
                                }else{
                                    this.asy();
                                };
                            };
                        };
                    }
                };
            })();

            var local=(function () {
                var loader=new XMLHttpRequest();

                var sax=new SAX();
                sax.onclosetag=function (name,node) {
                    sax.list.unshift(node);
                    SAX.prototype.onclosetag.apply(this,arguments);
                };

                return {
                    get:function () {
                        try{
                            loader.abort();
                        }catch(_){};
                        loader.onload=function () {
                            local.parse(loader.responseText);
                        };
                        loader.open('get',location.href);
                        loader.send();
                    },
                    each:function (node) {
                        var ele;
                        if(node.hasOwnProperty('flexElementInstance')){
                            ele=node;
                        }else if(node instanceof HTMLElement){
                            if(
                                (node.nodeName==='BUTTON' && !node.hasAttribute('label'))
                                ||(node.nodeName==='LABEL' && !node.hasAttribute('text'))
                                ||sax.tags.hasOwnProperty(node.nodeName)===false
                            ){
                                ele=new FlexSprite(node);
                                if(node.id)ele.id=node.id;
                            }else{
                                var factory=sax.tags[node.nodeName];
                                ele=new factory.classFactory();
                                Array.prototype.forEach.call(node.attributes,function (a) {
                                    var val=a.nodeValue;
                                    a=a.nodeName;
                                    if(a in ele){
                                        try{val=JSON.parse(val)}catch(e){};
                                        ele[a]=val;
                                    }else if(ele.attributes.hasOwnProperty(a)===false){
                                        console.log(a);
                                        ele.attributes[a]=val;
                                    }else if(ele.attributes[a] instanceof Array){
                                        ele.attributes[a].push(val);
                                    }else{
                                        ele.attributes[a]+=val;
                                    };
                                },this);
                            };
                            Array.prototype.filter.call(node.childNodes,function (_) {
                                return true;
                            }).forEach(function (_) {
                                ele.addElement(local.each(_));
                            });
                        }else{
                            ele=node;
                        };

                        node.parentNode.removeChild(node);
                        return ele;
                    },
                    parse:function (text) {
                        namespace.length=1;
                        sax.list=[];
                        sax.space=[namespace[0]];
                        sax.write(text).close();

                        //批量import
                        var exist={};
                        sax.space.forEach(function (_) {
                            for(var $ in _.data){
                                var u=_.data[$].uri.join('.')
                                if(exist.hasOwnProperty(u)===false){
                                    exist[u]=true;
                                    $import(u+'.*');
                                };
                            };
                        });
                        exist=null;
                        sax.space.length=0;
                        $main(this.commit.bind(this));//这句一定要在这里放
                    },
                    commit:function () {
                        sax.tags={};
                        sax.list.unshift([]);
                        //$export.application=[0]
                        $export.application=sax.list
                            .filter(function (node) {
                                if(node instanceof Array)return true;
                                var _class=nodeFactory(node);
                                if(_class!==null){
                                    if(sax.tags.hasOwnProperty(node.name)===false){
                                        sax.tags[node.name]={
                                            classFactory:_class,
                                            nodeName:node.nodeName,
                                            attributes:{},
                                        };
                                        return true;
                                    };
                                };
                                return false;
                            },this)
                            .reduce(function (p,_) {
                                return p.concat(Array.prototype.map.call(document.getElementsByTagName(_.nodeName),function (node) {
                                    var $=node.parentNode;
                                    node=local.each(node);
                                    node.commitProperties();
                                    $.appendChild(node.htmlElementInstance);
                                    return node;
                                }));
                            })
                            [0];

                        //回收内存
                        delete sax.tags;
                        sax.list.length=0;
                    },
                }
            })();

            var $export={
                CREATIONCOMPLETE:'application_creationComplete',
                remote:remote.get,
                local:local.get,
                _application:null,
                set application(newVal){
                    if(newVal!==this._application){
                        this._application=newVal;
                        var e=document.createEvent('Event');
                        e.initEvent(this.CREATIONCOMPLETE,true,true);
                        e.value=newVal;
                        newVal.dispatchEvent(e);
                    }
                },
                get application(){
                    return this._application;
                },
                dispatchEvent:function () {
                    this.events=this.events.filter(function (_) {
                        _.value.dispatchEvent(_);
                        return false;
                    });
                },
            };

            return $export;
        })());
})();

(function () {
    'use strict';
    var $flex=$import('mx.utils.flex');
    var temp={};
    var stack=[];
    $package('mx.utils')
        .class('router')
        .static(
            {
                boot:function (onBootHandler) {
                    temp.boot=onBootHandler;
                },
                switch:function (onSwitchHandler) {
                    temp.switch=onSwitchHandler;
                }
            }
        );

    document.addEventListener($flex.CREATIONCOMPLETE,function (event) {
        event.stopImmediatePropagation();
        if(event.target.hasOwnProperty('vsystem_router_id')===false)event.target.vsystem_router_id=stack.length;
        stack.push(temp);
        temp={};
        var $=stack[event.target.vsystem_router_id].boot;
        if($ instanceof Function)$.call(event.target.flexElementInstance);
    });
})();