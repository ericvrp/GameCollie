/* eslint-disable no-unused-vars */
import moduleJson from './module.json';
import fs from 'fs'
// import './indexer_code/indexer.js'


/**
 * Example module.
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
export default class Example {
  constructor({ log, skeletonApp, appSettings, eventsBus, modules, settings, Module }) {
    /**
     * You can delete unused vars from the param destructuring.
     * Left them here just to emphasize what is passed. Delete the eslint rule at the top
     * when done.
     * You can also just have a one `config` param and do `Object.assign(this, config);`
     */
    this.module = new Module(moduleJson.name);

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
    this.module.on('start', (event, fetchId, where) => {
      // Nothing fancy here, we will just respond with the result of testArg === 1.
      // fetchId is necessary for the system to know to which request the response is for.
      // It will be present if you will emit this event in Meteor app with `Desktop.fetch`.
      console.log('INDEXER.start', fetchId)
      this.module.respond('start', fetchId, 'indexer.start ' + where + '->pong');
    });

    this.module.on('start2', (event, fetchId, where) => {
      // Nothing fancy here, we will just respond with the result of testArg === 1.
      // fetchId is necessary for the system to know to which request the response is for.
      // It will be present if you will emit this event in Meteor app with `Desktop.fetch`.
      console.log('INDEXER.start2', fetchId)
      this.module.respond('start2', fetchId, 'indexer.start2 ' + where + '=>pong');
    });

    this.module.on('getFile', (event, fetchId, filename) => {
      const content = fs.readFileSync(filename)
      this.module.respond('getFile', fetchId, content.toString());
    });
  }
}
