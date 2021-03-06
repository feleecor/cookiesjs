/**
 * cookiebar - It is a pure JS code, that warns the visitors in the notification bar, the page saves cookies. This is Compliant with the new EU cookie law.
 * Date 2018-12-25T03:13:56Z
 * 
 * @author Tamás András Horváth <htomy92@gmail.com> (https://icetee.hu)
 * @version v1.0.0
 * @link https://github.com/icetee/cookiebar#readme
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(root);
  } else {
    root.Cookiebar = factory(root);
  }
}(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function(window) {
  var doc = window.document;

  function _(el) {
    if (!(this instanceof _)) {
      return new _(el);
    }

    var first = el.charAt(0);

    if (first === "#") {
      this.el = doc.getElementById(el.substr(1));
    } else if (first === ".") {
      this.el = doc.getElementsByClassName(el.substr(1));
    } else {
      this.el = doc.getElementsByTagName(el);
    }
  }

  _.prototype.fade = function fade(type, ms, dis) {
    var isIn = type === 'in',
      opacity = isIn ? 0 : 1,
      interval = 50,
      duration = ms,
      gap = interval / duration,
      display = dis ? dis : 'inline',
      self = this;

    if (isIn) {
      self.el.style.display = display;
      self.el.style.opacity = opacity;
    }

    function func() {
      opacity = isIn ? opacity + gap : opacity - gap;
      self.el.style.opacity = opacity;

      if (opacity <= 0) self.el.style.display = 'none';
      if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
    }

    var fading = window.setInterval(func, interval);
  };

  var Vanilla = function() {};

  Vanilla.prototype.extend = function(target) {
    for (var i = 1; i < arguments.length; ++i) {
      var from = arguments[i];
      if (typeof from !== 'object') continue;
      for (var j in from) {
        if (from.hasOwnProperty(j)) {
          target[j] = typeof from[j] === 'object' ?
            this.extend({}, target[j], from[j]) : from[j];
        }
      }
    }
    return target;
  };

  Vanilla.prototype.trigger = function(el, eventName) {
    var event = doc.createEvent('Event');
    event.initEvent(eventName, true, true);
    el.dispatchEvent(event);
  };

  /**
   * Vanilla JavaScript support IE8+.
   *
   * @link https://plainjs.com
   */

  Vanilla.prototype.addEvent = function(el, type, handler) {
    return (el[window.attachEvent ? 'attachEvent' : 'addEventListener'](
      (window.attachEvent ? 'on' : '') + type, handler, true
    ));
  };

  Vanilla.prototype.removeEvent = function(el, type, handler) {
    if (el.detachEvent) el.detachEvent('on' + type, handler);
    else el.removeEventListener(type, handler);
  };

  Vanilla.prototype.parseTemplate = function(str, data) {
    return str.replace(/\$\{(\w+)\}/gi, function(match, parensMatch) {
      if (data[parensMatch] !== undefined) {
        return data[parensMatch];
      }

      return match;
    });
  };

  var v = new Vanilla();

  var Cookiebar = function(opt) {
    var self = this;
    this.opt = v.extend({
      id: "cookiebar",
      cls: "cookiebar",
      cookie: "cookiebar",
      content: {
        description: "The site uses cookies to operate. By using our services you agree to use the cookies!",
        link: "More information",
        href: "http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm",
        button: "Accept",
        more: ""
      },
      fade: {
        type: "in",
        ms: "500",
        display: "inline"
      },
      debug: 0,
      exits: true
    }, opt || {});

    this.bar = null;
    this.data = this.opt;
    this.bodyMargBotBackup = doc.body.style.marginBottom || "";
    this.accepted = false;
    this.events = {
      btnClick: function(e) {
        if (e && e.preventDefault) e.preventDefault();
        else if (typeof e === 'object') e.returnValue = false;
        self.accept();
      },
      winResize: function() {
        if (self.accepted) {
          return;
        }
        doc.body.style.marginBottom = self.bar.offsetHeight + "px";
      }
    };
    //Initialize
    this.init();
  };

  Cookiebar.prototype.init = function() {
    var self = this;
      self.checkCookie();
  };

  Cookiebar.prototype.getCookie = function(cname) {
if (localStorage.getItem(cname) === null) {
	return false;
}else{
	return true;
}
  };

  Cookiebar.prototype.setCookie = function(cname) {
localStorage.setItem(cname, 'yes');

    if (typeof cb === "function") {
      cb.call(this);
    }
  };

  Cookiebar.prototype.delCookie = function(cname) {
    localStorage.removeItem(cname); 
  };

  Cookiebar.prototype.html = function() {
    var html = '<div class="${cls}-wrapper">' +
      '<div class="${cls}-content">' +
      '<div class="${cls}-desciption">${des}</div>' +
      '<div class="${cls}-link">' +
      '<a href="#" class="open-ck-modal" >Citește mai mult</a>' +
      '</div>' +
      '</div>' +
      '<div class="${cls}-more" style="display: none;">${more}</div>' +
      '<div class="${cls}-actions">' +
      '<div class="${cls}-button">' +
      '<button type="button" name="${cls}-button" class="${cls}-btn">${btn}</button>' +
      '</div>' +
      '</div>' +
      '</div>';

    return v.parseTemplate(html, {
      cls: this.data.cls,
      href: this.data.content.href,
      link: this.data.content.link,
      more: this.data.content.more,
      btn: this.data.content.button,
      des: this.data.content.description
    });
  };

  Cookiebar.prototype.withdraw = function() {
    this.delCookie('cookiesAccepted');
    this.accepted = false;
    this.checkCookie();
  };

  Cookiebar.prototype.accept = function() {
    this.accepted = true;
    this.setCookie('cookiesAccepted');
    v.removeEvent(window, 'resize', this.events.winResize);

    if (this.bar) {
      this.bar.style.display = 'none';
    }
    if (doc.body.style.marginBottom !== this.bodyMargBotBackup) {
      doc.body.style.marginBottom = this.bodyMargBotBackup;
    }
  };

  Cookiebar.prototype.draw = function() {
    var self = this,
      btn;

    if (self.accepted) {
      return;
    }

    if (!self.bar) {
      self.bar = doc.createElement('div');
      self.bar.id = self.data.id;
      self.bar.className = self.data.cls;
      self.bar.innerHTML = self.html();
      doc.body.insertBefore(self.bar, doc.body.firstChild);
      btn = self.bar.getElementsByClassName(self.data.cls + '-btn')[0];
      v.addEvent(btn, 'click', self.events.btnClick);
    }

    v.addEvent(window, 'resize', self.events.winResize);
    v.trigger(window, 'resize');

    _("#" + self.data.id).fade(self.data.fade.type, self.data.fade.ms);

  };

  Cookiebar.prototype.checkCookie = function() {
    this.accepted = this.getCookie('cookiesAccepted');
    if (!this.accepted) {
      this.draw();
    }
  };

  Cookiebar.prototype.getStatus = function() {
    return this.accepted;
  };

  return Cookiebar;
}));
