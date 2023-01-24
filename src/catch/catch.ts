import Context from '../context/context';
import Router from '../router/router';
import Union from '@alirya/promise/union';
import Error from "./error";
import Metadata from "../router/metadata/metadata";

export default interface Catch<Argument extends Context = Context, ErrorType extends Error = Error> {

    register ?: (context: Metadata) => Metadata;
    (context: Argument, error: ErrorType) : Union<void>;
}
