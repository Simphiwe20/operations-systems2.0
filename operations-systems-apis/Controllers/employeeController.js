const employee = require('../Models/employees')

module.exports = {
    getAllEmployees: async (req, res) => {
        try {
            let employees = await employee.find()
            res.status(200).send(employees)
        }catch {
            res.status(404).send('Employees not found')
        }
    },
    addEmployees: async (req, res) => {
        try {
            let employees = employee(req.body)
            let result = await employees.save()
            console.log(result)
            res.send(result)
        }catch {
            res.send({Error: 'We ran into an error'})
        }
    }
}