"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

if (window.customElements && window.customElements.define) {
  var Innovid_GWD_Connector = /*#__PURE__*/function (_HTMLElement) {
    _inherits(Innovid_GWD_Connector, _HTMLElement);

    var _super = _createSuper(Innovid_GWD_Connector);

    function Innovid_GWD_Connector() {
      var _this;

      _classCallCheck(this, Innovid_GWD_Connector);

      _this = _super.call(this);
      _this.started = false;
      return _this;
    }

    _createClass(Innovid_GWD_Connector, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var isInteractive = typeof this.getAttribute('interactive') === "string";
        var shouldAlertInteractions = typeof this.getAttribute('alertInteractions') === "string";
        var shouldUseMockFeed = typeof this.getAttribute('useMockFeed') === "string";
        window.addEventListener('DOMContentLoaded', function (e) {
          IVD.startIVD_GWD(isInteractive, shouldAlertInteractions, shouldUseMockFeed);
        }, false);

        var stringToJS = function stringToJS(stringToEval) {
          if (stringToEval == "") return "";
          return Function('"use strict";return (' + stringToEval + ' )')();
        };

        this.clickthru = function (label, opJS) {
          label = label + stringToJS(opJS);
          var feedURL = null;

          if (IVD.feed[label]) {
            feedURL = IVD.feed[label];
          }

          IVD.clickthru(label, feedURL);

          if (IVD.mode == "Local" && !feedURL && shouldAlertInteractions) {
            alert("\nClick Through Label:\n" + label);
          }
        };

        this.engage = function (label, opJS) {
          var labelToTrigger = label + stringToJS(opJS);
          IVD.engage(labelToTrigger);

          if (IVD.mode == "Local" && shouldAlertInteractions) {
            alert("\nEngage Label:\n" + labelToTrigger);
          }
        };

        this.report = function (label, opJS) {
          IVD.report(label + stringToJS(opJS));
        };
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(attributeName) {
        switch (attributeName) {
          case 'interactive':
            //this.setAttribute('interactive',!Boolean(this.getAttribute('interactive')));
            break;
        }
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['interactive'];
      }
    }]);

    return Innovid_GWD_Connector;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  customElements.define('innovid-gwd-connector', Innovid_GWD_Connector);
}