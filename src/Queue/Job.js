"use strict";

class Job {
  /**
   * Create a new job instance.
   *
   * @param {String|Object} data
   */
  constructor(data) {
    this._data = data;
  }

  /**
   * Path of the job.
   *
   * @returns {String}
   */
  get path() {
    return null;
  }

  /**
   * This method is used to dispatch job to respective queue
   *
   * @param {String} [queue='default']
   * @param {String} [connection=null]
   * @returns {Boolean}
   */
  dispatch(queue = "default", connection = null) {
    if (!this.path) {
      throw new Error("Invalid key");
    }
    const data = JSON.stringify({
      job: this.path,
      data: this._data
    });
    const QueueManager = use("Adonis/Src/Queue/Managers/Producer");
    return QueueManager.connection(connection).push(queue, data);
  }

  /**
   * Execute the job.
   *
   * @param {String|Object} data
   * @returns {Promise}
   */
  async handle(data) {
    return true;
  }
}

module.exports = Job;
