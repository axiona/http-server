import Context from '../context/context.js';


export default function Next<ContextType extends Context> (context : ContextType) : ContextType {

    return context;
}

