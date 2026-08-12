export function getErrorMessage(error) {
    const data = error.response?.data;

    if (!data) {
        return "Something went wrong.";
    }

    if (data.detail) {
        return data.detail;
    }

    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];

    if (Array.isArray(firstValue)) {
        return firstValue[0];
    }

    return firstValue;
}