class ServerError extends Error {
    constructor(status, message){
        super()
        this.status = status
        this.message = message
    }

    static badRequest(message){
        return new ServerError(404, message)
    }
}

module.exports = ServerError