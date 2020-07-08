const logger = require("../logger")("bpmn-engine.execute.error");
const repository = require("../repository");

async function subscribe(event, cb) {
  logger.debug(`received event ${JSON.stringify(event)}`);

  try {
    await repository.insert("errors", {
      service: "bpmn-svc",
      command: "execute",
      data: {
        ...event,
        handle: {},
      },
    });
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
  event: "bpmn-engine.execute.error",
  subscribe: subscribe,
};
