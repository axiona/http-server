import Context from '../context/context';

export default function Method(context : Context, methods : string[]) : boolean {

    if(
        methods.includes(context.request.method) ||
        methods.includes(context.request.method.toUpperCase())
    ) {

        return true;
    }

    return false;
}
