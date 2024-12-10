/* eslint-disable no-unused-vars */
class AuthenticationHandler {
  constructor(authenticationService, userService, tokenManager, validator) {
    this._authenticationService = authenticationService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  // Login
  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this._userService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ userId: id });
    const refreshToken = this._tokenManager.generateRefreshToken({
      userId: id,
    });

    await this._authenticationService.updateRefreshToken(id, refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Successfully added authentication (login success)',
      data: {
        accessToken,
        refreshToken,
      },
    });

    response.code(201);

    return response;
  }

  // Request Access Token using Refresh Token
  async putAuthenticationHandler(request, h) {
    const { refreshToken } = request.payload;

    this._validator.validatePutAuthenticationPayload(request.payload);

    await this._authenticationService.verifyRefreshToken(refreshToken);

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ userId: id });

    const response = h.response({
      status: 'success',
      message: 'Renewing access token success',
      data: {
        accessToken,
      },
    });

    return response;
  }

  // Logout
  async deleteAuthenticationHandler(request, h) {
    const { refreshToken } = request.payload;

    this._validator.validateDeleteAuthenticationPayload(request.payload);

    await this._authenticationService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Logout success, refresh token removed',
    });

    return response;
  }
}

module.exports = AuthenticationHandler;
