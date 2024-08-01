import { validate } from '@utils/validate';
import Joi, { required } from 'joi';

const login = validate({
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }),
});

const register = validate({
    body: Joi.object({
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required().regex(/^[\w]{6,30}$/),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        gender: Joi.string().required(),
        superAdmin: Joi.boolean().required(),
    })
})

const resetPassword = validate({
    body: Joi.object({
        accessToken: Joi.string().required(),
        password: Joi.string().required(),
    })
})

export {
    login as loginValidation,
    register as registerValidation,
    resetPassword as resetPasswordValidation
}