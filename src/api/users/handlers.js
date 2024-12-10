class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;

    const userId = await this._service.createUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'Adding user success',
      data: {
        userId,
      },
    });

    response.code(201);

    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    const response = h.response({
      status: 'success',
      message: 'Getting user information success',
      data: {
        user,
      },
    });

    return response;
  }
}

module.exports = UsersHandler;
