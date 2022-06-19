import Context from '../context/context';


export default function Next<ContextType extends Context> (context : ContextType) : ContextType {

    return context;
}

