import Context from '../context/context';


export default function Next<Ctx extends Context>(context : Ctx) : Ctx {

    return context;
}

