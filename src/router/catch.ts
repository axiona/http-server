import Context from '../context/context.js';
import CatchType from '../catch/catch.js';
import Metadata from './metadata/metadata.js';
import Null from './metadata/null.js';
import Compose from '../router/compose.js';

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
