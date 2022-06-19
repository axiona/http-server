import Context from '../../../dist/context/context';


export default function ContextDataGuard(value : Context & {data?:unknown}) : value is Context & {data:string} {

    return typeof value.data === 'string';
}

