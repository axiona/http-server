import Context from '../context/context.js';

export default function Passthru<Argument extends Context = Context>(context: Argument) : Argument|Promise<Argument|void>|void {

    return  context;
}
