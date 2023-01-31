import Context from '../context/context';
import CatchType from '../catch/catch';
import Metadata from "./metadata/metadata";
import Null from "./metadata/null";
import Compose from "../router/compose";

export default function Catch<ContextType extends Context  = Context> (
    handler : CatchType,
    metadata : Metadata = Null(),
) {

    return Compose<ContextType>(handler, metadata, async (context: Context, children) : Promise<Context|void> => {

        for (const router of children) {

            try {

                await router.call(context);

            } catch (error) {

                await handler(context, error);
            }
        }

        return context;
    });

}
