"use strict";
const Drive = use("Drive");
const Helpers = use("Helpers");
const { render } = require("mustache");
const { Command } = use("@adonisjs/ace");

class QueueJob extends Command {
  /**
   * Signature of the console command.
   *
   * @returns {String}
   */
  static get signature() {
    return "queue:create-job {name: Unique name of job}";
  }

  /**
   * Description of the console command.
   *
   * @returns {String}
   */
  static get description() {
    return "Create a new job to handle queue item";
  }

  /**
   * Execute the console command.
   *
   * @param {Object} args
   * @param {Object} options
   * @returns {Promise}
   */
  async handle(args, options) {
    if (!args.name) {
      this.error("Job name not specified");
      return false;
    }
    const fileContent = await Drive.get(__dirname + "/../templates/job.tmpl", "utf8");
    await Drive.put(
      Helpers.appRoot("app/Jobs/" + args.name + ".js"),
      render(fileContent, {
        Job: args.name
      })
    );
  }
}

module.exports = QueueJob;
