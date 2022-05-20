const formatNumber = (value: number | undefined) => {
    if(value === undefined || !value) return '';
    return new Intl.NumberFormat().format(value);
};

const getNumber = (value: number | string | undefined) => {
    if(value === undefined || !value) {
        return 0;
    }
    return parseInt(value.toString().replaceAll(',', ''));
};

export const numberHelpers = {
    formatNumber,
    getNumber
};