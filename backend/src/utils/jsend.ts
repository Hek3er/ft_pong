export const jsendSuccess = (data: any) => {
    return {status: "success", data}
}

export const jsendFail = (data: any, message = "") => {
    return {status: "fail", data, message}
}

export const jsendError = (message: string, code = 500, data = {}) => {
    return {status: "error", message, code, data};
}