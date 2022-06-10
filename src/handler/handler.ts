import Context from '../context/context';

export default interface Handler<Argument extends Context = Context, Return extends Context = Argument> {

    handle(context: Argument) : Return|Promise<Return|void>|void;
}
