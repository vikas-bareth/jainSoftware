const Joi = require('joi')

module.exports.projectSchema = Joi.object({
    project:Joi.object({
        title:Joi.string().required(),
        status:Joi.number().min(0).required(),
        
        deadline:Joi.date().required(),
        manager:Joi.string().required(),
        developer:Joi.string().required(),
        description:Joi.string().required()

    }).required()
})