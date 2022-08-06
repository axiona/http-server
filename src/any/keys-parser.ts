import Callable from "@alirya/function/callable";
import String from "@alirya/string/boolean/string";

function KeysParserDefaultParser (value) {

    try {

        return JSON.parse(value);

    } catch (error) {

        return value;
    }
}

export default function KeysParser(
    keys : ReadonlyArray<string|RegExp>,
    parser : Callable<[any], any>  = KeysParserDefaultParser
) : Callable<[string, any], any> {

    const strings = keys.filter(String);
    const patterns = keys.filter(key => key instanceof RegExp);

    return function (key : string, value)  {

        if(strings.includes(key)) {

            return parser(value);
        }

        for (const pattern of patterns) {

            if(key.match(pattern)) {

                return parser(value);
            }
        }


        return value;
    }


}