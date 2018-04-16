"use strict";
const Client = require("../Clients/Consumer");

class QueueManager {
  /**
   * Creates a new instance
   *
   * @param {Object} Config
   * @param {Object} Logger
   */
  constructor(Config, Logger) {
    this._config = Config;
    this._logger = Logger;
    this._connections = null;
  }

  /**
   * Connection status of client.
   *
   * @returns {Boolean}
   */
  get connected() {
    return this._connection && this._connection.connected;
  }

  /**
   * Callback to execute when item received from queue.
   *
   * @param {Function} callback
   */
  set onReceive(callback) {
    this._connection.onReceive = callback;
  }

  /**
   * This method is used to connect and monitor queue connection.
   *
   * @param {String} queueName
   * @param {String} [connectionName=null]
   * @returns {Promise}
   */
  async connect(queueName, connectionName = null) {
    const queueConfig = this._config.get("queue");
    const _connectionName = !connectionName ? queueConfig.connection : connectionName;
    const _config = queueConfig.connections[_connectionName];
    if (!_config) {
      throw new Error(`Queue connection "${_connectionName}" doesn't exists`);
    }
    const config = { ..._config, queues: [queueName] };
    this._connection = new Client(_connectionName, this._logger, config);
    await this._connection.createConnection();
  }

  /**
   * This method is used to start consuming items from queue.
   *
   * @returns {Void}
   */
  startConsuming() {
    this._connection.consume();
  }

  /**
   * This method is used to send msg acknowledgment to queue server.
   *
   *@returns {Void}
   */
  sendAck(msg) {
    this._connection.sendAck(msg);
  }
}

module.exports = QueueManager;
