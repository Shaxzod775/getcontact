const UserModel = require('../models-mongoDB/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');


class UserService {
    async regisration(fullname, phone, password) {
        const candidate = await UserModel.findOne({phone})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с такии номером телефона уже зарегистрирован ${phone}`);
        }
        const hashPassword = await bcrypt.hash(password, 3);

        const user = await UserModel.create({fullname, phone, password: hashPassword});

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        await user.save();
        return {...tokens, user: userDto}
    }

    async login(phone, password) {
        const user = await UserModel.findOne({phone})
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с таким номером телефона не найден ${phone}`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
    
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }
}


module.exports = new UserService();










