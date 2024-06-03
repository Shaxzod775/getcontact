const fs = require('fs').promises;
const path = require('path');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const pool = require('../db/connectPool');


class ContactsService {
    async ConvertJsonFile(data, phone)  {
        try {
            const dirPath = path.join(__dirname, 'business', phone);
            await fs.mkdir(dirPath, {recursive: true});

            const filePath = path.join(dirPath, 'contacts.json')

            const jsonData = JSON.stringify(data, null, 2)

            await fs.writeFile(filePath, jsonData, 'utf8');
        } catch (error) {
            console.error(error)
        }
    }

    async AddContactDB(phone) {
        const validContacts = [];

        try {
        const dirPath = path.join(__dirname, 'business', phone);
        const filePath = path.join(dirPath, 'contacts.json')
        const data = await fs.readFile(filePath, 'utf-8');
        const contacts = JSON.parse(data);

        for (const [name, number] of Object.entries(contacts)) {
            const cleanedNumber = number.replace(/\s+/g, '');
            const parsedNumber = parsePhoneNumberFromString(cleanedNumber, 'UZ');
            if (parsedNumber && parsedNumber.isValid() && parsedNumber.country === 'UZ') {
                validContacts.push({ name, cleanedNumber });
            } 
          }

          for (const contact of validContacts) {
            const existingPhoneResult = await pool.query('SELECT id FROM phones WHERE phone = $1', [contact.cleanedNumber]);
            let phoneId;

            if (existingPhoneResult.rows.length > 0) {
                phoneId = existingPhoneResult.rows[0].id;
            } else {
                const phoneInsertResult = await pool.query('INSERT INTO phones (phone) VALUES ($1) RETURNING id', [contact.cleanedNumber]);
                phoneId = phoneInsertResult.rows[0].id;
            }

            const existingNameResult = await pool.query('SELECT name FROM names WHERE phone_id = $1 AND name = $2', [phoneId, contact.name]);

            if (existingNameResult.rows.length === 0) {
                await pool.query('INSERT INTO names (phone_id, name) VALUES ($1, $2)', [phoneId, contact.name]);
            }
        }

        console.log('Contacts added/updated successfully.');

            
        } catch (error) {
            console.error(error)
        }
    }

    async getContact(phone) { 
        try {
            const contactPhone = await pool.query('SELECT * FROM phones WHERE phone = $1', [phone]);
            if (contactPhone.rows.length > 0) {
                const contactName = await pool.query('SELECT * FROM names WHERE phone_id = $1', [contactPhone.rows[0].id]);
                return {phoneNumber: contactPhone.rows, contactNames: contactName.rows};
            } 
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new ContactsService();


