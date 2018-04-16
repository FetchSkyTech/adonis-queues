"use strict";

const Logger = use("Logger");
const { Command } = use("@adonisjs/ace");
const QueueManager = use("Adonis/Src/Queue/Managers/Consumer");

class QueueWork extends Command {
  /**
   * Signature of the console command.
   *
   * @returns {String}
   */
  static get signature() {
    return "queue:work {connection?: Name of connection to be used} {--queue?=@value: Specify queue name}";
  }

  /**
   * Description of the console command.
   *
   * @returns {String}
   */
  static get description() {
    return "Starts a work to consumer queues";
  }

  /**
   * Execute the console command.
   *
   * @param {Object} args
   * @param {Object} options
   * @returns {Promise}
   */
  async handle(args, options) {
    try {
      const connectionName = args.connection;
      const queueName = options.queue && options.queue !== true ? options.queue : "default";
      await QueueManager.connect(queueName, connectionName);
      if (QueueManager.connected) {
        QueueManager.onReceive = msg => this._onReceive(msg);
        QueueManager.startConsuming();
      }
    } catch (e) {
      this.error(e);
      process.exit(1);
    }
    // Prevent the main process from exiting...
    setInterval(() => {}, 1000);
  }

  /**
   * Callback to execute when an item receive from queue.
   *
   * @param {Object} msg
   * @returns {Promise}
   */
  async _onReceive(msg) {
    this.info("Received item from queue.");
    await this._runJob(msg.content.toString());
    this.success("Sending acknowledgment...");
    QueueManager.sendAck(msg);
  }

  /**
   * Run the respective job.
   *
   * @param {String} content
   * @returns {Promise}
   */
  async _runJob(content) {
    try {
      const data = this._parseData(content);
      const Job = use(data.job);
      const job = new Job(null);
      await job.handle(data.data);
    } catch (err) {
      this.error("Failed to run job. Exiting process...", err);
      process.exit(1);
    }
  }

  _parseData(content) {
    const json = JSON.parse(content);
    if (typeof json === "string") {
      return this._parseData(json);
    }
    return json;
  }
}

module.exports = QueueWork;
