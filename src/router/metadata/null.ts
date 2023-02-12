import Metadata from './metadata.js';
import FromPath from '../../matcher/from-path.js';

const path = FromPath('');

export default function Null() : Metadata {

    return  {
        headers: {},
        method: [],
        children: [],
        path,
    };
}