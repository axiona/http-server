import Context from '../context/context';

export default function Method(context : Context, methods : string[]) : boolean {

    if(methods.includes(context.request.method)) {

        return true;
    }

    if(methods.map(method=>method.toUpperCase()).includes(context.request.method.toUpperCase())) {

        return true;
    }

    return false;
}
