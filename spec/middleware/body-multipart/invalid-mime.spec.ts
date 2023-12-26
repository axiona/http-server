import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import FormData from "form-data";
import {createReadStream} from "fs";
import FormidableFileBoolean from '../../../dist/file/boolean/file.js';
import MimeType from '../../../dist/file/validator/mime-types.js';
import Validatable from "@axiona/validator/validatable/validatable.js";
import File from '../../../dist/file/file.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let validatable : Validatable;
    let validatableInvalid : Validatable;
    let valid : boolean;
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(BodyMultipart()).next(function (ctx) {

            validatable        = MimeType.Parameters(['image/jpeg'])(ctx.request.body.image as File);
            validatableInvalid = MimeType.Parameters(['image/png'])(ctx.request.body.image as File);

            const image = ctx.request.body.image as object;
            valid = FormidableFileBoolean(image);

            ctx.response.body = {data:1};
            return ctx;
        });

    });

    it('send request', function (done) {

        const path = __dirname + '/../../file-source/jpg.jpg';

        const form = new FormData();
        form.append('image', createReadStream(path));
        Axios.request( {
            method: 'post',
            url:`http://localhost:${server.config.port}`,
            data: form,
            headers: {
                'Content-Type' : 'multipart/form-data',
                ...form.getHeaders()
            }
        }).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(valid).toBeTrue();
        expect(validatable.valid).toBeTrue();
        expect(validatable.message).toEqual('Mime type image/jpeg is valid.');

        expect(validatableInvalid.valid).toBeFalse();
        expect(validatableInvalid.message).toEqual('Mime type image/jpeg is not valid, allowed image/png.');

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
