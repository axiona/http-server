import Context from '../context/context';

// export default interface Middleware<Argument extends Context = Context, Return extends Context = Argument> {
//
//     (context: Argument) : Return|Promise<Return|void>|void;
// }
// export default class Passthru<Argument extends Context = Context> {
//
//     register(context: Router) : void {
//
//     }
//
//     handle(context: Argument) : Argument|Promise<Argument|void>|void {
//
//         return  context;
//     }
// }

export default function Passthru<Argument extends Context = Context>(context: Argument) : Argument|Promise<Argument|void>|void {

    return  context;
}
