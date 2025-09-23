const intentionalErrorController = {};

intentionalErrorController.causeError = async function(req, res, next) {
    console.log("Intentionally causing a 500 error for testing...");
    throw new Error("Oh no! Something went wrong. This is an intentional 500 error for testing purposes.");
}

module.exports = intentionalErrorController;