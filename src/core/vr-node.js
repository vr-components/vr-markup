/* global Event, HTMLElement */

require('../vr-register-element');

/**
 *
 * VRNode is the base class for all the VR markup
 * It manages loading of objects.
 *
 */

module.exports = document.registerElement(
  'vr-node',
  {
    prototype: Object.create(
      HTMLElement.prototype,
      {

        //  ----------------------------------  //
        //   Native custom elements callbacks   //
        //  ----------------------------------  //

        createdCallback: {
          value: function () {
            var sceneEl = document.querySelector('vr-scene');
            this.sceneEl = sceneEl;
          },
          writable: window.debug
        },

        attachedCallback: {
          value: function () { /* no-op */ },
          writable: window.debug
        },

        detachedCallback: {
          value: function () { /* no-op */ },
          writable: window.debug
        },

        attributeChangedCallback: {
          value: function () { /* no-op */ },
          writable: window.debug
        },

        elementsLoaded: {
          value: function(elements) {
            return new Promise(function(resolve) {
              function clearLoaded(tagName) {
                var index = elements.indexOf(tagName.toUpperCase());
                if (index !== -1) {
                  elements.splice(index, 1);
                };

                if (elements.length === 0) {
                  resolve();
                }
              };

              function loadHandler(e) {
                clearLoaded(e.target.tagName);
              };

              elements = elements.map(function(name) {
                return name.toUpperCase();
              });

              elements.forEach(function(tagName) {
                var element = document.querySelector(tagName);

                if (element && !element.hasLoaded) {
                  element.addEventListener('loaded', loadHandler);
                }

                if (element.hasLoaded) {
                  clearLoaded(tagName);
                }
              });
            });
          }
        },

        load: {
          value: function () {
            // To prevent emmitting the loaded event more than once
            if (this.hasLoaded) { return; }
            var attributeChangedCallback = this.attributeChangedCallback;
            var event = new Event('loaded');
            this.hasLoaded = true;
            this.dispatchEvent(event);
            if (attributeChangedCallback) { attributeChangedCallback.apply(this); }
          },
          writable: window.debug
        }
      })
  }
);
