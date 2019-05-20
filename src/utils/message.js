const generateMessage = ( text ) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generatelocationMessage = ( url ) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generatelocationMessage
}