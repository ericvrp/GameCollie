/* eslint-disable no-unused-vars */
import moduleJson from './module.json';
import exporter from './exporter.js'
// const Games  = require('./Games')


/**
 * Exporter module.
 *
 * @param {Object} log         - Winston logger instance
 * @param {Object} skeletonApp - reference to the skeleton app instance
 * @param {Object} appSettings - settings.json contents
 * @param {Object} eventsBus   - event emitter for listening or emitting events
 *                               shared across skeleton app and every module/plugin
 * @param {Object} modules     - references to all loaded modules
 * @param {Object} settings    - module settings
 * @param {Object} Module      - reference to the Module class
 * @constructor
 */
export default class {
    constructor({ log, skeletonApp, appSettings, eventsBus, modules, settings, Module }) {
        /**
         * You can delete unused vars from the param destructuring.
         * Left them here just to emphasize what is passed. Delete the eslint rule at the top
         * when done.
         * You can also just have a one `config` param and do `Object.assign(this, config);`
         */
        this.module = new Module(moduleJson.name);

        this.status = '<idle>'

        // Get the automatically predefined logger instance.
        this.log = log;
        this.eventsBus = eventsBus;

        // Never do time consuming or blocking things directly in the constructor.
        // Instead hook to 'beforeDesktopJsLoad`, `desktopLoaded` or `afterInitialization` events.
        // This will also ensure plugins providing things like splash screens will be able
        // to start as quickly as possible.
        this.eventsBus.on('desktopLoaded', () => {
            this.init();
        });
    }

    init() {
        // Do some initialization if necessary.

        this.registerApi();

        // Lets inform that the module has finished loading.
        this.eventsBus.emit(`${moduleJson.name}.loaded`);
    }

    registerApi() {

      this.module.on('start', (event, fetchId, from, to, exportProfile, exportLimit, deviceProfile, platformAliases) => {
        this.module.respond('start', fetchId)

        if (this.status === '<idle>') {
          // console.log('exporter.start', from, to)
          this.status = '<running>'
          exporter(from, to, exportProfile, exportLimit, deviceProfile, platformAliases) // note: this is blocking at the moment
          this.status = '<idle>'
        } else {
          console.warn('exporter already started')
        }
      })

      this.module.on('pause', (event, fetchId) => {
        // console.log('TODO: exporter.pause')
        if (this.status !== '<idle>') {
          this.status = '<paused>'
        }
        this.module.respond('pause', fetchId)
      })

      this.module.on('stop', (event, fetchId) => {
        // console.log('TODO: exporter.stop')
        if (this.status !== '<idle>') {
          this.status = '<idle>'
        }
        this.module.respond('stop', fetchId)
      })

      this.module.on('getStatus', (event, fetchId) => {
        // console.log('TODO: exporter.getStatus', this.status)
        this.module.respond('getStatus', fetchId, this.status)
      })

    } // end of registerApi()
}
