import String from '@axiona/string/boolean/string.js';
import Validator from '@axiona/validator/simple.js';
import Validatable from '@axiona/validator/validatable/simple.js';
import Context from '../../../dist/context/context.js';


export default <Validator<Context & {data ?: string}, Context & {data : string}>> function ContextValidator<
    Ctx extends Context & {data ?: string}
>(
    context : Ctx,
) : Validatable<
        Ctx,
        Ctx & {data : string}
> {

    const valid = String(context.data);

    return {
        valid,
        message : valid ? 'valid' : 'invalid',
        value : context as Ctx & {data : string}
    };
};

export function ContextValidatorFunction<
    Ctx extends Context & {data ?: string}
>() : Validator<Ctx & {data ?: string}, Ctx & {data : string}> {

    return function <
        Ctx extends Context & {data ?: string}
    >(
        context : Ctx,
    ) : Validatable<
        Ctx,
        Ctx & {data : string}
    > {

        const valid = String(context.data);

        return {
            valid,
            message : valid ? 'valid' : 'invalid',
            value : context as Ctx & {data : string}
        };
    } as Validator<Ctx & {data ?: string}, Ctx & {data : string}>;
}
