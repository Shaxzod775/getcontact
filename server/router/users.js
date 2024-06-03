const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const contactController = require('../controllers/contacts-controller');
const router = new Router();
const { body } = require('express-validator');

// User Registration and Authorization 
router.post('/registration', 
       body('phone').isMobilePhone(),
       body('password').isLength({min: 5, max: 32 }),
       userController.registration
    );
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);


// Contacts retrievement 

router.post('/contacts', contactController.saveContacts);
router.get('/contacts', contactController.getContactInfo);


module.exports = router;












