"use strict";
const Client = require("./index");

class Consumer extends Client {
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
    super("Consumer", name, logger, config);
    this._callback = null;
  }

  /**
   * Callback to execute when an item received from queue.
   * @returns {Void}
   */
  set onReceive(callback) {
    this._callback = callback;
  }

  /**
   * Channel for current queue.
   *
   * @returns channel
   */
  get channel() {
    if (!this.connected) {
      throw new Error(`Consumer "${name}" is not connected to queue server`);
    }
    if (!this._queues.length) {
      throw new Error("Please specify name of queue to be consume");
    }
    const channel = this._channels[this._queues[0]];
    if (!channel) {
      throw new Error("Channel not found for the specified queue");
    }
    return channel;
  }

  /**
   * This method is used to consume items from queue channel.
   *
   * @returns {Void}
   */
  consume() {
    const queueName = this._queues[0];
    const channel = this.channel;
    channel.consume(queueName, this._callback);
  }

  /**
   * This method is used to send acknowledgment to queue server.
   *
   * @param {Object} msg (For which ack to be send)
   * @returns {Void}
   */
  sendAck(msg) {
    if (!msg) {
      throw new Error("Invalid msg.!");
    }
    const channel = this.channel;
    channel.ack(msg);
  }
}

module.exports = Consumer;
