const util = require("util");
const logger = require("./logger")("handler");

module.exports = function () {
  return {
    handleIncoming: function handleIncoming(channel, msg, options, next) {
      var uniqueMessageId = msg.content.cid;

      msg.content.handle = {
        ack: function ack(cb) {
          logger.debug("acking message %s", uniqueMessageId);

          channel.ack(msg);

          if (cb) return cb();
        },
        acknowledge: function acknowledge(cb) {
          ack(cb);
        },
        reject: function reject(err, cb) {
          var errorQueueName = util.format("%s.error", options.queueName);

          logger.debug(
            "sending message %s to error queue %s",
            uniqueMessageId,
            errorQueueName
          );

          var buffer = Buffer.from(
            JSON.stringify({
              message: msg.content,
              error: err,
            })
          );

          channel.sendToQueue(errorQueueName, buffer);
          channel.reject(msg, false);

          if (cb) return cb(err);
        },
      };

      return next(null, channel, msg, options);
    },
  };
};
