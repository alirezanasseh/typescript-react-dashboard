function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, any> {
    return obj.hasOwnProperty(prop);
}

export const objectHelpers = {
    hasOwnProperty
}
