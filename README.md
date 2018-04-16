## Installation

_Using npm:_

`$ npm i git+https://github.com/FetchSkyTech/adonis-queues.git --save`

_In start/app.js:_

* Add `"adonis-queue-fs/providers/QueueProvider"` in providers array
* Add `"Adonis/Commands/Queue:Init"`, `"Adonis/Commands/Queue:Work"` & `"Adonis/Commands/Queue:Job"` in commands array.

_Execute the following command to generate the config file_

`$ adonis queue:init`

_In config/queue.js:_

* Put your queue server configuration

_Execute the following command to create a queueable job_

`$ adonis queue:create-job MyJob`

_In App/Jobs/MyJob.js:_

* Fill up the handle function for the worker as per the requirement

## How it works?

```javascript
// Create job's instance with JSON/String as an argument
const job = new MyJob(data);
// It will push the job into the queue
job.dispatch(queue, connection);
```

## Start Worker:

_Execute the following command to start consumption_

`$ adonis queue:work [connection] --queue=[queue]`

**Note:**

* Currently, it only supports RabbitMQ.
* Supports multiple queue server connections as well.