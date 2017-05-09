/* eslint-disable no-unused-vars */
import moduleJson from './module.json';
import fs from 'fs'
import indexer from './indexer_code/indexer.js'


/**
 * Indexer module.
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

    this.hashResults = []

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
    this.module.on('test', (event, fetchId, where) => {
      console.log('indexer.test', where)
      this.module.respond('test', fetchId, 'indexer.test ' + where + '->pong')
    })

    this.module.on('run', (event, fetchId, dirname) => {
      // console.log('indexer.run', dirname, this.hashResults.length)
      this.module.respond('run', fetchId, '<running>')
      indexer(dirname, this.hashResults)
    })

    this.module.on('getNewHashResults', (event, fetchId) => {
      // console.log('indexer.getNewHashResults', this.hashResults.length)
      this.module.respond('getNewHashResults', fetchId, this.hashResults)
      this.hashResults.length = 0 // clear the array
    })
  }
}
