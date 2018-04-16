"use strict";
const Client = require("./index");

class Producer extends Client {
  /**
   * Creates a new instance.
   *
   * @param {String} name
   * @param {Object} logger
   * @param {Object} config
   * @param {Array} config.queues
   * @param {Boolean} config.debug
   * @param {Object} config.connectionString
   * @param {Object} config.reconnectInterval
   */
  constructor(name, logger, config) {
    super("Producer", name, logger, config);
  }

  /**
   * This method is used to push item to queue.
   *
   * @param {String} queue
   * @param {Object} data
   * @returns Boolean
   */
  async push(queue, data) {
    const channel = this._channels[queue];
    if (!channel) {
      throw new Error(`Queue with name "${queue}" not found`);
    }
    const bufferedData = new Buffer(JSON.stringify(data));
    return await channel.sendToQueue(queue, bufferedData, { persistent: true });
  }
}

module.exports = Producer;
