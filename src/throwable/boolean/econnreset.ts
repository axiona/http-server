export type EconnresetType = Error & {
    code : 'ECONNRESET'
};

export default function Econnreset(error : object|EconnresetType) : error is EconnresetType {

    if((error as EconnresetType).code !== 'ECONNRESET') {

        return false;
    }

    if(!(error instanceof Error)) {

        return false;
    }

    return true;
}