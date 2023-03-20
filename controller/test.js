const { Users } = require('../db/test');
const { Tests } = require('../db/test2');


class testController {

    async add(req, res) {
        try {
            const {id, name} = req.query;

            console.log(id, name);

            if(id % 2 == 0){
                await Users.create({
                    id,
                    name,
                });
                
            } else {
                await Tests.create({
                    id,
                    name,
                });
            }

            return res.json({
                message: "Ok"
            })

        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }

    async get(req, res) {
        try {

            const users = await Users.findAll();

            return res.json({
                users,
            })

        } catch (err) {
            console.log(err);
        }
        return res.sendStatus(404);
    }
}

module.exports = new testController();