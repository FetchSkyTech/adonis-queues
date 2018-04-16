"use strict";
const isArray = use("lodash/isArray");
const amqplib = require("amqplib");

class Connection {
  /**
   * Creates a new instance.
   *
   * @param {String} type
   * @param {String} name
   * @param {Object} logger
   * @param {Object} config
   * @param {Array} config.queues
   * @param {Boolean} config.debug
   * @param {Object} config.connectionString
   * @param {Object} config.reconnectInterval
   */
  constructor(type, name, logger, config) {
    this._type = type;
    this._name = name;
    this._channels = {};
    this._logger = logger;
    this._debug = config.debug;
    this._connectionString = config.connectionString;
    this._reconnectInterval = config.reconnectInterval;
    this._queues = isArray(config.queues) ? config.queues : [];
  }

  /**
   * Connection status of client
   */
  get connected() {
    return this._connected;
  }

  /**
   * This method is used to create connection between queue client and server.
   *
   * @returns {Promise}
   */
  async createConnection() {
    try {
      this._connection = await this._connect();
      this._connected = true;
    } catch (err) {
      this._logger.error(`Failed to establish ${this._type} queue connection ("${this._name}")`, err);
      await this._reconnect();
    }
  }

  /**
   * This method is used to introduce delay.
   *
   * @param {Number} timeout
   * @returns {Promise}
   */
  _sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  /**
   * This method is used to connect to client to queue server.
   *
   * @returns {Promise}
   */
  async _connect() {
    this._connection = await amqplib.connect(this._connectionString);
    this._channels = await this._createChannels();
    this._connection.on("close", async () => {
      this._logger.error(`${this._type} queue connection "${this._name}" is disconnected`);
      await this._reconnect();
    });
    this._connection.on("error", async () => {
      this._logger.error(`${this._type} queue connection "${this._name}" has encountered an error`);
      await this._reconnect();
    });
  }

  /**
   * This method is used to reconnect client to queue server.
   *
   * @returns {Promise}
   */
  async _reconnect() {
    this._connected = false;
    await this._sleep(this._reconnectInterval);
    await this.createConnection();
  }

  /**
   * This method is used to create channels for queues.
   *
   * @returns {Promise}
   */
  async _createChannels() {
    const channels = {};
    if (this._queues.length) {
      for (var i = 0; i < this._queues.length; i++) {
        let channel = await this._connection.createChannel();
        await channel.assertQueue(this._queues[i], { durable: true });
        if (this._type === "Consumer") {
          await channel.prefetch(1);
        }
        channels[this._queues[i]] = channel;
      }
    }
    return channels;
  }
}

module.exports = Connection;
