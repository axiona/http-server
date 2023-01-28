import Metadata from "../router/metadata/metadata";


export default interface Registrable {
    /**
     * called on registered to router
     * @param context
     */
    register?:(router: Metadata) => Metadata;
}