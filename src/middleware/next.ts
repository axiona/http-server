import Context from '../context/context';
import Middleware from './middleware';


export default function Next<ContextType extends Context> (context : ContextType) : ContextType {

    return context;
}

