'use strict';

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require('lodash');
const mandrill = require('mandrill-api/mandrill');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'mandrill',
  name: 'Mandrill',
  auth: {
    mandrill_default_from_email: {
      label: 'Mandrill Default From Email',
      type: 'text',
    },
    mandrill_default_from_name: {
      label: 'Mandrill Default From Name',
      type: 'text',
    },
    mandrill_default_replyto: {
      label: 'Mandrill Default Reply-To',
      type: 'text',
    },
    mandrill_api_key: {
      label: 'Mandrill API Key',
      type: 'text',
    },
  },
  init: config => {
    const mandrill_client = new mandrill.Mandrill(config.mandrill_api_key);

    return {
      send: (options, cb) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from_name = options.from_name || config.mandrill_default_from_name;
          options.from_email = options.from_email || config.mandrill_default_from_email;
          options.replyTo = options.replyTo || config.mandrill_default_replyto;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          let msg = {
            ...options,
            from_name: options.from_name,
            from_email: options.from_email,
            to: [{
              email: options.to,
              name: options.name,
              type: 'to'
            }],
            reply_to: options.replyTo,
            subject: options.subject,
            text: options.text,
            html: options.html,
          };

          mandrill_client.messages.send({ message: msg, send_at: new Date }, (res) => {
            resolve();
          }, (err) => {
            reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]);
          });
        });
      },
    };
  },
};
