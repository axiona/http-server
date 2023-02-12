import Metadata from '../router/metadata/metadata.js';


export default interface Registrable {
    /**
     * called on registered to router
     * @param context
     */
    register?:(router: Metadata) => Metadata;
}