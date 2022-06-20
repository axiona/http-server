


export type ReplaceToNumberArgument = {
    height : string,
    length : string
};

export type ReplaceToNumberReturn = {
    height : number,
    length : number
};


export default function ReplaceToNumber(type: ReplaceToNumberArgument) : ReplaceToNumberReturn {

    return {
        height: parseInt(type.height),
        length: parseInt(type.length),
    };
}
