"use strict";

const Drive = use("Drive");
const Helpers = use("Helpers");
const { Command } = use("@adonisjs/ace");

class QueueInit extends Command {
  /**
   * Signature of the console command.
   *
   * @returns {String}
   */
  static get signature() {
    return "queue:init";
  }

  /**
   * Description of the console command.
   *
   * @returns {String}
   */
  static get description() {
    return "Create a config file for queue";
  }

  /**
   * Execute the console command.
   *
   * @param {Object} args
   * @param {Object} options
   * @returns {Promise}
   */
  async handle(args, options) {
    await Drive.copy(__dirname + "/../templates/queue.tmpl", Helpers.appRoot("config/queue.js"));
  }
}

module.exports = QueueInit;
