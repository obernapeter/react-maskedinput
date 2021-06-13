var _excluded = ["placeholderChar", "formatCharacters"];

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'inputmask-core';
var KEYCODE_Z = 90;
var KEYCODE_Y = 89;

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z);
}

function isRedo(e) {
  return (e.ctrlKey || e.metaKey) && e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y);
}

function getSelection(el) {
  var start, end;

  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      var rangeEl = el.createTextRange();
      var clone = rangeEl.duplicate();
      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint('EndToStart', rangeEl);
      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {
      /* not focused or not visible */
    }
  }

  return {
    start: start,
    end: end
  };
}

function setSelection(el, selection) {
  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      var rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart('character', selection.start);
      rangeEl.moveEnd('character', selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {
    /* not focused or not visible */
  }
}

var MaskedInput = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(MaskedInput, _React$Component);

  function MaskedInput() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _defineProperty(_assertThisInitialized(_this), "_onChange", function (e) {
      // console.log('onChange', JSON.stringify(getSelection(this.input)), e.target.value)
      var maskValue = _this.mask.getValue();

      var incomingValue = e.target.value;

      if (incomingValue !== maskValue) {
        // only modify mask if form contents actually changed
        _this._updateMaskSelection();

        _this.mask.setValue(incomingValue); // write the whole updated value into the mask


        e.target.value = _this._getDisplayValue(); // update the form with pattern applied to the value

        _this._updateInputSelection();
      }

      if (_this.props.onChange) {
        _this.props.onChange(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onKeyDown", function (e) {
      // console.log('onKeyDown', JSON.stringify(getSelection(this.input)), e.key, e.target.value)
      if (isUndo(e)) {
        e.preventDefault();

        if (_this.mask.undo()) {
          e.target.value = _this._getDisplayValue();

          _this._updateInputSelection();

          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }

        return;
      } else if (isRedo(e)) {
        e.preventDefault();

        if (_this.mask.redo()) {
          e.target.value = _this._getDisplayValue();

          _this._updateInputSelection();

          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }

        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();

        _this._updateMaskSelection();

        if (_this.mask.backspace()) {
          var value = _this._getDisplayValue();

          e.target.value = value;

          if (value) {
            _this._updateInputSelection();
          }

          if (_this.props.onChange) {
            _this.props.onChange(e);
          }
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onKeyPress", function (e) {
      // console.log('onKeyPress', JSON.stringify(getSelection(this.input)), e.key, e.target.value)
      // Ignore modified key presses
      // Ignore enter key to allow form submission
      if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
        return;
      }

      e.preventDefault();

      _this._updateMaskSelection();

      if (_this.mask.input(e.key || e.data)) {
        e.target.value = _this.mask.getValue();

        _this._updateInputSelection();

        if (_this.props.onChange) {
          _this.props.onChange(e);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onPaste", function (e) {
      // console.log('onPaste', JSON.stringify(getSelection(this.input)), e.clipboardData.getData('Text'), e.target.value)
      e.preventDefault();

      _this._updateMaskSelection(); // getData value needed for IE also works in FF & Chrome


      if (_this.mask.paste(e.clipboardData.getData('Text'))) {
        e.target.value = _this.mask.getValue(); // Timeout needed for IE

        setTimeout(function () {
          return _this._updateInputSelection();
        }, 0);

        if (_this.props.onChange) {
          _this.props.onChange(e);
        }
      }
    });

    return _this;
  }

  var _proto = MaskedInput.prototype;

  /* eslint-disable camelcase */
  _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    var options = {
      pattern: this.props.mask,
      value: this.props.value,
      formatCharacters: this.props.formatCharacters
    };

    if (this.props.placeholderChar) {
      options.placeholderChar = this.props.placeholderChar;
    }

    this.mask = new InputMask(options);
  }
  /* eslint-disable camelcase */
  ;

  _proto.UNSAFE_componentWillReceiveProps = function UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.mask !== nextProps.mask && this.props.value !== nextProps.mask) {
      // if we get a new value and a new mask at the same time
      // check if the mask.value is still the initial value
      // - if so use the nextProps value
      // - otherwise the `this.mask` has a value for us (most likely from paste action)
      if (this.mask.getValue() === this.mask.emptyValue) {
        this.mask.setPattern(nextProps.mask, {
          value: nextProps.value
        });
      } else {
        this.mask.setPattern(nextProps.mask, {
          value: this.mask.getRawValue()
        });
      }
    } else if (this.props.mask !== nextProps.mask) {
      this.mask.setPattern(nextProps.mask, {
        value: this.mask.getRawValue()
      });
    } else if (this.props.value !== nextProps.value) {
      this.mask.setValue(nextProps.value);
    }
  }
  /* eslint-disable camelcase */
  ;

  _proto.UNSAFE_componentWillUpdate = function UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.mask !== this.props.mask) {
      this._updatePattern(nextProps);
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.mask !== this.props.mask && this.mask.selection.start) {
      this._updateInputSelection();
    }
  };

  _proto._updatePattern = function _updatePattern(props) {
    this.mask.setPattern(props.mask, {
      value: this.mask.getRawValue(),
      selection: getSelection(this.input)
    });
  };

  _proto._updateMaskSelection = function _updateMaskSelection() {
    this.mask.selection = getSelection(this.input);
  };

  _proto._updateInputSelection = function _updateInputSelection() {
    setSelection(this.input, this.mask.selection);
  };

  _proto._getDisplayValue = function _getDisplayValue() {
    var value = this.mask.getValue();
    return value === this.mask.emptyValue ? '' : value;
  };

  _proto._keyPressPropName = function _keyPressPropName() {
    if (typeof navigator !== 'undefined') {
      return navigator.userAgent.match(/Android/i) ? 'onBeforeInput' : 'onKeyPress';
    }

    return 'onKeyPress';
  };

  _proto._getEventHandlers = function _getEventHandlers() {
    var _ref;

    return _ref = {
      onChange: this._onChange,
      onKeyDown: this._onKeyDown,
      onPaste: this._onPaste
    }, _ref[this._keyPressPropName()] = this._onKeyPress, _ref;
  };

  _proto.focus = function focus() {
    this.input.focus();
  };

  _proto.blur = function blur() {
    this.input.blur();
  };

  _proto.render = function render() {
    var _this2 = this;

    var ref = function ref(r) {
      _this2.input = r;
    };

    var maxLength = this.mask.pattern.length;

    var value = this._getDisplayValue();

    var eventHandlers = this._getEventHandlers();

    var _this$props = this.props,
        _this$props$size = _this$props.size,
        size = _this$props$size === void 0 ? maxLength : _this$props$size,
        _this$props$placehold = _this$props.placeholder,
        placeholder = _this$props$placehold === void 0 ? this.mask.emptyValue : _this$props$placehold;

    var _this$props2 = this.props,
        placeholderChar = _this$props2.placeholderChar,
        formatCharacters = _this$props2.formatCharacters,
        cleanedProps = _objectWithoutPropertiesLoose(_this$props2, _excluded); // eslint-disable-line no-unused-vars


    var inputProps = _extends({}, cleanedProps, eventHandlers, {
      ref: ref,
      maxLength: maxLength,
      value: value,
      size: size,
      placeholder: placeholder
    });

    return /*#__PURE__*/React.createElement("input", inputProps);
  };

  return MaskedInput;
}(React.Component);

_defineProperty(MaskedInput, "defaultProps", {
  value: ''
});

MaskedInput.propTypes = process.env.NODE_ENV !== "production" ? {
  mask: PropTypes.string.isRequired,
  formatCharacters: PropTypes.object,
  placeholderChar: PropTypes.string
} : {};
export default MaskedInput;