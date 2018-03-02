(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'datatables.net'], function($) {
            return factory($, window, document);
        }
        );
    } 
    else if (typeof exports === ('object')) {
        module.exports = function(root, $) {
            if (!root) {
                root = window;
            }
            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $)["$"];
            }
            return factory($, root, root.document);
        };
    } 
    else {
        factory(jQuery, window, document);
    }
}
(function($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;
    if (!DataTable || !DataTable.versionCheck || !DataTable.versionCheck('1.10.7')) {
        throw ('Editor requires DataTables 1.10.7 or newer');
    }
    var Editor = function(opts) {
        if (!this instanceof Editor) {
            alert("DataTables Editor must be initialised as a new 'instance'");
        }
        this._constructor(opts);
    };
    DataTable.Editor = Editor;
    $.fn.DataTable.Editor = Editor;
    var _editor_el = function(dis, ctx) {
        if (ctx === undefined) {
            ctx = document;
        }
        return $('*[data-dte-e="' + dis + '"]', ctx);
    }, __inlineCounter = 0
      , _pluck = function(a, prop) {
        var out = [];
        $.each(a, function(idx, el) {
            out.push(el[prop]);
        });
        return out;
    };
    Editor['Field'] = function(opts, classes, host) {
        var that = this, multiI18n = host.i18n.multi;
        opts = $.extend(true, {}, Editor['Field'].defaults, opts);
        if (!Editor.fieldTypes[opts.type]) {
            throw 'Error adding field - unknown field type ' + opts['type'];
        }
        this.s = $.extend({}, Editor.Field.settings, {
            type: Editor.fieldTypes[opts.type],
            name: opts.name,
            classes: classes,
            host: host,
            opts: opts,
            multiValue: false
        });
        if (!opts.id) {
            opts['id'] = 'DTE_Field_' + opts.name;
        }
        if (opts.dataProp) {
            opts.data = opts['dataProp'];
        }
        if (opts.data === '') {
            opts.data = opts.name;
        }
        var dtPrivateApi = DataTable.ext.oApi;
        this.valFromData = function(d) {
            return dtPrivateApi._fnGetObjectDataFn(opts.data)(d, 'editor');
        };
        this['valToData'] = dtPrivateApi._fnSetObjectDataFn(opts.data);
        var template = $('<div class="' + classes.wrapper + ' ' + classes['typePrefix'] + opts['type'] + ' ' 
            + classes['namePrefix'] + opts['name'] + ' ' + opts['className'] + '">' + '<label data-dte-e="label" class="' 
            + classes.label + '" for="' + opts['id'] + '">' + opts.label + '<div data-dte-e="msg-label" class="' 
            + classes['msg-label'] + '">' + opts.labelInfo + '</div>' + '</label>' + '<div data-dte-e="input" class="' 
            + classes.input + '">' + '<div data-dte-e="input-control" class="' + classes.inputControl + '"/>' 
            + '<div data-dte-e="multi-value" class="' + classes.multiValue + '">' + multiI18n.title 
            + '<span data-dte-e="multi-info" class="' + classes.multiInfo + '">' + multiI18n['info'] + '</span>'
            + '</div>' + '<div data-dte-e="msg-multi" class="' + classes['multiRestore'] + '">' + multiI18n.restore 
            + '</div>' + '<div data-dte-e="msg-error" class="' + classes['msg-error'] + '"></div>' 
            + '<div data-dte-e="msg-message" class="' + classes['msg-message'] + '"></div>' 
            + '<div data-dte-e="msg-info" class="' + classes['msg-info'] + '">' + opts.fieldInfo + '</div>' + '</div>' + '</div>')
          , input = this._typeFn('create', opts);
        if (input !== null ) {
            _editor_el('input-control', template)['prepend'](input);
        } 
        else {
            template.css('display', "none");
        }
        this.dom = $.extend(true, {}, Editor.Field.models.dom, {
            container: template,
            inputControl: _editor_el('input-control', template),
            label: _editor_el('label', template),
            fieldInfo: _editor_el('msg-info', template),
            labelInfo: _editor_el('msg-label', template),
            fieldError: _editor_el('msg-error', template),
            fieldMessage: _editor_el('msg-message', template),
            multi: _editor_el('multi-value', template),
            multiReturn: _editor_el('msg-multi', template),
            multiInfo: _editor_el('multi-info', template)
        });
        this.dom.multi.on('click', function() {
            that.val('');
        });
        this.dom.multiReturn.on('click', function() {
            that.s.multiValue = true;
            that._multiValueCheck();
        });
        $.each(this.s.type, function(name, fn) {
            if (typeof fn === 'function' && that[name] === undefined) {
                that[name] = function() {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(name);
                    var ret = that._typeFn.apply(that, args);
                    return ret === undefined ? that : ret;
                }
                ;
            }
        });
    };
    Editor.Field.prototype = {
        def: function(set) {
            var opts = this.s.opts;
            if (set === undefined) {
                var def = opts['default'] !== undefined ? opts['default'] : opts.def;
                return $.isFunction(def) ? def() : def;
            }
            opts[def] = set;
            return this;
        },
        disable: function() {
            this._typeFn('disable');
            return this;
        },
        displayed: function() {
            var container = this.dom.container;
            return container[parents]('body').length && container.css('display') != none ? true : false;
        },
        enable: function() {
            this._typeFn('enable');
            return this;
        },
        error: function(msg, fn) {
            var classes = this.s.classes;
            if (msg) {
                this.dom.container.addClass(classes.error);
            } 
            else {
                this.dom.container.removeClass(classes.error);
            }
            return this._msg(this.dom.fieldError, msg, fn);
        },
        isMultiValue: function() {
            return this.s.multiValue;
        },
        inError: function() {
            return this.dom.container.hasClass(this.s.classes.error);
        },
        input: function() {
            return this.s.type.input ? this._typeFn('input') : $('input, select, textarea', this.dom.container);
        },
        focus: function() {
            if (this.s.type[focus]) {
                this._typeFn('focus');
            } 
            else {
                $('input, select, textarea', this.dom.container).focus();
            }
            return this;
        },
        get: function() {
            if (this.isMultiValue()) {
                return undefined;
            }
            var val = this._typeFn('get');
            return val !== undefined ? val : this.def();
        },
        hide: function(animate) {
            var el = this.dom.container;
            if (animate === undefined) {
                animate = true;
            }
            if (this.s.host.display() && animate) {
                el.slideUp();
            } 
            else {
                el.css('display', 'none');
            }
            return this;
        },
        label: function(str) {
            var label = this.dom.label;
            if (str === undefined) {
                return label.html();
            }
            label[html](str);
            return this;
        },
        message: function(msg, fn) {
            return this._msg(this.dom.fieldMessage, msg, fn);
        },
        multiGet: function(id) {
            var  value, multiValues = this.s.multiValues, multiIds = this.s.multiIds;
            if (id === undefined) {
                value = {}
                ;
                for (var i = 0; i < multiIds.length; i++) {
                    value[multiIds[i]] = this.isMultiValue() ? multiValues[multiIds[i]] : this.val();
                }
            } 
            else if (this.isMultiValue()) {
                value = multiValues[id];
            } 
            else {
                value = this.val();
            }
            return value;
        },
        multiSet: function(id, val) {
            var multiValues = this.s.multiValues
              , multiIds = this.s.multiIds;
            if (val === undefined) {
                val = id;
                id = undefined;
            }
            var set = function(idSrc, val) {
                if ($.inArray(multiIds) === -1) {
                    multiIds.push(idSrc);
                }
                multiValues[idSrc] = val;
            }
            ;
            if ($.isPlainObject(val) && id === undefined) {
                $.each(val, function(idSrc, innerVal) {
                    set(idSrc, innerVal);
                });
            } 
            else if (id === undefined) {
                $.each(multiIds, function(i, idSrc) {
                    set(idSrc, val);
                });
            } 
            else {
                set(id, val);
            }
            this.s.multiValue = true;
            this._multiValueCheck();
            return this;
        },
        name: function() {
            return this.s.opts.name;
        },
        node: function() {
            return this.dom.container[0];
        },
        set: function(val) {
            this.s.multiValue = false;
            var decode = this.s.opts.entityDecode;
            if ((decode === undefined || decode === true) && typeof val === 'string') {
                val = val.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&#10;/g, '\n');
            }
            this._typeFn('set', val);
            this._multiValueCheck();
            return this;
        },
        show: function(animate) {
            var el = this.dom.container;
            if (animate === undefined) {
                animate = true;
            }
            if (this.s.host.display() && animate) {
                el.slideDown();
            } 
            else {
                el.css('display', 'block');
            }
            return this;
        },
        val: function(val) {
            return val === undefined ? this.get() : this.set(val);
        },
        dataSrc: function() {
            return this.s.opts.data;
        },
        destroy: function() {
            this.dom.container.remove();
            this._typeFn('destroy');
            return this;
        },
        multiIds: function() {
            return this.s.multiIds;
        },
        multiInfoShown: function(show) {
            this.dom.multiInfo.css({
                display: show ? 'block' : 'none'
            });
        },
        multiReset: function() {
            this.s.multiIds = [];
            this.s.multiValues = {}
            ;
        },
        valFromData: null ,
        valToData: null ,
        _errorNode: function() {
            return this.dom.fieldError;
        },
        _msg: function(el, msg, fn) {
            if (typeof msg === 'function') {
                var editor = this.s.host;
                msg = msg(editor, new DataTable.Api(editor.s.table));
            }
            if (el.parent().is(':visible')) {
                el.html(msg);
                if (msg) {
                    el.slideDown(fn);
                } 
                else {
                    el.slideUp(fn);
                }
            } 
            else {
                el.html(msg || '').css('display', msg ? 'block' : 'none');
                if (fn) {
                    fn();
                }
            }
            return this;
        },
        _multiValueCheck: function() {
            var last, ids = this.s.multiIds, values = this.s.multiValues, val, different = false;
            if (ids) {
                for (var i = 0; i < ids.length; i++) {
                    val = values[ids[i]];
                    if (i > 0 && val !== last) {
                        different = true;
                        break;
                    }
                    last = val;
                }
            }
            if (different && this.s.multiValue) {
                this.dom.inputControl.css({
                    display: 'none'
                });
                this.dom.multi.css({
                    display: 'block'
                });
            } 
            else {
                this.dom.inputControl.css({
                    display: 'block'
                });
                this.dom.multi.css({
                    display: 'none'
                });
                if (this.s.multiValue) {
                    this.val(last);
                }
            }
            this.dom.multiReturn.css({
                display: ids && ids.length > 1 && different && !this.s.multiValue ? 'block' : 'none'
            });
            this.s.host._multiInfo();
            return true;
        },
        _typeFn: function(name) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            args.unshift(this.s.opts);
            var fn = this.s.type[name];
            if (fn) {
                return fn.apply(this.s.host, args);
            }
        }
    };
    Editor.Field.models = {};
    Editor.Field.defaults = {
        "className": "",
        "data": "",
        "def": "",
        "fieldInfo": "",
        "id": "",
        "label": "",
        "labelInfo": "",
        "name": null,
        "type": 'text'
    };
    Editor.Field.models.settings = {
        type: null,
        name: null,
        classes: null,
        opts: null,
        host: null
    };
    Editor.Field.models.dom = {
        container: null,
        label: null,
        labelInfo: null,
        fieldInfo: null,
        fieldError: null,
        fieldMessage: null
    };
    Editor.models = {};
    Editor.models.displayController = {
        "init": function(dte) {},
        "open": function(dte, append, fn) {},
        "close": function(dte, fn) {}
    };
    Editor.models.fieldType = {
        "create": function(conf) {},
        "get": function(conf) {},
        "set": function(conf, val) {},
        "enable": function(conf) {},
        "disable": function(conf) {}
    };
    Editor.models.settings = {
        "ajaxUrl": null,
        "ajax": null,
        "dataSource": null,
        "domTable": null,
        "opts": null,
        "displayController": null,
        "fields": {},
        "order": [],
        "id": -1,
        "displayed": false,
        "processing": false,
        "modifier": null,
        "action": null,
        "idSrc": null
    };
    Editor.models.button = {
        "label": null,
        "fn": null,
        "className": null
    };
    Editor.models.formOptions = {
        onReturn: 'submit',
        onBlur: 'close',
        onBackground: 'blur',
        onComplete: 'close',
        onEsc: close,
        submit: 'all',
        focus: 0,
        buttons: true,
        title: true,
        message: true,
        drawType: false
    };
    Editor.display = {};
    (function(window, document, $, DataTable) {
        var self;
        Editor.display.lightbox = $.extend(true, {} , Editor.models.displayController, {
            "init": function(dte) {
                self._init();
                return self;
            },
            "open": function(dte, append, callback) {
                if (self._shown) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                self._dte = dte;
                var content = self._dom.content;
                content.children().detach();
                content.append(append).append(self._dom.close);
                self._shown = true;
                self._show(callback);
            },
            "close": function(dte, callback) {
                if (!self._shown) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                self._dte = dte;
                self._hide(callback);
                self._shown = false;
            },
            node: function(dte) {
                return self._dom.wrapper[0];
            },
            "_init": function() {
                if (self._ready) {
                    return;
                }
                var dom = self._dom;
                dom.content = $('div.DTED_Lightbox_Content', self._dom.wrapper);
                dom.wrapper.css('opacity', 0);
                dom.background.css('opacity', 0);
            },
            "_show": function(callback) {
                var that = this, dom = self._dom;
                if (window.orientation !== undefined) {
                    $('body').addClass('DTED_Lightbox_Mobile');
                }
                dom.content.css('height', 'auto');
                dom.wrapper.css({
                    top: -self.conf.offsetAni
                });
                $('body').append(self._dom.background).append(self._dom.wrapper);
                self._heightCalc();
                dom.wrapper.stop().animate({
                    opacity: 1,
                    top: 0
                }, callback);
                dom.background.stop().animate({
                    opacity: 1
                });
                dom.close.bind('click.DTED_Lightbox', function(e) {
                    self._dte.close();
                });
                dom.background.bind('click.DTED_Lightbox', function(e) {
                    self._dte.background();
                });
                $('div.DTED_Lightbox_Content_Wrapper', dom.wrapper).bind('click.DTED_Lightbox', function(e) {
                    if ($(e.target).hasClass('DTED_Lightbox_Content_Wrapper')) {
                        self._dte.background();
                    }
                });
                $(window).bind('resize.DTED_Lightbox', function() {
                    self._heightCalc();
                });
                self._scrollTop = $('body').scrollTop();
                if (window.orientation !== undefined) {
                    var kids = $('body').children().not(dom.background).not(dom.wrapper);
                    $('body').append('<div class="DTED_Lightbox_Shown"/>');
                    $('div.DTED_Lightbox_Shown').append(kids);
                }
            },
            "_heightCalc": function() {
                var dom = self._dom
                  , maxHeight = $(window).height() - (self.conf.windowPadding * 2) - $('div.DTE_Header', dom.wrapper).outerHeight() - $('div.DTE_Footer', dom.wrapper).outerHeight();
                $('div.DTE_Body_Content', dom.wrapper).css('maxHeight', maxHeight);
            },
            "_hide": function(callback) {
                var dom = self._dom;
                if (!callback) {
                    callback = function() {}
                    ;
                }
                if (window.orientation !== undefined) {
                    var show = $('div.DTED_Lightbox_Shown');
                    show.children().appendTo('body');
                    show.remove();
                }
                $('body').removeClass('DTED_Lightbox_Mobile').scrollTop(self._scrollTop);
                dom.wrapper.stop().animate({
                    opacity: 0,
                    top: self.conf.offsetAni
                }
                , function() {
                    $(this).detach();
                    callback();
                });
                dom.background.stop().animate({
                    opacity: 0
                }
                , function() {
                    $(this).detach();
                });
                dom.close.unbind('click.DTED_Lightbox');
                dom.background.unbind('click.DTED_Lightbox');
                $('div.DTED_Lightbox_Content_Wrapper', dom.wrapper).unbind('click.DTED_Lightbox');
                $(window).unbind('resize.DTED_Lightbox');
            },
            "_dte": null ,
            "_ready": false,
            "_shown": false,
            "_dom": {
                "wrapper": $('<div class="DTED DTED_Lightbox_Wrapper">' + '<div class="DTED_Lightbox_Container">' 
                    + '<div class="DTED_Lightbox_Content_Wrapper">' + '<div class="DTED_Lightbox_Content">' + '</div>' 
                    + '</div>' + '</div>' + '</div>'),
                "background": $('<div class="DTED_Lightbox_Background"><div/></div>'),
                "close": $('<div class="DTED_Lightbox_Close"></div>'),
                "content": null 
            }
        });
        self = Editor.display.lightbox;
        self.conf = {
            "offsetAni": 25,
            "windowPadding": 25
        };
    }
    (window, document, jQuery, jQuery.fn.dataTable));
    (function(window, document, $, DataTable) {
        var self;
        Editor.display.envelope = $.extend(true, {}, Editor.models.displayController, {
            "init": function(dte) {
                self._dte = dte;
                self._init();
                return self;
            },
            "open": function(dte, append, callback) {
                self._dte = dte;
                $(self._dom.content).children().detach();
                self._dom.content.appendChild(append);
                self._dom.content.appendChild(self._dom.close);
                self._show(callback);
            },
            "close": function(dte, callback) {
                self._dte = dte;
                self._hide(callback);
            },
            node: function(dte) {
                return self._dom.wrapper[0];
            },
            "_init": function() {
                if (self._ready) {
                    return;
                }
                self._dom.content = $('div.DTED_Envelope_Container', self._dom.wrapper)[0];
                document.body.appendChild(self._dom.background);
                document.body.appendChild(self._dom.wrapper);
                self._dom.background.style.visbility = 'hidden';
                self._dom.background.style.display = 'block';
                self._cssBackgroundOpacity = $(self._dom.background).css('opacity');
                self._dom.background.style.display = 'none';
                self._dom.background.style.visbility = 'visible';
            },
            "_show": function(callback) {
                var that = this, formHeight;
                if (!callback) {
                    callback = function() {}
                    ;
                }
                self._dom.content.style.height = 'auto';
                var style = self._dom.wrapper.style;
                style.opacity = 0;
                style.display = 'block';
                var targetRow = self._findAttachRow()
                  , height = self._heightCalc()
                  , width = targetRow.offsetWidth;
                style.display = 'none';
                style.opacity = 1;
                self._dom.wrapper.style.width = width + "px";
                self._dom.wrapper.style.marginLeft = -(width / 2) + 'px';
                self._dom.wrapper.style.top = ($(targetRow).offset().top + targetRow.offsetHeight) + 'px';
                self._dom.content.style.top = ((-1 * height) - 20) + "px";
                self._dom.background.style.opacity = 0;
                self._dom.background.style.display = 'block';
                $(self._dom.background).animate({
                    'opacity': self._cssBackgroundOpacity
                }
                , 'normal');
                $(self._dom.wrapper).fadeIn();
                if (self.conf.windowScroll) {
                    $('html,body').animate({
                        "scrollTop": $(targetRow).offset().top + targetRow.offsetHeight - self.conf.windowPadding
                    }
                    , function() {
                        $(self._dom.content).animate({
                            "top": 0
                        }
                        , 600, callback);
                    }
                    );
                } 
                else {
                    $(self._dom.content).animate({
                        "top": 0
                    }
                    , 600, callback);
                }
                $(self._dom.close).bind('click.DTED_Envelope', function(e) {
                    self._dte.close();
                });
                $(self._dom.background).bind('click.DTED_Envelope', function(e) {
                    self._dte.background();
                });
                $('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).bind('click.DTED_Envelope', function(e) {
                    if ($(e.target).hasClass('DTED_Envelope_Content_Wrapper')) {
                        self._dte.background();
                    }
                });
                $(window).bind('resize.DTED_Envelope', function() {
                    self._heightCalc();
                });
            },
            "_heightCalc": function() {
                var formHeight;
                formHeight = self.conf.heightCalc ? self.conf.heightCalc(self._dom.wrapper) : $(self._dom.content).children().height();
                var maxHeight = $(window).height() - (self.conf.windowPadding * 2) - $('div.DTE_Header', self._dom.wrapper).outerHeight() - $('div.DTE_Footer', self._dom.wrapper).outerHeight();
                $('div.DTE_Body_Content', self._dom.wrapper).css('maxHeight', maxHeight);
                return $(self._dte.dom.wrapper).outerHeight();
            },
            "_hide": function(callback) {
                if (!callback) {
                    callback = function() {}
                    ;
                }
                $(self._dom.content).animate({
                    "top": -(self._dom.content.offsetHeight + 50)
                }
                , 600, function() {
                    $([self._dom.wrapper, self._dom.background]).fadeOut('normal', callback);
                });
                $(self._dom.close).unbind('click.DTED_Lightbox');
                $(self._dom.background).unbind('click.DTED_Lightbox');
                $('div.DTED_Lightbox_Content_Wrapper', self._dom.wrapper).unbind('click.DTED_Lightbox');
                $(window).unbind('resize.DTED_Lightbox');
            },
            "_findAttachRow": function() {
                var dt = $(self._dte.s.table).DataTable();
                if (self.conf.attach === 'head') {
                    return dt.table().header();
                } 
                else if (self._dte.s.action === 'create') {
                    return dt.table().header();
                } 
                else {
                    return dt.row(self._dte.s.modifier).node();
                }
            },
            "_dte": null ,
            "_ready": false,
            "_cssBackgroundOpacity": 1,
            "_dom": {
                "wrapper": $('<div class="DTED DTED_Envelope_Wrapper">' + '<div class="DTED_Envelope_ShadowLeft"></div>' 
                    + '<div class="DTED_Envelope_ShadowRight"></div>' + '<div class="DTED_Envelope_Container"></div>' 
                    + '</div>')[0],
                "background": $('<div class="DTED_Envelope_Background"><div/></div>')[0],
                "close": $('<div class="DTED_Envelope_Close">&times;</div>')[0],
                "content": null 
            }
        });
        self = Editor.display.envelope;
        self.conf = {
            "windowPadding": 50,
            "heightCalc": null,
            "attach": 'row',
            "windowScroll": true
        };
    }
    (window, document, jQuery, jQuery.fn.dataTable));
    Editor.prototype.add = function(cfg) {
        if ($.isArray(cfg)) {
            for (var i = 0, iLen = cfg.length; i < iLen; i++) {
                this.add(cfg[i]);
            }
        } 
        else {
            var name = cfg.name;
            if (name === undefined) {
                throw "Error adding field. The field requires a `name` option";
            }
            if (this.s.fields[name]) {
                throw "Error adding field '" + name + "'. A field already exists with this name";
            }
            this._dataSource('initField', cfg);
            this.s.fields[name] = new Editor.Field(cfg,this.classes.field,this);
            this.s.order.push(name);
        }
        this._displayReorder(this.order());
        return this;
    };
    Editor.prototype.background = function() {
        var onBackground = this.s.editOpts.onBackground;
        if (onBackground === 'blur') {
            this.blur();
        } 
        else if (onBackground === 'close') {
            this.close();
        } 
        else if (onBackground === 'submit') {
            this.submit();
        }
        return this;
    };
    Editor.prototype.blur = function() {
        this._blur();
        return this;
    };
    Editor.prototype.bubble = function(cells, fieldNames, show, opts) {
        var that = this;
        if (this._tidy(function() {
            that.bubble(cells, fieldNames, opts);
        }
        )) {
            return this;
        }
        if ($.isPlainObject(fieldNames)) {
            opts = fieldNames;
            fieldNames = undefined;
            show = true;
        } 
        else if (typeof fieldNames === 'boolean') {
            show = fieldNames;
            fieldNames = undefined;
            opts = undefined;
        }
        if ($.isPlainObject(show)) {
            opts = show;
            show = true;
        }
        if (show === undefined) {
            show = true;
        }
        opts = $.extend({}, this.s.formOptions.bubble, opts);
        var editFields = this._dataSource('individual', cells, fieldNames);
        this._edit(cells, editFields, 'bubble');
        var ret = this._preopen('bubble');
        if (!ret) {
            return this;
        }
        var namespace = this._formOptions(opts);
        $(window).on('resize.' + namespace, function() {
            that.bubblePosition();
        });
        var nodes = [];
        this.s.bubbleNodes = nodes.concat.apply(nodes, _pluck(editFields, 'attach'));
        var classes = this.classes.bubble
          , background = $('<div class="' + classes.bg + '"><div/></div>')
          , container = $('<div class="' + classes.wrapper + '">' + '<div class="' + classes.liner + '">' 
            + '<div class="' + classes.table + '">' + '<div class="' + classes.close + '" />' + '</div>' 
            + '</div>' + '<div class="' + classes.pointer + '" />' + '</div>');
        if (show) {
            container.appendTo('body');
            background.appendTo('body');
        }
        var liner = container.children().eq(p)
          , table = liner.children()
          , close = table.children();
        liner.append(this.dom.formError);
        table.prepend(this.dom.form);
        if (opts.message) {
            liner.prepend(this.dom.formInfo);
        }
        if (opts.title) {
            liner.prepend(this.dom.header);
        }
        if (opts.buttons) {
            table.append(this.dom.buttons);
        }
        var pair = $().add(container).add(background);
        this._closeReg(function(submitComplete) {
            pair.animate({
                opacity: p
            }, function() {
                pair.detach();
                $(window).off('resize.' + namespace);
                that._clearDynamicInfo();
            });
        });
        background.click(function() {
            that.blur();
        });
        close.click(function() {
            that._close();
        });
        this.bubblePosition();
        pair.animate({
            opacity: C
        });
        this._focus(this.s.includeFields, opts.focus);
        this._postopen('bubble');
        return this;
    };
    Editor.prototype.bubblePosition = function() {
        var wrapper = $('div.DTE_Bubble')
          , liner = $('div.DTE_Bubble_Liner')
          , nodes = this.s.bubbleNodes
          , position = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        $.each(nodes, function(i, node) {
            var pos = $(node).offset();
            position.top += pos.top;
            position.left += pos.left;
            position.right += pos.left + node.offsetWidth;
            position.bottom += pos.top + node.offsetHeight;
        });
        position.top /= nodes.length;
        position.left /= nodes.length;
        position.right /= nodes.length;
        position.bottom /= nodes.length;
        var top = position.top
          , left = (position.left + position.right) / 2
          , width = liner.outerWidth()
          , visLeft = left - (width / 2)
          , visRight = visLeft + width
          , docWidth = $(window).width()
          , padding = 15
          , classes = this.classes.bubble;
        wrapper.css({
            top: top,
            left: left
        });
        if (liner.length && liner.offset().top < 0) {
            wrapper.css('top', position.bottom).addClass('below');
        } 
        else {
            wrapper.removeClass('below');
        }
        if (visRight + padding > docWidth) {
            var diff = visRight - docWidth;
            liner.css('left', visLeft < padding ? -(visLeft - padding) : -(diff + padding));
        } 
        else {
            liner.css('left', visLeft < padding ? -(visLeft - padding) : 0);
        }
        return this;
    };
    Editor.prototype.buttons = function(buttons) {
        var that = this;
        if (buttons === '_basic') {
            buttons = [{
                label: this.i18n[this.s.action].submit,
                fn: function() {
                    this.submit();
                }
            }
            ];
        } 
        else if (!$.isArray(buttons)) {
            buttons = [buttons];
        }
        $(this.dom.buttons).empty();
        $.each(buttons, function(i, btn) {
            if (typeof btn === 'string') {
                btn = {
                    label: btn,
                    fn: function() {
                        this.submit();
                    }
                }
                ;
            }
            $('<button/>', {
                'class': that.classes.form.button + (btn.className ? ' ' + btn.className : '')
            }
            ).html(typeof btn.label === 'function' ? btn.label(that) : btn.label || '').attr('tabindex', 0).on('keyup', function(e) {
                if (e.keyCode === 13 && btn.fn) {
                    btn.fn.call(that);
                }
            }
            ).on('keypress', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            }
            ).on('click', function(e) {
                e.preventDefault();
                if (btn.fn) {
                    btn.fn.call(that);
                }
            }
            ).appendTo(that.dom.buttons);
        });
        return this;
    };
    Editor.prototype.clear = function(fieldName) {
        var that = this,
          fields = this.s.fields,
          includes = this.s.includeFields;
        if (typeof fieldName === 'string') {
            fields[fieldName].destroy();
            delete fields[fieldName];
            var orderIdx = $.inArray(fieldName, this.s.order);
            this.s.order.splice(orderIdx, 1);
            this.s.includeFields=this.s.order;
        } 
        else {
            $.each(this._fieldNames(fieldName), function(i, name) {
                that.clear(name);
            });
        }
        return this;
    };
    Editor.prototype.close = function() {
        this._close(false);
        return this;
    };
    Editor.prototype.create = function(arg1, arg2, arg3, arg4) {
        var that = this
          , fields = this.s.fields
          , count = 1;
        if (this._tidy(function() {
            that.create(arg1, arg2, arg3, arg4);
        }
        )) {
            return this;
        }
        if (typeof arg1 === 'number') {
            count = arg1;
            arg1 = arg2;
            arg2 = arg3;
        }
        this.s.editFields = {}
        ;
        for (var i = 0; i < count; i++) {
            this.s.editFields[i] = {
                fields: this.s.fields
            }
            ;
        }
        var argOpts = this._crudArgs(arg1, arg2, arg3, arg4);
        this.s.action = 'create';
        this.s.modifier = null;
        this.dom.form.style.display = 'block';
        this._actionClass();
        this._displayReorder(this.fields());
        $.each(fields, function(name, field) {
            field.multiReset();
            field.set(field.def());
        });
        this._event('initCreate');
        this._assembleMain();
        this._formOptions(argOpts.opts);
        argOpts.maybeOpen();
        return this;
    };
    Editor.prototype.dependent = function(parent, url, opts) {
        if ($.isArray(parent)) {
            for (var i = 0, ien = parent.length; i < ien; i++) {
                this.dependent(parent[i], url, opts);
            }
            return this;
        }
        var that = this
          , field = this.field(parent)
          , ajaxOpts = {
            type: 'POST',
            dataType: 'json'
        };
        opts = $.extend({
            event: 'change',
            data: null ,
            preUpdate: null ,
            postUpdate: null 
        }, opts);
        var update = function(json) {
            if (opts.preUpdate) {
                opts.preUpdate(json);
            }
            $.each({
                labels: 'label',
                options: 'update',
                values: 'val',
                messages: 'message',
                errors: 'error'
            }, function(jsonProp, fieldFn) {
                if (json[jsonProp]) {
                    $.each(json[jsonProp], function(field, val) {
                        that.field(field)[fieldFn](val);
                    }
                    );
                }
            });
            $.each(['hide', 'show', 'enable', 'disable'], function(i, key) {
                if (json[key]) {
                    that[key](json[key]);
                }
            });
            if (opts.postUpdate) {
                opts.postUpdate(json);
            }
        };
        field.input().on(opts.event, function() {
            var data = {}
            ;
            data.rows = that.s.editFields ? _pluck(that.s.editFields, 'data') : null ;
            data.row = data.rows ? data.rows[0] : null ;
            data.values = that.val();
            if (opts.data) {
                var ret = opts.data(data);
                if (ret) {
                    opts.data = ret;
                }
            }
            if (typeof url === 'function') {
                var o = url(field.val(), data, update);
                if (o) {
                    update(o);
                }
            } 
            else {
                if ($.isPlainObject(url)) {
                    $.extend(ajaxOpts, url);
                } 
                else {
                    ajaxOpts.url = url;
                }
                $.ajax($.extend(ajaxOpts, {
                    url: url,
                    data: data,
                    success: update
                }
                ));
            }
        });
        return this;
    };
    Editor.prototype.disable = function(name) {
        var fields = this.s.fields;
        $.each(this._fieldNames(name), function(i, n) {
            fields[n].disable();
        });
        return this;
    };
    Editor.prototype.display = function(show) {
        if (show === undefined) {
            return this.s.displayed;
        }
        return this[show ? 'open' : 'close']();
    };
    Editor.prototype.displayed = function() {
        return $.map(this.s.fields, function(field, name) {
            return field.displayed() ? name : null;
        });
    };
    Editor.prototype.displayNode = function() {
        return this.s.displayController.node(this);
    };
    Editor.prototype.edit = function(items, arg1, arg2, arg3, arg4) {
        var that = this;
        if (this._tidy(function() {
            that.edit(items, arg1, arg2, arg3, arg4);
        })){
            return this;
        }
        var fields = this.s.fields, argOpts = this._crudArgs(arg1, arg2, arg3, arg4);
        this._edit(items, this._dataSource('fields', items), 'main');
        this._assembleMain();
        this._formOptions(argOpts.opts);
        argOpts.maybeOpen();
        return this;
    };
    Editor.prototype.enable = function(name) {
        var fields = this.s.fields;
        $.each(this._fieldNames(name), function(i, n) {
            fields[n].enable();
        });
        return this;
    };
    Editor.prototype.error = function(name, msg) {
        if (msg === undefined) {
            this._message(this.dom.formError, name);
        } 
        else {
            this.s.fields[name].error(msg);
        }
        return this;
    };
    Editor.prototype.field = function(name) {
        return this.s.fields[name];
    };
    Editor.prototype.fields = function() {
        return $.map(this.s.fields, function(field, name) {
            return name;
        });
    };
    Editor.prototype.get = function(name) {
        var fields = this.s.fields;
        if (!name) {
            name = this.fields();
        }
        if ($.isArray(name)) {
            var out = {}
            ;
            $.each(name, function(i, n) {
                out[n] = fields[n].get();
            });
            return out;
        }
        return fields[name].get();
    };
    Editor.prototype.hide = function(names, animate) {
        var fields = this.s.fields;
        $.each(this._fieldNames(names), function(i, n) {
            fields[n].hide(animate);
        });
        return this;
    };
    Editor.prototype.inError = function(inNames) {
        if ($(this.dom.formError).is(':visible')) {
            return true;
        }
        var fields = this.s.fields
          , names = this._fieldNames(inNames);
        for (var i = 0, ien = names.length; i < ien; i++) {
            if (fields[names[i]].inError()) {
                return true;
            }
        }
        return false;
    };
    Editor.prototype.inline = function(cell, fieldName, opts) {
        var that = this;
        if ($.isPlainObject(fieldName)) {
            opts = fieldName;
            fieldName = undefined;
        }
        opts = $.extend({}, this.s.formOptions.inline, opts);
        var editFields = this._dataSource('individual', cell, fieldName), node, field, countOuter = 0, countInner, closed = false;
        $.each(editFields, function(i, editField) {
            if (countOuter > 0) {
                throw 'Cannot edit more than one row inline at a time';
            }
            node = $(editField.attach[0]);
            countInner = 0;
            $.each(editField.displayFields, function(j, f) {
                if (countInner > 0) {
                    throw 'Cannot edit more than one field inline at a time';
                }
                field = f;
                countInner++;
            });
            countOuter++;
        });
        if ($('div.DTE_Field', node).length) {
            return this;
        }
        if (this._tidy(function() {
            that.inline(cell, fieldName, opts);
        }
        )) {
            return this;
        }
        this._edit(cell, editFields, 'inline');
        var namespace = this._formOptions(opts)
          , ret = this._preopen('inline');
        if (!ret) {
            return this;
        }
        var children = node.contents().detach();
        node.append($('<div class="DTE DTE_Inline">' + '<div class="DTE_Inline_Field"/>' + '<div class="DTE_Inline_Buttons"/>' + '</div>'));
        node.find('div.DTE_Inline_Field').append(field.node());
        if (opts.buttons) {
            node.find('div.DTE_Inline_Buttons').append(this.dom.buttons);
        }
        this._closeReg(function(submitComplete) {
            closed = true;
            $(document).off('click' + namespace);
            if (!submitComplete) {
                node.contents().detach();
                node.append(children);
            }
            that._clearDynamicInfo();
        });
        setTimeout(function() {
            if (closed) {
                return;
            }
            $(document).on('click' + namespace, function(e) {
                var back = $.fn.addBack ? 'addBack' : 'andSelf';
                if (!field._typeFn('owns', e.target) && $.inArray(node[0], $(e.target).parents()[back]()) === -1) {
                    that.blur();
                }
            });
        }, 0);
        this._focus([field], opts.focus);
        this._postopen('inline');
        return this;
    };
    Editor.prototype.message = function(name, msg) {
        if (msg === undefined) {
            this._message(this.dom.formInfo, name);
        } 
        else {
            this.s.fields[name].message(msg);
        }
        return this;
    };
    Editor.prototype.mode = function() {
        return this.s.action;
    };
    Editor.prototype.modifier = function() {
        return this.s.modifier;
    };
    Editor.prototype.multiGet = function(fieldNames) {
        var fields = this.s.fields;
        if (fieldNames === undefined) {
            fieldNames = this.fields();
        }
        if ($.isArray(fieldNames)) {
            var out = {}
            ;
            $.each(fieldNames, function(i, name) {
                out.name = fields[name].multiGet();
            });
            return out;
        }
        return fields[fieldNames].multiGet();
    };
    Editor.prototype.multiSet = function(fieldNames, val) {
        var fields = this.s.fields;
        if ($.isPlainObject(fieldNames) && val === undefined) {
            $.each(fieldNames, function(name, value) {
                fields[name].multiSet(value);
            });
        } 
        else {
            fields[fieldNames].multiSet(val);
        }
        return this;
    };
    Editor.prototype.node = function(name) {
        var fields = this.s.fields;
        if (!name) {
            name = this.order();
        }
        return $.isArray(name) ? $.map(name, function(n) {
            return fields[n].node();
        }
        ) : fields[name].node();
    };
    Editor.prototype.off = function(name, fn) {
        $(this).off(this._eventName(name), fn);
        return this;
    };
    Editor.prototype.on = function(name, fn) {
        $(this).on(this._eventName(name), fn);
        return this;
    };
    Editor.prototype.one = function(name, fn) {
        $(this).one(this._eventName(name), fn);
        return this;
    };
    Editor.prototype.open = function() {
        var that = this;
        this._displayReorder();
        this._closeReg(function(submitComplete) {
            that.s.displayController.close(that, function() {
                that._clearDynamicInfo();
            });
        });
        var ret = this._preopen('main');
        if (!ret) {
            return this;
        }
        this.s.displayController.open(this, this.dom.wrapper);
        this._focus($.map(this.s.order, function(name) {
            return that.s.fields[name];
        }
        ), this.s.editOpts.focus);
        this._postopen('main');
        return this;
    };
    Editor.prototype.order = function(set) {
        if (!set) {
            return this.s.order;
        }
        if (arguments.length && !$.isArray(set)) {
            set = Array.prototype.slice.call(arguments);
        }
        if (this.s.order.slice().sort().join('-') !== set.slice().sort().join('-')) {
            throw 'All fields, and no additional fields, must be provided for ordering.';
        }
        $.extend(this.s.order, set);
        this._displayReorder();
        return this;
    };
    Editor.prototype.remove = function(items, arg1, arg2, arg3, arg4) {
        var that = this;
        if (this._tidy(function() {
            that.remove(items, arg1, arg2, arg3, arg4);
        }
        )) {
            return this;
        }
        if (items.length === undefined) {
            items = [items];
        }
        var argOpts = this._crudArgs(arg1, arg2, arg3, arg4)
          , editFields = this._dataSource('fields', items);
        this.s.action = "remove";
        this.s.modifier = items;
        this.s.editFields = editFields;
        this.dom.form.style.display = 'none';
        this._actionClass();
        this._event('initRemove', [_pluck(editFields, 'node'), _pluck(editFields, 'data'), items]);
        this._event('initMultiRemove', [editFields, items]);
        this._assembleMain();
        this._formOptions(argOpts.opts);
        argOpts.maybeOpen();
        var opts = this.s.editOpts;
        if (opts.focus !== null ) {
            $('button', this.dom.buttons).eq(opts.focus).focus();
        }
        return this;
    };
    Editor.prototype.set = function(set, val) {
        var fields = this.s.fields;
        if (!$.isPlainObject(set)) {
            var o = {}
            ;
            o[set] = val;
            set = o;
        }
        $.each(set, function(n, v) {
            fields[n].set(v);
        });
        return this;
    };
    Editor.prototype.show = function(names, animate) {
        var fields = this.s.fields;
        $.each(this._fieldNames(names), function(i, n) {
            fields[n].show(animate);
        });
        return this;
    };
    Editor.prototype.submit = function(successCallback, errorCallback, formatdata, hide) {
        var that = this
          , fields = this.s.fields
          , errorFields = []
          , errorReady = 0
          , sent = false;
        if (this.s.processing || !this.s.action) {
            return this;
        }
        this._processing(true);
        var send = function() {
            if (errorFields.length !== errorReady || sent) {
                return;
            }
            sent = true;
            that._submit(successCallback, errorCallback, formatdata, hide);
        };
        this.error();
        $.each(fields, function(name, field) {
            if (field.inError()) {
                errorFields.push(name);
            }
        });
        $.each(errorFields, function(i, name) {
            fields[name].error('', function() {
                errorReady++;
                send();
            });
        });
        send();
        return this;
    };
    Editor.prototype.title = function(title) {
        var header = $(this.dom.header).children('div.' + this.classes.header.content);
        if (title === undefined) {
            return header[html]();
        }
        if (typeof title === 'function') {
            title = title(this, new DataTable.Api(this.s.table));
        }
        header.html(title);
        return this;
    };
    Editor.prototype.val = function(field, value) {
        if (value === undefined) {
            return this.get(field);
        }
        return this.set(field, value);
    };
    var apiRegister = DataTable.Api.register;
    function __getInst(api) {
        var ctx = api.context[0];
        return ctx.oInit.editor || ctx._editor;
    }
    function __setBasic(inst, opts, type, plural) {
        if (!opts) {
            opts = {}
            ;
        }
        if (opts.buttons === undefined) {
            opts.buttons = '_basic';
        }
        if (opts.title === undefined) {
            opts.title = inst.i18n.type.title;
        }
        if (opts.message === undefined) {
            if (type === 'remove') {
                var confirm = inst.i18n.type.confirm;
                opts.message = plural !== C ? confirm[f7].replace(/%d/, plural) : confirm[M2];
            } 
            else {
                opts.message = j9r;
            }
        }
        return opts;
    }
    apiRegister('editor()', function() {
        return __getInst(this);
    }
    );
    apiRegister('row.create()', function(opts) {
        var inst = __getInst(this);
        inst.create(__setBasic(inst, opts, 'create'));
        return this;
    }
    );
    apiRegister('row().edit()', function(opts) {
        var inst = __getInst(this);
        inst.edit(this[p][p], __setBasic(inst, opts, 'edit'));
        return this;
    }
    );
    apiRegister('rows().edit()', function(opts) {
        var inst = __getInst(this);
        inst.edit(this[p], __setBasic(inst, opts, f8));
        return this;
    }
    );
    apiRegister('row().delete()', function(opts) {
        var inst = __getInst(this);
        inst.remove(this[p][p], __setBasic(inst, opts, 'remove', C));
        return this;
    }
    );
    apiRegister('rows().delete()', function(opts) {
        var inst = __getInst(this);
        inst.remove(this[0], __setBasic(inst, opts, 'remove', this[0].length));
        return this;
    }
    );
    apiRegister('cell().edit()', function(type, opts) {
        if (!type) {
            type = 'inline';
        } 
        else if ($.isPlainObject(type)) {
            opts = type;
            type = 'inline';
        }
        __getInst(this).type(this[p][p], opts);
        return this;
    }
    );
    apiRegister('cells().edit()', function(opts) {
        __getInst(this).bubble(this[p], opts);
        return this;
    }
    );
    apiRegister('file()', function(name, id) {
        return Editor.files.name[id];
    }
    );
    apiRegister('files()', function(name, value) {
        if (!name) {
            return Editor.files;
        }
        if (!value) {
            return Editor.files.name;
        }
        Editor.files.name = value;
        return this;
    }
    );
    $(document).on('xhr.dt', function(e, ctx, json) {
        if (e.namespace !== 'dt') {
            return;
        }
        if (json && json.files) {
            $.each(json.files, function(name, files) {
                Editor.files.name = files;
            });
        }
    }
    );
    Editor.error = function(msg, tn) {
        throw tn ? msg + ' For more information, please refer to https://datatables.net/tn/' + tn : msg;
    };
    Editor.pairs = function(data, props, fn) {
        var i, ien, dataPoint;
        props = $.extend({
            label: 'label',
            value: 'value'
        }, props);
        if ($.isArray(data)) {
            for (i = 0,
            ien = data.length; i < ien; i++) {
                dataPoint = data[i];
                if ($.isPlainObject(dataPoint)) {
                    fn(dataPoint[props.value] === undefined ? dataPoint[props.label] : dataPoint[props.value], dataPoint[props.label], i);
                } 
                else {
                    fn(dataPoint, dataPoint, i);
                }
            }
        } 
        else {
            i = 0;
            $.each(data, function(key, val) {
                fn(val, key, i);
                i++;
            });
        }
    };
    Editor.safeId = function(id) {
        return id.replace(/\./g, '-');
    };
    Editor.upload = function(editor, conf, files, progressCallback, completeCallback) {
        var reader = new FileReader()
          , counter = p
          , ids = []
          , generalError = 'A server error occurred while uploading the file';
        editor.error(conf.name, '');
        progressCallback(conf, conf[N1r] || '<i>Uploading file</i>');
        reader.onload = function(e) {
            var data = new FormData(), ajax;
            data.append('action', 'upload');
            data.append('uploadField', conf.name);
            data.append('upload', files[counter]);
            if (conf.ajaxData) {
                conf[x68](data);
            }
            if (conf.ajax) {
                ajax = conf.ajax;
            } 
            else if (typeof editor.s.ajax === 'string' || $.isPlainObject(editor.s.ajax)) {
                ajax = editor.s.ajax;
            }
            if (!ajax) {
                throw 'No Ajax option specified for upload plug-in';
            }
            if (typeof ajax === 'string') {
                ajax = {
                    url: ajax
                }
                ;
            }
            var submit = false;
            editor.on('preSubmit.DTE_Upload', function() {
                submit = true;
                return false;
            });
            $.ajax($.extend({}
            , ajax, {
                type: 'post',
                data: data,
                dataType: 'json',
                contentType: false,
                processData: false,
                xhr: function() {
                    var xhr = $[X58].xhr();
                    if (xhr.upload) {
                        xhr.upload[B78] = function(e) {
                            if (e.lengthComputable) {
                                var percent = (e[Y38] / e[q7] * 100).toFixed(0) + "%";
                                progressCallback(conf, files.length === 1 ? percent : counter + ':' + files.length + ' ' + percent);
                            }
                        }
                        ;
                        xhr.upload[R9V] = function(e) {
                            progressCallback(conf);
                        }
                        ;
                    }
                    return xhr;
                }
                ,
                success: function(json) {
                    editor.off('preSubmit.DTE_Upload');
                    if (json.fieldErrors && json.fieldErrors.length) {
                        var errors = json.fieldErrors;
                        for (var i = 0, ien = errors.length; i < ien; i++) {
                            editor.error(errors[i].name, errors[i].status);
                        }
                    } 
                    else if (json.error) {
                        editor.error(json.error);
                    } 
                    else if (!json.upload || !json.upload.id) {
                        editor.error(conf.name, generalError);
                    } 
                    else {
                        if (json.files) {
                            $.each(json.files, function(name, value) {
                                Editor.files.name = value;
                            }
                            );
                        }
                        ids.push(json.upload.id);
                        if (counter < files.length - 1) {
                            counter++;
                            reader.readAsDataURL(files[counter]);
                        } 
                        else {
                            completeCallback.call(editor, ids);
                            if (submit) {
                                editor.submit();
                            }
                        }
                    }
                }
                ,
                error: function() {
                    editor.error(conf.name, generalError);
                }
            }
            ));
        };
        reader.readAsDataURL(files[0]);
    };
    Editor.prototype._constructor = function(init) {
        init = $.extend(true, {}, Editor.defaults, init);
        this.s = $.extend(true, {}, Editor.models.settings, {
            table: init.domTable || init.table,
            dbTable: init.dbTable || null,
            ajaxUrl: init.ajaxUrl,
            ajax: init.ajax,
            idSrc: init.idSrc,
            dataSource: init.domTable || init.table ? Editor.dataSources.dataTable : Editor.dataSources.html,
            formOptions: init.formOptions,
            legacyAjax: init.legacyAjax
        });
        this.classes = $.extend(true, {}, Editor.classes);
        this.i18n = init.i18n;
        var that = this
          , classes = this.classes;
        this.dom = {
            "wrapper": $('<div class="' + classes.wrapper + '">' + '<div data-dte-e="processing" class="' 
                + classes.processing.indicator + '"></div>' + '<div data-dte-e="body" class="' + classes.body.wrapper 
                + '">' + '<div data-dte-e="body_content" class="' + classes.body.content + '"/>' + '</div>' 
                + '<div data-dte-e="foot" class="' + classes.footer.wrapper + '">' + '<div class="' 
                + classes.footer.content + '"/>' + '</div>' + '</div>')[0],
            "form": $('<form data-dte-e="form" class="' + classes.form.tag + '">' 
                + '<div data-dte-e="form_content" class="' + classes.form.content + '"/>' + '</form>')[0],
            "formError": $('<div data-dte-e="form_error" class="' + classes.form.error + '"/>')[0],
            "formInfo": $('<div data-dte-e="form_info" class="' + classes.form.info + '"/>')[0],
            "header": $('<div data-dte-e="head" class="' + classes.header.wrapper + '"><div class="' 
                + classes.header.content + '"/></div>')[0],
            "buttons": $('<div data-dte-e="form_buttons" class="' + classes.form.buttons + '"/>')[0]
        };
        if ($.fn.dataTable.TableTools) {
            var ttButtons = $.fn.dataTable.TableTools.BUTTONS
              , i18n = this.i18n;
            $.each(['create', 'edit', 'remove'], function(i, val) {
                ttButtons['editor_' + val].sButtonText = i18n[val].button;
            });
        }
        $.each(init.events, function(evt, fn) {
            that.on(evt, function() {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                fn.apply(that, args);
            });
        });
        var dom = this.dom
          , wrapper = dom.wrapper;
        dom.formContent = _editor_el('form_content', dom.form)[0];
        dom.footer = _editor_el('foot', wrapper)[0];
        dom.body = _editor_el('body', wrapper)[0];
        dom.bodyContent = _editor_el('body_content', wrapper)[0];
        dom.processing = _editor_el('processing', wrapper)[0];
        if (init.fields) {
            this.add(init.fields);
        }
        $(document).on('init.dt.dte', function(e, settings, json) {
            if (that.s.table && settings.nTable === $(that.s.table).get('0')) {
                settings._editor = that;
            }
        }
        ).on('xhr.dt', function(e, settings, json) {
            if (json && that.s.table && settings.nTable === $(that.s.table).get('0')) {
                that._optionsUpdate(json);
            }
        });
        this.s.displayController = Editor.display[init.display].init(this);
        this._event('initComplete', []);
    };
    Editor.prototype._actionClass = function() {
        var classesActions = this.classes.actions
          , action = this.s.action
          , wrapper = $(this.dom.wrapper);
        wrapper.removeClass([classesActions.create, classesActions.edit, classesActions.remove].join(' '));
        if (action === 'create') {
            wrapper.addClass(classesActions.create);
        } 
        else if (action === 'edit') {
            wrapper.addClass(classesActions.edit);
        } 
        else if (action === 'remove') {
            wrapper.addClass(classesActions.remove);
        }
    };
    Editor.prototype._ajax = function(data, success, error) {
        var opts = {
            type: 'POST',
            dataType: 'json',
            data: null ,
            error: error,
            success: function(json, status, xhr) {
                if (xhr.status === 204) {
                    json = {};
                }
                success(json);
            }}, a, action = this.s.action, ajaxSrc = this.s.ajax || this.s.ajaxUrl, 
            id = action === 'edit' || action === 'remove' ? _pluck(this.s.editFields, 'idSrc') : null ;
        if ($.isArray(id)) {
            id = id.join(',');
        }
        if ($.isPlainObject(ajaxSrc) && ajaxSrc[action]) {
            ajaxSrc = ajaxSrc[action];
        }
        if ($.isFunction(ajaxSrc)) {
            var uri = null 
              , method = null ;
            if (this.s.ajaxUrl) {
                var url = this.s.ajaxUrl;
                if (url.create) {
                    uri = url[action];
                }
                if (uri.indexOf(' ') !== -1) {
                    a = uri.split(' ');
                    method = a[0];
                    uri = a[1];
                }
                uri = uri.replace(/_id_/, id);
            }
            ajaxSrc(method, uri, data, success, error);
            return;
        } 
        else if (typeof ajaxSrc === 'string') {
            if (ajaxSrc.indexOf(' ') !== -1) {
                a = ajaxSrc.split(' ');
                opts.type = a[0];
                opts.url = a[1];
            } 
            else {
                opts.url = ajaxSrc;
            }
        } 
        else {
            opts = $.extend({}
            , opts, ajaxSrc || {}
            );
        }
        if(opts.url===undefined || opts.url==''){
            editor._processing(false);
            editor.error('未调设置ajax参数');
            return;
        }
        opts.url = opts.url.replace(/_id_/, id);
        if (opts.data) {
            var newData = $.isFunction(opts.data) ? opts.data(data) : opts.data;
            data = $.isFunction(opts.data) && newData ? newData : $.extend(true, data, newData);
        }
        opts.data = data;
        if (opts.type === 'DELETE') {
            var params = $.param(opts.data);
            opts.url += opts.url.indexOf('?') === -1 ? '?' + params : '&' + params;
            delete opts.data;
        }
        $.ajax(opts);
    };
    Editor.prototype._assembleMain = function() {
        var dom = this.dom;
        $(dom.wrapper).prepend(dom.header);
        $(dom.footer).append(dom.formError).append(dom.buttons);
        $(dom.bodyContent).append(dom.formInfo).append(dom.form);
    };
    Editor.prototype._blur = function() {
        var opts = this.s.editOpts;
        if (this._event('preBlur') === false) {
            return;
        }
        if (opts.onBlur === 'submit') {
            this.submit();
        } 
        else if (opts['onBlur'] === 'close') {
            this._close();
        }
    };
    Editor.prototype._clearDynamicInfo = function() {
        var errorClass = this.classes.field.error
          , fields = this.s.fields;
        $('div.' + errorClass, this.dom.wrapper).removeClass(errorClass);
        $.each(fields, function(name, field) {
            field.error('').message('');
        });
        this.error('').message('');
    };
    Editor.prototype._close = function(submitComplete) {
        if (this._event('preClose') === false) {
            return;
        }
        if (this.s.closeCb) {
            this.s.closeCb(submitComplete);
            this.s.closeCb = null;
        }
        if (this.s.closeIcb) {
            this.s.closeIcb();
            this.s.closeIcb = null;
        }
        $('body').off('focus.editor-focus');
        this.s.displayed = false;
        this._event('close');
    };
    Editor.prototype._closeReg = function(fn) {
        this.s.closeCb = fn;
    };
    Editor.prototype._crudArgs = function(arg1, arg2, arg3, arg4) {
        var that = this, title, buttons, show, opts;
        if ($.isPlainObject(arg1)) {
            opts = arg1;
        } 
        else if (typeof arg1 === 'boolean') {
            show = arg1;
            opts = arg2;
        } 
        else {
            title = arg1;
            buttons = arg2;
            show = arg3;
            opts = arg4;
        }
        if (show === undefined) {
            show = true;
        }
        if (title) {
            that.title(title);
        }
        if (buttons) {
            that.buttons(buttons);
        }
        return {
            opts: $.extend({}
            , this.s.formOptions.main, opts),
            maybeOpen: function() {
                if (show) {
                    that.open();
                }
            }
        };
    };
    Editor.prototype._dataSource = function(name) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        var fn = this.s.dataSource[name];
        if (fn) {
            return fn.apply(this, args);
        }
    };
    Editor.prototype._displayReorder = function(includeFields) {
        var formContent = $(this.dom.formContent)
          , fields = this.s.fields
          , order = this.s.order;
        if (includeFields) {
            this.s.includeFields = includeFields;
        } 
        else {
            includeFields = this.s.includeFields;
        }
        formContent.children().detach();
        $.each(order, function(i, fieldOrName) {
            var name = fieldOrName instanceof Editor.Field ? fieldOrName.name() : fieldOrName;
            if ($.inArray(name, includeFields) !== -1) {
                formContent.append(fields[name].node());
            }
        });
        this._event('displayOrder', [this.s.displayed, this.s.action, formContent]);
    };
    Editor.prototype._edit = function(items, editFields, type) {
        var that = this, fields = this.s.fields, usedFields = [], includeInOrder;
        this.s.editFields = editFields;
        this.s.modifier = items;
        this.s.action = 'edit';
        this.dom.form.style.display = 'block';
        this._actionClass();
        $.each(fields, function(name, field) {
            field.multiReset();
            includeInOrder = true;
            $.each(editFields, function(idSrc, edit) {
                if (edit.fields[name]) {
                    var val = field.valFromData(edit.data);
                    field.multiSet(idSrc, val !== undefined ? val : field.def());
                    if (edit.displayFields && !edit.displayFields[name]) {
                        includeInOrder = false;
                    }
                }
            });
            if (field.multiIds().length !== 0 && includeInOrder) {
                usedFields.push(name);
            }
        });
        var currOrder = this.order().slice();
        for (var i = currOrder.length; i >= 0; i--) {
            if ($.inArray(currOrder[i], usedFields) === -1) {
                currOrder.splice(i, 1);
            }
        }
        this._displayReorder(currOrder);
        this.s.editData = $.extend(true, {}, this.multiGet());
        this._event('initEdit', [_pluck(editFields, 'node')[0], _pluck(editFields, 'data')[0], items, type]);
        this._event('initMultiEdit', [editFields, items, type]);
    };
    Editor.prototype._event = function(trigger, args) {
        if (!args) {
            args = [];
        }
        if ($.isArray(trigger)) {
            for (var i = 0, ien = trigger.length; i < ien; i++) {
                this._event(trigger[i], args);
            }
        } 
        else {
            var e = $.Event(trigger);
            $(this).triggerHandler(e, args);
            return e.result;
        }
    };
    Editor.prototype._eventName = function(input) {
        var name, names = input.split(' ');
        for (var i = 0, ien = names.length; i < ien; i++) {
            name = names[i];
            var onStyle = name.match(/^on([A-Z])/);
            if (onStyle) {
                name = onStyle[1].toLowerCase() + name.substring(3);
            }
            names[i] = name;
        }
        return names.join(' ');
    };
    Editor.prototype._fieldNames = function(fieldNames) {
        if (fieldNames === undefined) {
            return this.fields();
        } 
        else if (!$.isArray(fieldNames)) {
            return [fieldNames];
        }
        return fieldNames;
    };
    Editor.prototype._focus = function(fieldsIn, focus) {
        var that = this, field, fields = $.map(fieldsIn, function(fieldOrName) {
            return typeof fieldOrName === 'string' ? that.s.fields[fieldOrName] : fieldOrName;
        });
        if (typeof focus === 'number') {
            field = fields[focus];
        } 
        else if (focus) {
            if (focus.indexOf('jq:') === p) {
                field = $('div.DTE ' + focus.replace(/^jq:/, ''));
            } 
            else {
                field = this.s.fields[focus];
            }
        }
        this.s.setFocus = field;
        if (field) {
            field.focus();
        }
    };
    Editor.prototype._formOptions = function(opts) {
        var that = this
          , inlineCount = __inlineCounter++
          , namespace = '.dteInline' + inlineCount;
        if (opts.closeOnComplete !== undefined) {
            opts.onComplete = opts.closeOnComplete ? 'close' : none;
        }
        if (opts.submitOnBlur !== undefined) {
            opts.onBlur = opts.submitOnBlur ? 'submit' : 'close';
        }
        if (opts.submitOnReturn !== undefined) {
            opts.onReturn = opts.submitOnReturn ? 'submit' : 'none';
        }
        if (opts.blurOnBackground !== undefined) {
            opts.onBackground = opts.blurOnBackground ? 'blur' : 'none';
        }
        this.s.editOpts = opts;
        this.s.editCount = inlineCount;
        if (typeof opts.title === 'string' || typeof opts.title === 'function') {
            this.title(opts.title);
            opts.title = true;
        }
        if (typeof opts.message === 'string' || typeof opts.message === 'function') {
            this.message(opts.message);
            opts.message = true;
        }
        if (typeof opts.buttons !== 'boolean') {
            this.buttons(opts.buttons);
            opts.buttons = true;
        }
        $(document).on('keydown' + namespace, function(e) {
            var el = $(document.activeElement)
              , name = el.length ? el[0].nodeName.toLowerCase() : null 
              , type = $(el).attr('type')
              , returnFriendlyNode = name === 'input';
            if (that.s.displayed && opts.onReturn === 'submit' && e.keyCode === 13 && returnFriendlyNode) {
                e.preventDefault();
                that.submit();
            } 
            else if (e.keyCode === 27) {
                e.preventDefault();
                switch (opts.onEsc) {
                case 'blur':
                    that.blur();
                    break;
                case 'close':
                    that.close();
                    break;
                case 'submit':
                    that.submit();
                    break;
                default:
                    break;
                }
            } 
            else if (el.parents('.DTE_Form_Buttons').length) {
                if (e.keyCode === 37) {
                    el.prev('button')[focus]();
                } 
                else if (e.keyCode === 39) {
                    el.next('button').focus();
                }
            }
        });
        this.s.closeIcb = function() {
            $(document).off('keydown' + namespace);
        };
        return namespace;
    };
    Editor.prototype._legacyAjax = function(direction, action, data) {
        if (!this.s.legacyAjax) {
            return;
        }
        if (direction === 'send') {
            if (action === 'create' || action === 'edit') {
                var id;
                $.each(data.data, function(rowId, values) {
                    if (id !== undefined) {
                        throw 'Editor: Multi-row editing is not supported by the legacy Ajax data format';
                    }
                    id = rowId;
                });
                data.data = data.data[id];
                if (action === 'edit') {
                    data.id = id;
                }
            } 
            else {
                data.id = $.map(data.data, function(values, id) {
                    return id;
                });
                delete data.data;
            }
        } 
        else {
            if (!data.data && data.row) {
                data.data = [data.row];
            } 
            else {
                data.data = [];
            }
        }
    };
    Editor.prototype._optionsUpdate = function(json) {
        var that = this;
        if (json.options) {
            $.each(this.s.fields, function(name, field) {
                if (json['options'][name] !== undefined) {
                    var fieldInst = that["field"](name);
                    if (fieldInst && fieldInst.update) {
                        fieldInst.update(json['options'][name]);
                    }
                }
            });
        }
    };
    Editor.prototype._message = function(el, msg) {
        if (typeof msg === 'function') {
            msg = msg(this, new DataTable.Api(this.s.table));
        }
        el = $(el);
        if (!msg && this.s.displayed) {
            el.stop().fadeOut(function() {
                el.html('');
            });
        } 
        else if (!msg) {
            el.html('').css('display', 'none');
        } 
        else if (this.s.displayed) {
            el.stop().html(msg).fadeIn();
        } 
        else {
            el.html(msg).css('display', 'block');
        }
    };
    Editor.prototype._multiInfo = function() {
        var fields = this.s.fields
          , include = this.s.includeFields
          , show = true;
        if (!include) {
            return;
        }
        for (var i = 0, ien = include.length; i < ien; i++) {
            var field = fields[include[i]];
            if (field.isMultiValue() && show) {
                fields[include[i]].multiInfoShown(show);
                show = false;
            } 
            else {
                fields[include[i]].multiInfoShown(false);
            }
        }
    };
    Editor.prototype._postopen = function(type) {
        var that = this
          , focusCapture = this.s.displayController.captureFocus;
        if (focusCapture === undefined) {
            focusCapture = true;
        }
        $(this.dom.form).off('submit.editor-internal').on('submit.editor-internal', function(e) {
            e.preventDefault();
        });
        if (focusCapture && (type === 'main' || type === 'bubble')) {
            $('body').on('focus.editor-focus', function() {
                if ($(document.activeElement).parents('.DTE').length === 0 && $(document.activeElement).parents('.DTED').length === 0) {
                    if (that.s.setFocus) {
                        that.s.setFocus.focus();
                    }
                }
            });
        }
        this._multiInfo();
        this._event('open', [type, this.s.action]);
        return true;
    };
    Editor.prototype._preopen = function(type) {
        if (this._event('preOpen', [type, this.s.action]) === false) {
            this._clearDynamicInfo();
            return false;
        }
        this.s.displayed = type;
        return true;
    };
    Editor.prototype._processing = function(processing) {
        var wrapper = $(this.dom.wrapper)
          , procStyle = this.dom.processing.style
          , procClass = this.classes.processing.active;
        if (processing) {
            procStyle.display = 'block';
            wrapper.addClass(procClass);
            $('div.DTE').addClass(procClass);
        } 
        else {
            procStyle.display = 'none';
            wrapper.removeClass(procClass);
            $('div.DTE').removeClass(procClass);
        }
        this.s.processing = processing;
        this._event('processing', [processing]);
    };
    Editor.prototype._submit = function(successCallback, errorCallback, formatdata, hide) {
        var that = this, i, iLen, eventRet, errorNodes, changed = false, allData = {}, 
            changedData = {}, setBuilder = DataTable.ext.oApi._fnSetObjectDataFn, dataSource = this.s.dataSource, 
            fields = this.s.fields, action = this.s.action, editCount = this.s.editCount, modifier = this.s.modifier, 
            editFields = this.s.editFields, editData = this.s.editData, opts = this.s.editOpts, changedSubmit = opts.submit, 
            submitParams = {
                "action": this.s.action,
                "data": {}
            }, submitParamsLocal;
        if (this.s.dbTable) {
            submitParams.table = this.s.dbTable;
        }
        if (action === 'create' || action === 'edit') {
            $.each(editFields, function(idSrc, edit) {
                var allRowData = {}, changedRowData = {};
                $.each(fields, function(name, field) {
                    if (edit.fields[name]) {
                        var value = field.multiGet(idSrc)
                          , builder = setBuilder(name)
                          , manyBuilder = $.isArray(value) && name.indexOf('[]') !== -1 ? setBuilder(name.replace(/\[.*$/, '') + '-many-count') : null;
                        builder(allRowData, value);
                        if (manyBuilder) {
                            manyBuilder(allRowData, value.length);
                        }
                        if (action === 'edit' && value !== editData.name[idSrc]) {
                            builder(changedRowData, value);
                            changed = true;
                            if (manyBuilder) {
                                manyBuilder(changedRowData, value.length);
                            }
                        }
                    }
                });
                if (!$.isEmptyObject(allRowData)) {
                    allData[idSrc] = allRowData;
                }
                if (!$.isEmptyObject(changedRowData)) {
                    changedData[idSrc] = changedRowData;
                }
            });
            if (action === 'create' || changedSubmit === 'all' || (changedSubmit === "allIfChanged" && changed)) {
                submitParams.data = allData;
            } 
            else if (changedSubmit === 'changed' && changed) {
                submitParams.data = changedData;
            } 
            else {
                this.s.action = null;
                if (opts.onComplete === 'close' && (hide === undefined || hide)) {
                    this._close(false);
                }
                if (successCallback) {
                    successCallback.call(this);
                }
                this._processing(false);
                this._event('submitComplete');
                return;
            }
        } 
        else if (action === 'remove') {
            $.each(editFields, function(idSrc, edit) {
                submitParams.data[idSrc] = edit.data;
            });
        }
        this._legacyAjax('send', action, submitParams);
        submitParamsLocal = $.extend(true, {}, submitParams);
        if (formatdata) {
            formatdata(submitParams);
        }
        if (this._event('preSubmit', [submitParams, action]) === false) {
            this._processing(false);
            return;
        }
        this._ajax(submitParams, function(json) {
            var setData;
            that._legacyAjax('receive', action, json);
            that._event('postSubmit', [json, submitParams, action]);
            if (!json.error) {
                json.error = "";
            }
            if (!json.fieldErrors) {
                json.fieldErrors = [];
            }
            if (json.error || json.fieldErrors.length) {
                that.error(json.error);
                $.each(json.fieldErrors, function(i, err) {
                    var field = fields[err.name];
                    field.error(err.status || 'Error');
                    if (i === 0) {
                        $(that.dom.bodyContent, that.s.wrapper).animate({
                            "scrollTop": $(field.node()).position().top
                        }
                        , 500);
                        field.focus();
                    }
                });
                if (errorCallback) {
                    errorCallback.call(that, json);
                }
            } 
            else {
                var store = {};
                that._dataSource('prep', action, modifier, submitParamsLocal, json.data, store);
                if (action === "create" || action === "edit") {
                    for (i = 0; i < json.data.length; i++) {
                        setData = json.data[i];
                        that._event('setData', [json, setData, action]);
                        if (action === 'create') {
                            that._event('preCreate', [json, setData]);
                            that._dataSource('create', fields, setData, store);
                            that._event(['create', 'postCreate'], [json, setData]);
                        } 
                        else if (action === "edit") {
                            that._event('preEdit', [json, setData]);
                            that._dataSource('edit', modifier, fields, setData, store);
                            that._event(['edit', 'postEdit'], [json, setData]);
                        }
                    }
                } 
                else if (action === 'remove') {
                    that._event('preRemove', [json]);
                    that._dataSource('remove', modifier, fields, store);
                    that._event(['remove', 'postRemove'], [json]);
                }
                that._dataSource('commit', action, modifier, json.data, store);
                if (editCount === that.s.editCount) {
                    that.s.action = null;
                    if (opts.onComplete === 'close' && (hide === undefined || hide)) {
                        that._close(true);
                    }
                }
                if (successCallback) {
                    successCallback.call(that, json);
                }
                that._event('submitSuccess', [json, setData]);
            }
            that._processing(false);
            that._event('submitComplete', [json, setData]);
        }, function(xhr, err, thrown) {
            that._event('postSubmit', [xhr, err, thrown, submitParams]);
            var errobj = eval("(" + xhr.responseText + ")");
            if (errobj.exceptionType == undefined) {
                if (errobj.modelState == undefined) {
                    that.error(that.i18n.error.system);
                } else {
                    $.each(errobj.modelState, function (k, v) {
                        that.error(v);
                        return false;
                    })
                }
            } else {
                switch (errobj.exceptionType) {
                    case "System.Web.HttpRequestValidationException":
                        that.error("在输入信息中包含非法或有潜在危险的值，请重新修改后再提交");
                        break;
                    case "System.Data.Entity.Validation.DbEntityValidationException":
                        that.error("输入信息已超出规定范围，请重新修改后再提交");
                        break;
                    case "System.ArgumentException":
                        that.error(errobj.exceptionMessage);
                        break;
                    case "System.ArgumentNullException":
                        that.error(errobj.exceptionMessage);
                        break;
                    default:
                        that.error(that.i18n.error.system);
                        break;
                }
            }

            that._processing(false);
            if (errorCallback) {
                errorCallback.call(that, xhr, err, thrown);
            }
            that._event(['submitError', 'submitComplete'], [xhr, err, thrown, submitParams]);
        });
    };
    Editor.prototype._tidy = function(fn) {
        var that = this
          , dt = this.s.table ? new $.fn.dataTable.Api(this.s.table) : null
          , ssp = false;
        if (dt) {
            ssp = dt.settings()[0].oFeatures.bServerSide;
        }
        if (this.s.processing) {
            this.one('submitComplete', function() {
                if (ssp) {
                    dt.one('draw', fn);
                } 
                else {
                    setTimeout(function() {
                        fn();
                    }
                    , 10);
                }
            });
            return true;
        } 
        else if (this.display() === 'inline' || this.display() === 'bubble') {
            this.one('close', function() {
                if (!that.s.processing) {
                    setTimeout(function() {
                        fn();
                    }
                    , 10);
                } 
                else {
                    that[K28](s0j, function(e, json) {
                        if (ssp && json) {
                            dt.one(J28, fn);
                        } 
                        else {
                            setTimeout(function() {
                                fn();
                            }
                            , 10);
                        }
                    }
                    );
                }
            }
            ).blur();
            return true;
        }
        return false;
    };
    Editor.defaults = {
        "table": null,
        "ajaxUrl": null,
        "fields": [],
        "display": 'lightbox',
        "ajax": null,
        "idSrc": 'DT_RowId',
        "events": {},
        "i18n": {
            "create": {
                "button": '添加',
                "title": '添加新记录',
                "submit": '添加'
            },
            "edit": {
                "button": '编辑',
                "title": '编辑记录',
                "submit": '修改'
            },
            "remove": {
                "button": '删除',
                "title": '删除记录',
                "submit": '删除',
                "confirm": {
                    "_": '您确定要删除 %d 行吗？',
                    "1": '您确定要删除 1 行吗？'
                }
            },
            "error": {
                "system": '系统错误，请联系昆明道讯科技有限公司。'
            },
            "multi": {
                "title": 'Multiple values',
                "info": 'The selected items contain different values for this input. ' +
                    'To edit and set all items for this input to the same value, click or tap here, ' +
                    'otherwise they will retain their individual values.',
                "restore": 'Undo changes'
            },
            "datetime": {
                previous: 'Previous',
                next: 'Next',
                months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                weekdays: ['日', '一', '二', '三', '四', '五', '六'],
                amPm: ['上午', '下午'],
                unknown: '-'
            }
        },
        formOptions: {
            bubble: $.extend({}
            , Editor.models.formOptions, {
                title: false,
                message: false,
                buttons: '_basic',
                submit: 'changed'
            }
            ),
            inline: $.extend({}
            , Editor.models.formOptions, {
                buttons: false,
                submit: 'changed'
            }
            ),
            main: $.extend({}
            , Editor.models.formOptions)
        },
        legacyAjax: false
    };
    (function() {
        var __dataSources = Editor.dataSources = {}
          
        , __dtIsSsp = function(dt) {
            return dt.settings()[0].oFeatures.bServerSide;
        }
          
        , __dtApi = function(table) {
            return $(table).DataTable();
        }
          
        , __dtHighlight = function(node) {
            node = $(node);
            setTimeout(function() {
                node.addClass('highlight');
                setTimeout(function() {
                    node.addClass('noHighlight').removeClass('highlight');
                    setTimeout(function() {
                        node.removeClass('noHighlight');
                    }
                    , 550);
                }
                , 500);
            }, 20);
        }
          
        , __dtRowSelector = function(out, dt, identifier, fields, idFn) {
            dt.rows(identifier).indexes().each(function(idx) {
                var row = dt.row(idx);
                var data = row.data();
                var idSrc = idFn(data);
                if (idSrc === undefined) {
                    Editor.error('Unable to find row identifier', 14);
                }
                out[idSrc] = {
                    idSrc: idSrc,
                    data: data,
                    node: row.node(),
                    fields: fields,
                    type: 'row'
                }
                ;
            });
        }
          
        , __dtColumnSelector = function(out, dt, identifier, fields, idFn) {
            dt.cells(null , identifier).indexes().each(function(idx) {
                __dtCellSelector(out, dt, idx, fields, idFn);
            });
        }
          
        , __dtCellSelector = function(out, dt, identifier, allFields, idFn, forceFields) {
            dt.cells(identifier).indexes().each(function(idx) {
                var cell = dt.cell(idx);
                var row = dt.row(idx.row);
                var data = row.data();
                var idSrc = idFn(data);
                var fields = forceFields || __dtFieldsFromIdx(dt, allFields, idx.column);
                __dtRowSelector(out, dt, idx.row, allFields, idFn);
                out[idSrc].attach = [cell.node()];
                out[idSrc].displayFields = fields;
            });
        }
          
        , __dtFieldsFromIdx = function(dt, fields, idx) {
            var field;
            var col = dt.settings()[0].aoColumns[idx];
            var dataSrc = col.editField !== undefined ? col[f78] : col.mData;
            var resolvedFields = {}
            ;
            var run = function(field, dataSrc) {
                if (field.dataSrc() === dataSrc) {
                    resolvedFields[field.name()] = field;
                }
            }
            ;
            $.each(fields, function(name, fieldInst) {
                if ($.isArray(dataSrc)) {
                    for (var i = 0; i < dataSrc.length; i++) {
                        run(fieldInst, dataSrc[i]);
                    }
                } 
                else {
                    run(fieldInst, dataSrc);
                }
            });
            if ($.isEmptyObject(resolvedFields)) {
                Editor.error('Unable to automatically determine field from source. Please specify the field name.', 11);
            }
            return resolvedFields;
        };
        __dataSources.dataTable = {
            individual: function(identifier, fieldNames) {
                var idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc), dt = __dtApi(this.s.table), fields = this.s.fields, out = {}
                , forceFields, responsiveNode;
                if (identifier[N8j] && $(identifier).hasClass('dtr-data')) {
                    responsiveNode = identifier;
                    identifier = dt.responsive[Y7V]($(identifier).closest('li'));
                }
                if (fieldNames) {
                    if (!$.isArray(fieldNames)) {
                        fieldNames = [fieldNames];
                    }
                    forceFields = {}
                    ;
                    $.each(fieldNames, function(i, name) {
                        forceFields.name = fields[name];
                    }
                    );
                }
                __dtCellSelector(out, dt, identifier, fields, idFn, forceFields);
                if (responsiveNode) {
                    $.each(out, function(i, val) {
                        val.attach = [responsiveNode];
                    }
                    );
                }
                return out;
            },
            fields: function(identifier) {
                var idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc)
                  , dt = __dtApi(this.s.table)
                  , fields = this.s.fields
                  , out = {}
                ;
                if ($.isPlainObject(identifier) && (identifier.rows !== undefined || identifier.columns !== undefined || identifier.cells !== undefined)) {
                    if (identifier.rows !== undefined) {
                        __dtRowSelector(out, dt, identifier.rows, fields, idFn);
                    }
                    if (identifier.columns !== undefined) {
                        __dtColumnSelector(out, dt, identifier.columns, fields, idFn);
                    }
                    if (identifier.cells !== undefined) {
                        __dtCellSelector(out, dt, identifier.cells, fields, idFn);
                    }
                } 
                else {
                    __dtRowSelector(out, dt, identifier, fields, idFn);
                }
                return out;
            },
            create: function(fields, data) {
                var dt = __dtApi(this.s.table);
                if (!__dtIsSsp(dt)) {
                    var row = dt.row.add(data);
                    __dtHighlight(row.node());
                }
            },
            edit: function(identifier, fields, data, store) {
                var dt = __dtApi(this.s.table);
                if (!__dtIsSsp(dt)) {
                    var idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc), rowId = idFn(data), row;
                    row = dt.row('#' + rowId);
                    if (!row.any()) {
                        row = dt.row(function(rowIdx, rowData, rowNode) {
                            return rowId == idFn(rowData);
                        });
                    }
                    if (row.any()) {
                        row.data(data);
                        var idx = $.inArray(rowId, store.rowIds);
                        store.rowIds.splice(idx, 1);
                    } 
                    else {
                        row = dt.row.add(data);
                    }
                    __dtHighlight(row.node());
                }
            },
            remove: function(identifier, fields) {
                var dt = __dtApi(this.s.table);
                if (!__dtIsSsp(dt)) {
                    dt.rows(identifier).remove();
                }
            },
            prep: function(action, identifier, submit, data, store) {
                if (action === 'edit') {
                    store.rowIds = $.map(submit.data, function(val, key) {
                        if (!$.isEmptyObject(submit.data[key])) {
                            return key;
                        }
                    }
                    );
                }
            },
            commit: function(action, identifier, data, store) {
                var dt = __dtApi(this.s.table);
                if (action === 'edit' && store.rowIds.length) {
                    var ids = store.rowIds, idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc), row;
                    for (var i = 0, ien = ids.length; i < ien; i++) {
                        row = dt.row('#' + ids[i]);
                        if (!row.any()) {
                            row = dt.row(function(rowIdx, rowData, rowNode) {
                                return ids[i] === idFn(rowData);
                            }
                            );
                        }
                        if (row.any()) {
                            row.remove();
                        }
                    }
                }
                var drawType = this.s.editOpts.drawType;
                if (drawType !== 'none') {
                    dt.draw(drawType);
                }
            }
        };
        function __html_set(identifier, fields, data) {
            $.each(data, function(name, value) {
                var field = fields[name];
                if (field) {
                    __html_el(identifier, field.dataSrc()).each(function() {
                        while (this.childNodes.length) {
                            this.removeChild(this.firstChild);
                        }
                    }
                    ).html(field.valFromData(data));
                }
            });
        }
        function __html_els(identifier, names) {
            var out = $();
            for (var i = 0, ien = names.length; i < ien; i++) {
                out = out.add(__html_el(identifier, names[i]));
            }
            return out;
        }
        function __html_el(identifier, name) {
            var context = identifier === 'keyless' ? document : $('[data-editor-id="' + identifier + '"]');
            return $('[data-editor-field="' + name + '"]', context);
        }
        __dataSources.html = {
            initField: function(cfg) {
                var label = $('[data-editor-label="' + (cfg.data || cfg.name) + '"]');
                if (!cfg.label && label.length) {
                    cfg.label = label.html();
                }
            },
            individual: function(identifier, fieldNames) {
                if (identifier instanceof $ || identifier.nodeName) {
                    if (!fieldNames) {
                        fieldNames = [$(identifier).attr('data-editor-field')];
                    }
                    identifier = $(identifier).parents('[data-editor-id]').data('editor-id');
                }
                if (!identifier) {
                    identifier = 'keyless';
                }
                if (fieldNames && !$.isArray(fieldNames)) {
                    fieldNames = [fieldNames];
                }
                if (!fieldNames || fieldNames.length === 0) {
                    throw 'Cannot automatically determine field name from data source';
                }
                var out = __dataSources.html.fields.call(this, identifier)
                  , fields = this.s.fields
                  , forceFields = {}
                ;
                $.each(fieldNames, function(i, name) {
                    forceFields.name = fields[name];
                });
                $.each(out, function(id, set) {
                    set.type = 'cell';
                    set.attach = __html_els(identifier, fieldNames).toArray();
                    set.fields = fields;
                    set.displayFields = forceFields;
                });
                return out;
            },
            fields: function(identifier) {
                var out = {}
                  
                , data = {}
                  
                , fields = this.s.fields;
                if (!identifier) {
                    identifier = 'keyless';
                }
                $.each(fields, function(name, field) {
                    var val = __html_el(identifier, field.dataSrc()).html();
                    field.valToData(data, val === null  ? undefined : val);
                });
                out[identifier] = {
                    idSrc: identifier,
                    data: data,
                    node: document,
                    fields: fields,
                    type: 'row'
                }
                ;
                return out;
            },
            create: function(fields, data) {
                if (data) {
                    var idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc)
                      , id = idFn(data);
                    if ($('[data-editor-id="' + id + '"]').length) {
                        __html_set(id, fields, data);
                    }
                }
            },
            edit: function(identifier, fields, data) {
                var idFn = DataTable.ext.oApi._fnGetObjectDataFn(this.s.idSrc)
                  , id = idFn(data) || 'keyless';
                __html_set(id, fields, data);
            },
            remove: function(identifier, fields) {
                $('[data-editor-id="' + identifier + '"]').remove();
            }
        };
    }
    ());
    Editor.classes = {
        "wrapper": 'DTE',
        "processing": {
            "indicator": 'DTE_Processing_Indicator',
            "active": 'DTE_Processing'
        },
        "header": {
            "wrapper": 'DTE_Header',
            "content": 'DTE_Header_Content'
        },
        "body": {
            "wrapper": 'DTE_Body',
            "content": 'DTE_Body_Content'
        },
        "footer": {
            "wrapper": 'DTE_Footer',
            "content": 'DTE_Footer_Content'
        },
        "form": {
            "wrapper": 'DTE_Form',
            "content": 'DTE_Form_Content',
            "tag": '',
            "info": 'DTE_Form_Info',
            "error": 'DTE_Form_Error c-danger',
            "buttons": 'DTE_Form_Buttons',
            "button": 'btn'
        },
        "field": {
            "wrapper": 'DTE_Field',
            "typePrefix": 'DTE_Field_Type_',
            "namePrefix": 'DTE_Field_Name_',
            "label": 'DTE_Label',
            "input": 'DTE_Field_Input',
            "inputControl": 'DTE_Field_InputControl',
            "error": 'DTE_Field_StateError c-danger',
            "msg-label": 'DTE_Label_Info',
            "msg-error": 'DTE_Field_Error c-danger',
            "msg-message": 'DTE_Field_Message',
            "msg-info": 'DTE_Field_Info',
            "multiValue": 'multi-value',
            "multiInfo": 'multi-info',
            "multiRestore": 'multi-restore'
        },
        "actions": {
            "create": 'DTE_Action_Create',
            "edit": 'DTE_Action_Edit',
            "remove": 'DTE_Action_Remove'
        },
        "bubble": {
            "wrapper": 'DTE DTE_Bubble',
            "liner": 'DTE_Bubble_Liner',
            "table": 'DTE_Bubble_Table',
            "close": 'DTE_Bubble_Close',
            "pointer": 'DTE_Bubble_Triangle',
            "bg": 'DTE_Bubble_Background'
        }
    };
    if (DataTable.TableTools) {
        var ttButtons = DataTable.TableTools.BUTTONS
          , ttButtonBase = {
            sButtonText: null,
            editor: null,
            formTitle: null
        };
        ttButtons.editor_create = $.extend(true, ttButtons.text, ttButtonBase, {
            formButtons: [{
                label: null,
                fn: function(e) {
                    this.submit();
                }
            }
            ],
            fnClick: function(button, config) {
                var editor = config.editor
                  , i18nCreate = editor.i18n.create
                  , buttons = config.formButtons;
                if (!buttons[p].label) {
                    buttons[p].label = i18nCreate.submit;
                }
                editor.create({
                    title: i18nCreate.title,
                    buttons: buttons
                });
            }
        });
        ttButtons.editor_edit = $.extend(true, ttButtons.select_single, ttButtonBase, {
            formButtons: [{
                label: null ,
                fn: function(e) {
                    this.submit();
                }
            }
            ],
            fnClick: function(button, config) {
                var selected = this.fnGetSelectedIndexes();
                if (selected.length !== 1) {
                    return;
                }
                var editor = config.editor
                  , i18nEdit = editor.i18n.edit
                  , buttons = config.formButtons;
                if (!buttons[0].label) {
                    buttons[0].label = i18nEdit.submit;
                }
                editor.edit(selected[0], {
                    title: i18nEdit.title,
                    buttons: buttons
                });
            }
        });
        ttButtons.editor_remove = $.extend(true, ttButtons.select, ttButtonBase, {
            question: null ,
            formButtons: [{
                label: null ,
                fn: function(e) {
                    var that = this;
                    this.submit(function(json) {
                        var tt = $.fn.dataTable.TableTools.fnGetInstance($(that.s.table).DataTable().table().node());
                        tt.fnSelectNone();
                    }
                    );
                }
            }
            ],
            fnClick: function(button, config) {
                var rows = this.fnGetSelectedIndexes();
                if (rows.length === 0) {
                    return;
                }
                var editor = config.editor
                  , i18nRemove = editor.i18n.remove
                  , buttons = config.formButtons
                  , question = typeof i18nRemove.confirm === 'string' ? i18nRemove.confirm : i18nRemove.confirm[rows.length] ? i18nRemove.confirm[rows.length] : i18nRemove.confirm['_'];
                if (!buttons[0].label) {
                    buttons[0].label = i18nRemove.submit;
                }
                editor.remove(rows, {
                    message: question.replace(/%d/g, rows.length),
                    title: i18nRemove.title,
                    buttons: buttons
                });
            }
        });
    }
    $.extend(DataTable.ext.buttons, {
        create: {
            text: function(dt, node, config) {
                return dt.i18n('buttons.create', config.editor.i18n.create.button);
            },
            className: 'buttons-create',
            editor: null ,
            formButtons: {
                label: function(editor) {
                    return editor.i18n.create.submit;
                }
                ,
                fn: function(e) {
                    this.submit();
                }
            },
            formMessage: null ,
            formTitle: null ,
            action: function(e, dt, node, config) {
                var editor = config.editor
                  , buttons = config.formButtons;
                editor.create({
                    buttons: config.formButtons,
                    message: config.formMessage,
                    title: config.formTitle || editor.i18n.create.title
                });
            }
        },
        edit: {
            extend: 'selected',
            text: function(dt, node, config) {
                return dt.i18n('buttons.edit', config.editor.i18n.edit.button);
            },
            className: 'buttons-edit',
            editor: null ,
            formButtons: {
                label: function(editor) {
                    return editor.i18n.edit.submit;
                }
                ,
                fn: function(e) {
                    this.submit();
                }
            },
            formMessage: null ,
            formTitle: null ,
            action: function(e, dt, node, config) {
                var editor = config.editor
                  , rows = dt.rows({
                    selected: true
                }
                ).indexes()
                  , columns = dt.columns({
                    selected: true
                }
                ).indexes()
                  , cells = dt.cells({
                    selected: true
                }
                ).indexes()
                  , items = columns.length || cells.length ? {
                    rows: rows,
                    columns: columns,
                    cells: cells
                } 
                : rows;
                editor.edit(items, {
                    message: config.formMessage,
                    buttons: config.formButtons,
                    title: config.formTitle || editor.i18n.edit.title
                });
            }
        },
        remove: {
            extend: 'selected',
            text: function(dt, node, config) {
                return dt.i18n('buttons.remove', config.editor.i18n.remove.button);
            },
            className: 'buttons-remove',
            editor: null ,
            formButtons: {
                label: function(editor) {
                    return editor.i18n.remove.submit;
                }
                ,
                fn: function(e) {
                    this.submit();
                }
            },
            formMessage: function(editor, dt) {
                var rows = dt.rows({
                    selected: true
                }
                ).indexes()
                  , i18n = editor.i18n.remove
                  , question = typeof i18n.confirm === 'string' ? i18n.confirm : i18n.confirm[rows.length] ? i18n.confirm[rows.length] : i18n.confirm['_'];
                return question.replace(/%d/g, rows.length);
            },
            formTitle: null ,
            action: function(e, dt, node, config) {
                var editor = config.editor;
                editor.remove(dt.rows({
                    selected: true
                }
                ).indexes(), {
                    buttons: config.formButtons,
                    message: config.formMessage,
                    title: config.formTitle || editor.i18n.remove.title
                });
            }
        },
        customButton: {
            className: 'buttons-customButton',
            editor: null ,
            formButtons: {
                label: function(editor) {
                    return editor.i18n.customButton.submit;
                }
                ,
                fn: function(e) {
                    this.submit();
                }
            },
            formMessage: null ,
            formTitle: null
        }
    }
    );
    Editor.fieldTypes = {};
    Editor.DateTime = function(input, opts) {this.c = $.extend(true, {} , Editor.DateTime.defaults, opts);
        var classPrefix = this.c.classPrefix
          , i18n = this.c.i18n;
        if (!window.moment && this.c.format !== 'YYYY-MM-DD') {
            throw "Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";
        }
        var timeBlock = function(type) {
            return '<div class="' + classPrefix + '-timeblock">' + '<div class="' + classPrefix + '-iconUp">' + '<button>' + i18n.previous + '</button>' 
            + '</div>' + '<div class="' + classPrefix + '-label">' + '<span/>' + '<select class="' + classPrefix + '-' + type 
            + '"/>' + '</div>' + '<div class="' + classPrefix + '-iconDown">' + '<button>' + i18n.next + '</button>' + '</div>' + '</div>';
        }, gap = function() {
            return '<span>:</span>' ;
        }, structure = $('<div class="' + classPrefix + '">' + '<div class="' + classPrefix + '-date">' + '<div class="' 
            + classPrefix + '-title">' + '<div class="' + classPrefix + '-iconLeft">' + '<button>' + i18n['previous'] 
            + '</button>' + '</div>' + '<div class="' + classPrefix + '-iconRight">' + '<button>' + i18n.next 
            + '</button>' + '</div>' + '<div class="' + classPrefix + '-label">' + '<span/>' + '<select class="' 
            + classPrefix + '-month"/>' + '</div>' + '<div class="' + classPrefix + '-label">' + '<span/>' + '<select class="' 
            + classPrefix + '-year"/>' + '</div>' + '</div>' + '<div class="' + classPrefix + '-calendar"/>' + '</div>' + '<div class="'
            + classPrefix + '-time">' + timeBlock('hours') + gap() + timeBlock('minutes') + gap() + timeBlock('seconds')
            + timeBlock('ampm') + '</div>' + '</div>');
        this.dom = {
            container: structure,
            date: structure.find('.' + classPrefix + '-date'),
            title: structure.find('.' + classPrefix + '-title'),
            calendar: structure.find('.' + classPrefix + '-calendar'),
            time: structure.find('.' + classPrefix + '-time'),
            input: $(input)
        };
        this.s = {
            d: null,
            display: null,
            namespace: 'editor-dateime-' + (Editor.DateTime._instance++),
            parts: {
                date: this.c.format.match(/[YMD]/) !== null,
                time: this.c.format.match(/[Hhm]/) !== null,
                seconds: this.c.format.indexOf('s') !== -1,
                hours12: this.c.format.match(/[haA]/) !== null
            }
        };
        this.dom.container.append(this.dom.date).append(this.dom.time);
        this.dom.date.append(this.dom.title).append(this.dom.calendar);
        this._constructor();
    };
    $.extend(Editor.DateTime.prototype, {
        destroy: function() {
            this._hide();
            this.dom.container().off('').empty();
            this.dom.input.off('.editor-datetime');
        },
        max: function(date) {
            this.c.maxDate = date;
            this._optionsTitle();
            this._setCalander();
        },
        min: function(date) {
            this.c.minDate = date;
            this._optionsTitle();
            this._setCalander();
        },
        owns: function(node) {
            return $(node).parents().filter(this.dom.container).length > 0;
        },
        val: function(set, write) {
            if (set === undefined) {
                return this.s.d;
            }
            if (set instanceof Date) {
                this.s.d = this._dateToUtc(set);
            } 
            else if (set === null  || set === '') {
                this.s.d = null ;
            } 
            else if (typeof set === 'string') {
                if (window.moment) {
                    var m = window.moment.utc(set, this.c.format, this.c.momentLocale, this.c.momentStrict);
                    this.s.d = m.isValid() ? m.toDate() : null ;
                } 
                else {
                    var match = set.match(/(\d{4})\-(\d{2})\-(\d{2})/);
                    this.s.d = match ? new Date(Date.UTC(match[1], match[2] - 1, match[3])) : null ;
                }
            }
            if (write || write === undefined) {
                if (this.s.d) {
                    this._writeOutput();
                } 
                else {
                    this.dom.input.val(set);
                }
            }
            if (!this.s.d) {
                this.s.d = this._dateToUtc(new Date());
            }
            this.s.display = new Date(this.s.d.toString());
            this._setTitle();
            this._setCalander();
            this._setTime();
        },
        _constructor: function() {
            var that = this
              , classPrefix = this.c.classPrefix
              , container = this.dom.container
              , i18n = this.c.i18n;
            if (!this.s.parts.date) {
                this.dom.date.css('display', 'none');
            }
            if (!this.s.parts.time) {
                this.dom.time.css('display', 'none');
            }
            if (!this.s.parts.seconds) {
                this.dom.time.children('div.editor-datetime-timeblock').eq(2).remove();
                this.dom.time.children('span').eq(1).remove();
            }
            if (!this.s.parts.hours12) {
                this.dom.time.children('div.editor-datetime-timeblock').last().remove();
            }
            this._optionsTitle();
            this._optionsTime('hours', this.s.parts.hours12 ? 12 : 24, 1);
            this._optionsTime('minutes', 60, this.c.minutesIncrement);
            this._optionsTime('seconds', 60, this.c.secondsIncrement);
            this._options('ampm', ['am', 'pm'], i18n.amPm);
            this.dom.input.on('focus.editor-datetime click.editor-datetime', function() {
                if (that.dom.container.is(':visible') || that.dom.input.is(':disabled')) {
                    return;
                }
                that.val(that.dom.input.val(), false);
                that._show();
            }
            ).on('keyup.editor-datetime', function() {
                if (that.dom.container.is(':visible')) {
                    that.val(that.dom.input.val(), false);
                }
            });
            this.dom.container.on('change', 'select', function() {
                var select = $(this)
                  , val = select.val();
                if (select.hasClass(classPrefix + '-month')) {
                    that.s.display.setUTCMonth(val);
                    that._setTitle();
                    that._setCalander();
                } 
                else if (select.hasClass(classPrefix + '-year')) {
                    that.s.display.setUTCFullYear(val);
                    that._setTitle();
                    that._setCalander();
                } 
                else if (select.hasClass(classPrefix + '-hours') || select.hasClass(classPrefix + '-ampm')) {
                    if (that.s.parts.hours12) {
                        var hours = $(that.dom.container).find('.' + classPrefix + '-hours').val() * 1
                          , pm = $(that.dom.container).find('.' + classPrefix + '-ampm').val() === 'pm';
                        that.s.d.setUTCHours(hours === 12 && !pm ? 0 : pm && hours !== 12 ? hours + 12 : hours);
                    } 
                    else {
                        that.s.d.setUTCHours(val);
                    }
                    that._setTime();
                    that._writeOutput(true);
                } 
                else if (select.hasClass(classPrefix + '-minutes')) {
                    that.s.d.setUTCMinutes(val);
                    that._setTime();
                    that._writeOutput(true);
                } 
                else if (select.hasClass(classPrefix + '-seconds')) {
                    that.s.d.setSeconds(val);
                    that._setTime();
                    that._writeOutput(true);
                }
                that.dom.input.focus();
                that._position();
            }
            ).on('click', function(e) {
                var nodeName = e.target.nodeName.toLowerCase();
                if (nodeName === 'select') {
                    return;
                }
                e.stopPropagation();
                if (nodeName === 'button') {
                    var button = $(e.target), parent = button.parent(), select;
                    if (parent.hasClass('disabled')) {
                        return;
                    }
                    if (parent.hasClass(classPrefix + '-iconLeft')) {
                        that.s.display.setUTCMonth(that.s.display.getUTCMonth() - 1);
                        that._setTitle();
                        that._setCalander();
                        that.dom.input.focus();
                    } 
                    else if (parent.hasClass(classPrefix + '-iconRight')) {
                        that.s.display.setUTCMonth(that.s.display.getUTCMonth() + 1);
                        that._setTitle();
                        that._setCalander();
                        that.dom.input.focus();
                    } 
                    else if (parent.hasClass(classPrefix + '-iconUp')) {
                        select = parent.parent().find('select')[0];
                        select.selectedIndex = select.selectedIndex !== select.options.length - 1 ? select.selectedIndex + 1 : 0;
                        $(select).change();
                    } 
                    else if (parent.hasClass(classPrefix + '-iconDown')) {
                        select = parent.parent().find('select')[0];
                        select.selectedIndex = select.selectedIndex === 0 ? select.options.length - 1 : select.selectedIndex - 1;
                        $(select).change();
                    } 
                    else {
                        if (!that.s.d) {
                            that.s.d = that._dateToUtc(new Date());
                        }
                        that.s.d.setUTCFullYear(button.data('year'));
                        that.s.d.setUTCMonth(button.data('month'));
                        that.s.d.setUTCDate(button.data('day'));
                        that._writeOutput(true);
                        setTimeout(function() {
                            that._hide();
                        }
                        , 10);
                    }
                } 
                else {
                    that.dom.input.focus();
                }
            });
        },
        _compareDates: function(a, b) {
            return a.toDateString() === b.toDateString();
        },
        _daysInMonth: function(year, month) {
            var isLeap = ((year % 4) === 0 && ((year % 100) !== 0 || (year % 400) === 0))
              , months = [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return months[month];
        },
        _dateToUtc: function(s) {
            return new Date(Date.UTC(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes(), s.getSeconds()));
        },
        _hide: function() {
            var namespace = this.s.namespace;
            this.dom.container.detach();
            $(window).off('.' + namespace);
            $(document).off('keydown.' + namespace);
            $('div.DTE_Body_Content').off('scroll.' + namespace);
            $('body').off('click.' + namespace);
        },
        _hours24To12: function(val) {
            return val === 0 ? 12 : val > 12 ? val - 12 : val;
        },
        _htmlDay: function(day) {
            if (day.empty) {
                return '<td class="empty"></td>' ;
            }
            var classes = ['day']
              , classPrefix = this.c.classPrefix;
            if (day.disabled) {
                classes.push('disabled');
            }
            if (day.today) {
                classes.push('today');
            }
            if (day.selected) {
                classes.push('selected');
            }
            return '<td data-day="' + day.day + '" class="' + classes.join(' ') + '">' + '<button class="' 
            + classPrefix + '-button ' + classPrefix + '-day" type="button" ' + 'data-year="' + day.year 
            + '" data-month="' + day.month + '" data-day="' + day.day + '">' + day.day + '</button>' + '</td>';
        },
        _htmlMonth: function(year, month) {
            var now = new Date()
              , days = this._daysInMonth(year, month)
              , before = new Date(Date.UTC(year, month, 1)).getUTCDay()
              , data = []
              , row = [];
            if (this.c.firstDay > 0) {
                before -= this.c.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before
              , after = cells;
            while (after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            var minDate = this.c.minDate
              , maxDate = this.c.maxDate;
            if (minDate) {
                minDate.setUTCHours(0);
                minDate.setUTCMinutes(0);
                minDate.setSeconds(0);
            }
            if (maxDate) {
                maxDate.setUTCHours(23);
                maxDate.setUTCMinutes(59);
                maxDate.setSeconds(59);
            }
            for (var i = 0, r = 0; i < cells; i++) {
                var day = new Date(Date.UTC(year, month, 1 + (i - before)))
                  , selected = this.s.d ? this._compareDates(day, this.s.d) : false
                  , today = this._compareDates(day, now)
                  , empty = i < before || i >= (days + before)
                  , disabled = (minDate && day < minDate) || (maxDate && day > maxDate)
                  , disableDays = this.c.disableDays;
                if ($.isArray(disableDays) && $.inArray(day.getUTCDay(), disableDays) !== -1) {
                    disabled = true;
                } 
                else if (typeof disableDays === 'function' && disableDays(day) === true) {
                    disabled = true;
                }
                var dayConfig = {
                    day: 1 + (i - before),
                    month: month,
                    year: year,
                    selected: selected,
                    today: today,
                    disabled: disabled,
                    empty: empty
                }
                ;
                row.push(this._htmlDay(dayConfig));
                if (++r === 7) {
                    if (this.c.showWeekNumber) {
                        row.unshift(this._htmlWeekOfYear(i - before, month, year));
                    }
                    data.push('<tr>' + row.join('') + '</tr>');
                    row = [];
                    r = 0;
                }
            }
            var className = this.c.classPrefix + '-table';
            if (this.c.showWeekNumber) {
                className += ' weekNumber';
            }
            return '<table class="' + className + '">' + '<thead>' + this._htmlMonthHead() + '</thead>' + '<tbody>' + data.join('') + '</tbody>' + '</table>';
        },
        _htmlMonthHead: function() {
            var a = []
              , firstDay = this.c.firstDay
              , i18n = this.c.i18n
              , dayName = function(day) {
                day += firstDay;
                while (day >= 7) {
                    day -= 7;
                }
                return i18n.weekdays[day];
            }
            ;
            if (this.c.showWeekNumber) {
                a.push('<th></th>');
            }
            for (var i = 0; i < 7; i++) {
                a.push('<th>' + dayName(i) + '</th>');
            }
            return a.join('');
        },
        _htmlWeekOfYear: function(d, m, y) {
            var onejan = new Date(y,0,1)
              , weekNum = Math[C4r]((((new Date(y,m,d) - onejan) / 86400000) + onejan.getUTCDay() + 1) / 7);
            return '<td class="' + this.c.classPrefix + '-week",>' + weekNum + '</td>';
        },
        _options: function(selector, values, labels) {
            if (!labels) {
                labels = values;
            }
            var select = this.dom.container.find('select.' + this.c.classPrefix + '-' + selector);
            select.empty();
            for (var i = 0, ien = values.length; i < ien; i++) {
                select.append('<option value="' + values[i] + '">' + labels[i] + '</option>');
            }
        },
        _optionSet: function(selector, val) {
            var select = this.dom.container.find('select.' + this.c.classPrefix + '-' + selector)
              , span = select.parent().children('span');
            select.val(val);
            var selected = select.find('option:selected');
            span.html(selected.length !== 0 ? selected.text() : this.c.i18n.unknown);
        },
        _optionsTime: function(select, count, inc) {
            var classPrefix = this.c.classPrefix
              , sel = this.dom.container.find('select.' + classPrefix + '-' + select)
              , start = 0
              , end = count
              , render = count === 12 ? function(i) {
                return i;
            }
             
            : this._pad;
            if (count === 12) {
                start = 1;
                end = 13;
            }
            for (var i = start; i < end; i += inc) {
                sel.append('<option value="' + i + '">' + render(i) + '</option>');
            }
        },
        _optionsTitle: function(year, month) {
            var classPrefix = this.c.classPrefix
              , i18n = this.c.i18n
              , min = this.c.minDate
              , max = this.c.maxDate
              , minYear = min ? min.getFullYear() : null 
              , maxYear = max ? max.getFullYear() : null 
              , i = minYear !== null  ? minYear : new Date().getFullYear() - this.c.yearRange
              , j = maxYear !== null  ? maxYear : new Date().getFullYear() + this.c.yearRange;
            this._options('month', this._range(0, 11), i18n.months);
            this._options('year', this._range(i, j));
        },
        _pad: function(i) {
            return i < 10 ? '0' + i : i;
        },
        _position: function() {
            var offset = this.dom.input.offset()
              , container = this.dom.container
              , inputHeight = this.dom.input.outerHeight();
            container.css({
                top: offset.top + inputHeight,
                left: offset.left
            }
            ).appendTo('body');
            var calHeight = container.outerHeight()
              , scrollTop = $('body').scrollTop();
            if (offset.top + inputHeight + calHeight - scrollTop > $(window).height()) {
                var newTop = offset.top - calHeight;
                container.css('top', newTop < 0 ? 0 : newTop);
            }
        },
        _range: function(start, end) {
            var a = [];
            for (var i = start; i <= end; i++) {
                a.push(i);
            }
            return a;
        },
        _setCalander: function() {
            this.dom.calendar.empty().append(this._htmlMonth(this.s.display.getUTCFullYear(), this.s.display.getUTCMonth()));
        },
        _setTitle: function() {
            this._optionSet('month', this.s.display.getUTCMonth());
            this._optionSet('year', this.s.display.getUTCFullYear());
        },
        _setTime: function() {
            var d = this.s.d
              , hours = d ? d.getUTCHours() : 0;
            if (this.s.parts.hours12) {
                this._optionSet('hours', this._hours24To12(hours));
                this._optionSet('ampm', hours < 12 ? 'am' : 'pm');
            } 
            else {
                this._optionSet('hours', hours);
            }
            this._optionSet('minutes', d ? d.getUTCMinutes() : 0);
            this._optionSet('seconds', d ? d.getSeconds() : 0);
        },
        _show: function() {
            var that = this
              , namespace = this.s.namespace;
            this._position();
            $(window).on('scroll.' + namespace + ' resize.' + namespace, function() {
                that._position();
            });
            $('div.DTE_Body_Content').on('scroll.' + namespace, function() {
                that._position();
            });
            $(document).on('keydown.' + namespace, function(e) {
                if (e.keyCode === 9 || e.keyCode === 27 || e.keyCode === 13) {
                    that._hide();
                }
            });
            setTimeout(function() {
                $('body').on('click.' + namespace, function(e) {
                    var parents = $(e.target).parents();
                    if (!parents.filter(that.dom.container).length && e.target !== that.dom.input[0]) {
                        that._hide();
                    }
                });
            }, 10);
        },
        _writeOutput: function(focus) {
            var date = this.s.d
              , out = window.moment ? window.moment.utc(date, undefined, this.c.momentLocale, this.c.momentStrict).format(this.c.format) : date.getUTCFullYear() + '-' + this._pad(date.getUTCMonth() + 1) + '-' + this._pad(date.getUTCDate());
            this.dom.input.val(out);
            if (focus) {
                this.dom.input.focus();
            }
        }
    }
    );
    Editor.DateTime._instance = 0;
    Editor.DateTime.defaults = {
        classPrefix: 'editor-datetime',
        disableDays: null,
        firstDay: 1,
        format: 'YYYY-MM-DD',
        i18n: Editor.defaults.i18n.datetime,
        maxDate: null,
        minDate: null,
        minutesIncrement: 1,
        momentStrict: true,
        momentLocale: 'en',
        secondsIncrement: 1,
        showWeekNumber: false,
        yearRange: 10
    };
    (function() {
        var fieldTypes = Editor.fieldTypes;
        function _buttonText(conf, text) {
            if (text === null || text === undefined) {
                text = conf[t2] || 'Choose file...';
            }
            conf._input.find('div.upload button').html(text);
        }
        function _commonUpload(editor, conf, dropCallback) {
            var btnClass = editor.classes.form.button
              , container = $('<div class="editor_upload">' + '<div class="eu_table">' + t5 
                + '<div class="cell upload">' + '<button class="' + btnClass + n58 + '<input type="file"/>' 
                + '</div>' + '<div class="cell clearValue">' + '<button class="' + btnClass + n58 + F1V + '</div>' 
                + '<div class="row second">' + '<div class="cell">' + '<div class="drop"><span/></div>' + F1V 
                + k88 + M78 + F1V + F1V + '</div>' + F1V);
            conf._input = container;
            conf._enabled = true;
            _buttonText(conf);
            if (window.FileReader && conf.dragDrop !== false) {
                container.find('div.drop span').text(conf.dragDropText || 'Drag and drop a file here to upload');
                var dragDrop = container.find('div.drop');
                dragDrop.on('drop', function(e) {
                    if (conf._enabled) {
                        Editor.upload(editor, conf, e.originalEvent[R7].files, _buttonText, dropCallback);
                        dragDrop.removeClass('over');
                    }
                    return false;
                }
                ).on('dragleave dragexit', function(e) {
                    if (conf._enabled) {
                        dragDrop.removeClass('over');
                    }
                    return false;
                }
                ).on('dragover', function(e) {
                    if (conf._enabled) {
                        dragDrop.addClass('over');
                    }
                    return false;
                });
                editor.on('open', function() {
                    $('body').on('dragover.DTE_Upload drop.DTE_Upload', function(e) {
                        return false;
                    }
                    );
                }
                ).on('close', function() {
                    $('body').off('dragover.DTE_Upload drop.DTE_Upload');
                });
            } 
            else {
                container.addClass('noDrop');
                container.append(container.find('div.rendered'));
            }
            container.find('div.clearValue button').on('click', function() {
                Editor.fieldTypes.upload.set.call(editor, conf, '');
            });
            container.find('input[type=file]').on('change', function() {
                Editor.upload(editor, conf, this.files, _buttonText, dropCallback);
            });
            return container;
        }
        function _triggerChange(input) {
            setTimeout(function() {
                input.trigger('change', {
                    editorSet: true
                });
            }, 0);
        }
        var baseFieldType = $.extend(true, {}, Editor.models.fieldType, {
            get: function(conf) {
                return conf._input.val();
            },
            set: function(conf, val) {
                conf._input.val(val);
                _triggerChange(conf._input);
            },
            enable: function(conf) {
                conf._input.prop('disabled', false);
            },
            disable: function(conf) {
                conf._input.prop('disabled', true);
            }
        });
        fieldTypes.hidden = {
            create: function(conf) {
                conf._val = conf.value;
                return null;
            },
            get: function(conf) {
                return conf._val;
            },
            set: function(conf, val) {
                conf._val = val;
            }
        };
        fieldTypes.readonly = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<input/>').attr($.extend({
                    id: Editor.safeId(conf.id),
                    type: 'text',
                    readonly: 'readonly',
                    disabled: 'disabled'
                }
                , conf.attr || {}
                ));
                return conf._input[0];
            }
        });
        fieldTypes.text = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<input/>').attr($.extend({
                    id: Editor.safeId(conf.id),
                    type: 'text'
                }
                , conf.attr || {}
                ));
                return conf._input[0];
            }
        });
        fieldTypes.password = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<input/>').attr($.extend({
                    id: Editor.safeId(conf.id),
                    type: 'password'
                }
                , conf.attr || {}
                ));
                return conf._input[0];
            }
        });
        fieldTypes.textarea = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<textarea/>').attr($.extend({
                    id: Editor.safeId(conf.id)
                }
                , conf.attr || {}
                ));
                return conf._input[0];
            }
        });
        fieldTypes.select = $.extend(true, {}, baseFieldType, {
            _addOptions: function(conf, opts) {
                var elOpts = conf._input[0].options
                  , countOffset = 0;
                elOpts.length = 0;
                if (conf.placeholder !== undefined) {
                    countOffset += 1;
                    elOpts[0] = new Option(conf.placeholder,conf.placeholderValue !== undefined ? conf.placeholderValue : '');
                    var disabled = conf.placeholderDisabled !== undefined ? conf.placeholderDisabled : true;
                    elOpts[0].hidden = disabled;
                    elOpts[0].disabled = disabled;
                }
                if (opts) {
                    Editor.pairs(opts, conf.optionsPair, function (val, label, i) {
                        if (typeof label === ('object')) {
                            if (conf.optcond !== undefined) {
                                var condok = true;
                                $.each(conf.optcond, function (k, v) {
                                    if (label[k] != v) {
                                        condok = false;
                                        return false;
                                    }
                                })
                                if (condok) {
                                    var index = elOpts.length;
                                    elOpts[index] = new Option(label.Name, val);
                                    elOpts[index]._editor_val = val;
                                }
                            } else {
                                elOpts[i + countOffset] = new Option(label.Name, val);
                                elOpts[i + countOffset]._editor_val = val;
                            }
                        } else {
                            elOpts[i + countOffset] = new Option(label, val);
                            elOpts[i + countOffset]._editor_val = val;
                        }
                    }
                    );
                }
            },
            create: function(conf) {
                conf._input = $('<select/>').attr($.extend({
                    id: Editor.safeId(conf.id),
                    multiple: conf.multiple === true
                }
                , conf.attr || {}
                ));
                fieldTypes.select._addOptions(conf, conf.options || conf.ipOpts);
                return conf._input[0];
            },
            update: function(conf, options) {
                var currVal = fieldTypes.select.get(conf)
                  , lastSet = conf._lastSet;
                fieldTypes.select._addOptions(conf, options);
                var res = fieldTypes.select.set(conf, currVal, true);
                if (!res && lastSet) {
                    fieldTypes.select.set(conf, lastSet, true);
                }
                _triggerChange(conf._input);
            },
            get: function(conf) {
                var val = conf._input.find('option:selected').map(function() {
                    return this._editor_val;
                }
                ).toArray();
                if (conf.multiple) {
                    return conf.separator ? val.join(conf.separator) : val;
                }
                return val.length ? val[0] : null ;
            },
            set: function(conf, val, localUpdate) {
                if (!localUpdate) {
                    conf._lastSet = val;
                }
                if (conf.multiple && conf.separator && !$.isArray(val)) {
                    val = val.split(conf.separator);
                } 
                else if (!$.isArray(val)) {
                    val = [val];
                }
                var i, len = val.length, found, allFound = false, options = conf._input.find('option');
                conf._input.find('option').each(function() {
                    found = false;
                    for (i = 0; i < len; i++) {
                        if (this._editor_val == val[i]) {
                            found = true;
                            allFound = true;
                            break;
                        }
                    }
                    this.selected = found;
                });
                if (conf.placeholder && !allFound && !conf.multiple && options.length) {
                    options[0].selected = true;
                }
                if (!localUpdate) {
                    _triggerChange(conf._input);
                }
                return allFound;
            }
        });
        fieldTypes.select2 = $.extend(true, {}, baseFieldType, {
            _addOptions: function (conf, opts) {
                var elOpts = conf._input[0].options
                  , countOffset = 0;
                elOpts.length = 0;
                if (conf.placeholder !== undefined) {
                    countOffset += 1;
                    elOpts[0] = new Option(conf.placeholder, conf.placeholderValue !== undefined ? conf.placeholderValue : '');
                    var disabled = conf.placeholderDisabled !== undefined ? conf.placeholderDisabled : true;
                    elOpts[0].hidden = disabled;
                    elOpts[0].disabled = disabled;
                }
                if (opts) {
                    Editor.pairs(opts, conf.optionsPair, function (val, label, i) {
                        if (typeof label === ('object')) {
                            if (conf.optcond !== undefined) {
                                var condok = true;
                                $.each(conf.optcond, function (k, v) {
                                    if (typeof v === ('object')) {
                                        if ($.inArray(label[k],v)>=0) {
                                            condok = false;
                                            return false;
                                        }
                                    }else if (label[k] != v) {
                                        condok = false;
                                        return false;
                                    }
                                })
                                if (condok) {
                                    var index = elOpts.length;
                                    if (conf.name.indexOf('InvId') >= 0) {
                                        elOpts[index] = new Option(label.Code + '-' + label.Name, val);
                                        elOpts[index]._editor_val = val;
                                    } else {
                                        elOpts[index] = new Option(label.Name, val);
                                        elOpts[index]._editor_val = val;
                                    }
                                }
                            } else {
                                if (conf.name.indexOf('InvId')>=0) {
                                    elOpts[i + countOffset] = new Option(label.Code+'-'+label.Name, val);
                                    elOpts[i + countOffset]._editor_val = val;
                                } else {
                                    elOpts[i + countOffset] = new Option(label.Name, val);
                                    elOpts[i + countOffset]._editor_val = val;
                                }
                            }
                        } else {
                            elOpts[i + countOffset] = new Option(label, val);
                            elOpts[i + countOffset]._editor_val = val;
                        }
                    });
                    conf._input.select2();
                }
            },
            create: function (conf) {
                conf._input = $('<select/>').attr($.extend({
                    id: Editor.safeId(conf.id),
                    multiple: conf.multiple === true
                }
                , conf.attr || {}
                ));
                fieldTypes.select2._addOptions(conf, conf.options || conf.ipOpts);
                return conf._input[0];
            },
            update: function (conf, options) {
                var currVal = fieldTypes.select2.get(conf)
                  , lastSet = conf._lastSet;
                fieldTypes.select2._addOptions(conf, options);
                var res = fieldTypes.select2.set(conf, currVal, true);
                if (!res && lastSet) {
                    fieldTypes.select2.set(conf, lastSet, true);
                }
                _triggerChange(conf._input);
            },
            get: function (conf) {
                var val = conf._input.find('option:selected').map(function () {
                    return this._editor_val;
                }
                ).toArray();
                if (conf.multiple) {
                    return conf.separator ? val.join(conf.separator) : val;
                }
                return val.length ? val[0] : null;
            },
            set: function (conf, val, localUpdate) {
                if (!localUpdate) {
                    conf._lastSet = val;
                }
                if (conf.multiple && conf.separator && !$.isArray(val)) {
                    val = val.split(conf.separator);
                }
                else if (!$.isArray(val)) {
                    val = [val];
                }
                var i, len = val.length, found, allFound = false, options = conf._input.find('option');
                conf._input.find('option').each(function () {
                    found = false;
                    for (i = 0; i < len; i++) {
                        if (this._editor_val == val[i]) {
                            found = true;
                            allFound = true;
                            break;
                        }
                    }
                    this.selected = found;
                });
                if (conf.placeholder && !allFound && !conf.multiple && options.length) {
                    options[0].selected = true;
                }
                if (!localUpdate) {
                    _triggerChange(conf._input);
                }
                return allFound;
            }
        });
        fieldTypes.checkbox = $.extend(true, {}, baseFieldType, {
            _addOptions: function(conf, opts) {
                var val, label, elOpts = conf._input[0].options, jqInput = conf._input.empty();
                if (opts) {
                    Editor.pairs(opts, conf["optionsPair"], function(val, label, i) {
                        jqInput.append('<div>' + '<input id="' + Editor.safeId(conf.id) + '_' + i + '" type="checkbox" />' 
                            + '<label for="' + Editor.safeId(conf.id) + '_' + i + '">' + label + '</label>' + '</div>');
                        $('input:last', jqInput).attr('value', val)[0]._editor_val = val;
                    }
                    );
                }
            },
            create: function(conf) {
                conf._input = $('<div />');
                fieldTypes["checkbox"]._addOptions(conf, conf.options || conf.ipOpts);
                return conf._input[0];
            },
            get: function(conf) {
                var out = [];
                conf._input.find('input:checked').each(function() {
                    out.push(this._editor_val);
                });
                return !conf.separator ? out : out.length === 1 ? out[0] : out.join(conf.separator);
            },
            set: function(conf, val) {
                var jqInputs = conf._input.find('input');
                if (!$.isArray(val) && typeof val === 'string') {
                    val = val.split(conf.separator || '|');
                } 
                else if (!$.isArray(val)) {
                    val = [val];
                }
                var i, len = val.length, found;
                jqInputs.each(function() {
                    found = false;
                    for (i = 0; i < len; i++) {
                        if (this._editor_val == val[i]) {
                            found = true;
                            break;
                        }
                    }
                    this.checked = found;
                });
                _triggerChange(jqInputs);
            },
            enable: function(conf) {
                conf._input.find('input').prop('disabled', false);
            },
            disable: function(conf) {
                conf._input.find('input').prop('disabled', true);
            },
            update: function(conf, options) {
                var checkbox = fieldTypes.checkbox
                  , currVal = checkbox.get(conf);
                checkbox._addOptions(conf, options);
                checkbox.set(conf, currVal);
            }
        });
        fieldTypes.radio = $.extend(true, {}, baseFieldType, {
            _addOptions: function(conf, opts) {
                var val, label, elOpts = conf._input[0].options, jqInput = conf._input.empty();
                if (opts) {
                    Editor.pairs(opts, conf.optionsPair, function(val, label, i) {
                        jqInput.append('<div>' + '<input id="' + Editor.safeId(conf.id) + '_' + i + '" type="radio" name="' 
                            + conf.name + '", />' + '<label for="' + Editor.safeId(conf.id) + '_' + i + '">' + label 
                            + '</label>' + '</div>');
                        $('input:last', jqInput).attr('value', val)[0]._editor_val = val;
                    }
                    );
                }
            },
            create: function(conf) {
                conf._input = $('<div />');
                fieldTypes.radio._addOptions(conf, conf.options || conf[g]);
                this.on('open', function() {
                    conf._input.find('input').each(function() {
                        if (this._preChecked) {
                            this.checked = true;
                        }
                    }
                    );
                });
                return conf._input[0];
            },
            get: function(conf) {
                var el = conf._input.find('input:checked');
                return el.length ? el[0]._editor_val : undefined;
            },
            set: function(conf, val) {
                var that = this;
                conf._input.find('input').each(function() {
                    this._preChecked = false;
                    if (this._editor_val == val) {
                        this.checked = true;
                        this._preChecked = true;
                    } 
                    else {
                        this.checked = false;
                        this._preChecked = false;
                    }
                });
                _triggerChange(conf._input.find('input:checked'));
            },
            enable: function(conf) {
                conf._input.find('input').prop('disabled', false);
            },
            disable: function(conf) {
                conf._input.find('input').prop('disabled', true);
            },
            update: function(conf, options) {
                var radio = fieldTypes.radio
                  , currVal = radio.get(conf);
                radio._addOptions(conf, options);
                var inputs = conf._input.find('input');
                radio.set(conf, inputs.filter('[value="' + currVal + '"]').length ? currVal : inputs.eq(0).attr('value'));
            }
        });
        fieldTypes.date = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<input />').attr($.extend({
                    id: Editor.safeId(conf.id),
                    type: 'text'
                }
                , conf.attr));
                if ($.datepicker) {
                    conf._input.addClass('jqueryui');
                    if (!conf.dateFormat) {
                        conf.dateFormat = $.datepicker.RFC_2822;
                    }
                    if (conf.dateImage === undefined) {
                        conf.dateImage = "../../images/calender.png";
                    }
                    setTimeout(function() {
                        $(conf._input).datepicker($.extend({
                            showOn: 'both',
                            dateFormat: conf.dateFormat,
                            buttonImage: conf.dateImage,
                            buttonImageOnly: true
                        }
                        , conf.opts));
                        $('#ui-datepicker-div').css('display', 'none');
                    }
                    , 10);
                } 
                else {
                    conf._input.attr('type', 'date');
                }
                return conf._input[0];
            },
            set: function(conf, val) {
                if ($.datepicker && conf._input.hasClass('hasDatepicker')) {
                    conf._input.datepicker("setDate", val).change();
                } 
                else {
                    $(conf._input).val(val);
                }
            },
            enable: function(conf) {
                $.datepicker ? conf._input.datepicker("enable") : $(conf._input).prop('disabled', false);
            },
            disable: function(conf) {
                $.datepicker ? conf._input.datepicker("disable") : $(conf._input).prop('disabled', true);
            },
            owns: function(conf, node) {
                return $(node).parents('div.ui-datepicker').length || $(node).parents('div.ui-datepicker-header').length ? true : false;
            }
        });
        fieldTypes.datetime = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                conf._input = $('<input />').attr($.extend(true, {
                    id: Editor.safeId(conf.id),
                    type: 'text'
                }
                , conf.attr));
                conf._picker = new Editor.DateTime(conf._input,$.extend({
                    format: conf.format,
                    i18n: this.i18n.datetime
                }
                , conf.opts));
                return conf._input[0];
            },
            set: function(conf, val) {
                conf._picker.val(val);
                _triggerChange(conf._input);
            },
            owns: function(conf, node) {
                return conf._picker.owns(node);
            },
            destroy: function(conf) {
                conf._picker.destroy();
            },
            minDate: function(conf, min) {
                conf._picker.min(min);
            },
            maxDate: function(conf, max) {
                conf._picker.max(max);
            }
        });
        fieldTypes.upload = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                var editor = this
                  , container = _commonUpload(editor, conf, function(val) {
                    Editor.fieldTypes.upload.set.call(editor, conf, val[0]);
                });
                return container;
            },
            get: function(conf) {
                return conf._val;
            },
            set: function(conf, val) {
                conf._val = val;
                var container = conf._input;
                if (conf.display) {
                    var rendered = container.find('div.rendered');
                    if (conf._val) {
                        rendered.html(conf.display(conf._val));
                    } 
                    else {
                        rendered.empty().append('<span>' + (conf.noFileText || 'No file') + '</span>');
                    }
                }
                var button = container.find('div.clearValue button');
                if (val && conf.clearText) {
                    button.html(conf.clearText);
                    container.removeClass('noClear');
                } 
                else {
                    container.addClass('noClear');
                }
                conf._input.find('input').triggerHandler('upload.editor', [conf._val]);
            },
            enable: function(conf) {
                conf._input.find('input').prop('disabled', false);
                conf._enabled = true;
            },
            disable: function(conf) {
                conf._input.find('input').prop('disabled', true);
                conf._enabled = false;
            }
        });
        fieldTypes.uploadMany = $.extend(true, {}, baseFieldType, {
            create: function(conf) {
                var editor = this
                  , container = _commonUpload(editor, conf, function(val) {
                    conf._val = conf._val.concat(val);
                    Editor.fieldTypes.uploadMany.set.call(editor, conf, conf._val);
                });
                container.addClass('multi').on('click', 'button.remove', function(e) {
                    e.stopPropagation();
                    var idx = $(this).data('idx');
                    conf[K6].splice(idx, 1);
                    Editor.fieldTypes.uploadMany.set.call(editor, conf, conf._val);
                });
                return container;
            },
            get: function(conf) {
                return conf._val;
            },
            set: function(conf, val) {
                if (!val) {
                    val = [];
                }
                if (!$.isArray(val)) {
                    throw 'Upload collections must have an array as a value';
                }
                conf._val = val;
                var that = this
                  , container = conf._input;
                if (conf.display) {
                    var rendered = container.find('div.rendered').empty();
                    if (val.length) {
                        var list = $('<ul/>').multiple(rendered);
                        $.each(val, function(i, file) {
                            list.append('<li>' + conf.display(file, i) + ' <button class="' + that.classes.form.button 
                                + ' remove" data-idx="' + i + '">&times;</button>' + '</li>');
                        });
                    } 
                    else {
                        rendered.append('<span>' + (conf.noFileText || 'No files') + '</span>');
                    }
                }
                conf._input.find('input').triggerHandler('upload.editor', [conf._val]);
            },
            enable: function(conf) {
                conf._input.find('input').prop('disabled', false);
                conf._enabled = true;
            },
            disable: function(conf) {
                conf._input.find('input').prop('disabled', true);
                conf._enabled = false;
            }
        });
    }
    ());
    if (DataTable.ext.editorFields) {
        $.extend(Editor.fieldTypes, DataTable.ext.editorFields);
    }
    DataTable.ext.editorFields = Editor.fieldTypes;
    Editor.files = {};
    Editor.prototype.CLASS = 'Editor';
    Editor.version = '1.5.5';
    return Editor;
}
));
