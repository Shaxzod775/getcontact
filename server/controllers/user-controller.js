const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {fullname, phone, password} = req.body;
            const userData = await userService.regisration(fullname, phone, password);
            res.status(201).json({message: "Пользователь успешно зарегистрировался", userData: userData});
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { phone, password } = req.body;
            const userData = await userService.login(phone, password);
            return res.json({message: "Пользователь успешно вошёл", userData: userData, 'refreshToken': userData.refreshToken});
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            return res.json(token);
        } catch (e) {
            next(e)
        }
    }
    
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const userData = await userService.refresh(refreshToken);
            res.json({ userData, refreshToken: userData.refreshToken });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();









