const UserController = require('./controllers/UserController');
const AuthenticatePolicy = require('./policies/AuthenticatePolicy');
const DockerController = require('./controllers/DockerController')
const EndpointList = require('./controllers/EndpointController')

module.exports = (app) => {
    app.get('/users/:id', AuthenticatePolicy.isValidToken, UserController.getUserById);
    app.put('/users/:id', UserController.update);
    app.delete('/users/:id', UserController.delete);
    app.post('/users/login', UserController.login);
    app.post('/users', UserController.register);
    app.get('/api/*', AuthenticatePolicy.isValidToken, DockerController.getApi);
    app.delete('/api/*', AuthenticatePolicy.isValidToken, DockerController.deleteApi);
    app.post('/api/*', AuthenticatePolicy.isValidToken, DockerController.postApi);
    app.post('/updateRemoteSetting',AuthenticatePolicy.isValidToken, DockerController.update);
    app.post('/endpointList', EndpointList.getEndpointList);
    app.post('/addEndpoint', EndpointList.addEndpoint);
}