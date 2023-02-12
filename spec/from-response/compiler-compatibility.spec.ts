import Context from '../../dist/context/context.js';
import FromResponse from '../../dist/context/set-response.js';


describe('empty', () => {

    const cts = FromResponse.Parameters({

        response : {
            set (header) {},
            body : undefined,
            status : 0,
            message : '',
        }

    } as Context, {headers:{}, message:'', status:200, body: 1});

    const number : number = cts.response.body;
    // @ts-expect-error
    const string : string = cts.response.body;
    // @ts-expect-error
    const object : object = cts.response.body;

    it('', ()=>expect(true).toBeTrue());
});
