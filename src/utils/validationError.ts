
const uniqueCheck = async (isUnique: any) => {

    const validationError = {} as any;

    await Object.keys(isUnique).forEach((key) => {
        validationError[key] = `${isUnique[key]} is already been taken`;
    })

    return validationError;
}

const requiredCheck = async (errors: any) => {

    const validationError = {} as any;

    await Object.keys(errors).forEach((key) => {

        validationError[errors[key].path] = errors[key].message;
    })

    return  validationError;
}

export default {
    uniqueCheck,
    requiredCheck
}