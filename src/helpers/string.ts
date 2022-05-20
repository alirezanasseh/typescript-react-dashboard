const upperFirst = (str: string) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};

const snakeToPascal = (str: string) => {
    return str.split('_').map(part => {
        return upperFirst(part);
    }).join('');
};

const snakeToSeparate = (str: string) => {
    return str.split('_').map(part => {
        return upperFirst(part);
    }).join(' ');
};

export const stringHelpers = {
    upperFirst,
    snakeToPascal,
    snakeToSeparate
};