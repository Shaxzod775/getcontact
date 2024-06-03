const contactsService = require('../service/contacts-service');

class ContactController {
    async saveContacts(req, res, next) {
        try {
            const { data, phone } = req.body;
            await contactsService.ConvertJsonFile(data, phone);
            await contactsService.AddContactDB(phone);
            res.json({message : "Контакты успешно сохранены!"});
        } catch (error) {
            next(error)
        }
    }

    async getContactInfo(req, res, next) {
        try {
            const { phone } = req.body;
            const foundContact = await contactsService.getContact(phone);
            if (foundContact){ 
                res.json(foundContact)
            } else {
                res.json({message: "Контакта нету в базе данных"})
            }
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new ContactController()


