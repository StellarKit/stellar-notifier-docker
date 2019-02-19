// config vars, can be overrided from Dockerfile (see Dockerfile)
const notifierURL = 'http://localhost:4021'
const reactionURL = 'http://localhost:8991/reaction'

// if run using docker-compose, accessing localhost doesn't work, we use docker networking
const notifierURL_docker = 'http://notifier:4021'
const reactionURL_docker = 'http://testserver:8991/reaction'
let usingDocker = false

class ServerConfig {
    static useDocker() {
        usingDocker = true
    }

    notifierURL() {
        if (usingDocker) {
            return notifierURL_docker
        }

        return notifierURL
    }

    reactionURL() {
        if (usingDocker) {
            return reactionURL_docker
        }

        return reactionURL
    }
}

const instance = new ServerConfig()
export default instance

// Can be appended by Dockerfile and call useDocker() true (see Dockerfile)
// ServerConfig.useDocker()