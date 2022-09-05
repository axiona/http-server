import Context from '../../dist/context/context';
import FromResponse from '../../dist/context/set-response';


describe('empty', () => {

    let cts = FromResponse.Parameters({

        response : {
            set (header) {},
            body : undefined,
            status : 0,
            message : '',
        }

    } as Context, {headers:{}, message:'', code:200, body: 1});

    let number : number = cts.response.body;
    // @ts-expect-error
    let string : string = cts.response.body;
    // @ts-expect-error
    let object : object = cts.response.body;

});
