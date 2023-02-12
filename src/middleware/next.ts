import Context from '../context/context.js';


export default function Next<Ctx extends Context>(context : Ctx) : Ctx {

    return context;
}

