const logger = require("../logger")("bpmn-engine.event.pushed");
const repository = require("../repository");

async function subscribe(event, cb) {
  logger.debug(`received event ${JSON.stringify(event)}`);

  try {
    switch (event.type) {
      case "bpmn:Process":
        await repository.replace("processes", {
          ...event,
          handle: null,
        });
        break;
      case "bpmn:StartEvent":
        await repository.replace("events", {
          ...event,
          handle: null,
        });
        break;
      case "bpmn:UserTask":
        await repository.replace("tasks", {
          ...event,
          handle: null,
        });
        break;
    }
  } catch (err) {
    logger.error(err);
    await repository.insert("errors", {
      service: "denormalizer",
      data: {
        ...error,
      },
    });
  }

  cb();
}

module.exports = {
  event: "bpmn-engine.event.pushed",
  subscribe: subscribe,
};
