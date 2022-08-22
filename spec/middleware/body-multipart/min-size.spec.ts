import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart';
import FormData from 'form-data';
import {createReadStream} from "fs";
import FormidableFileBoolean from "../../../dist/file/boolean/file";
import MinimumSize from "../../../dist/file/validator/minimum-size";
import Validatable from "@alirya/validator/validatable/validatable";
import File from "../../../dist/file/file";


it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let validatable : Validatable;
    let validatableInvalid : Validatable;
    let valid : boolean;
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.add(BodyMultipart()).add(function (ctx) {

            const file = ctx.request.body.image as File;
            validatable        = MinimumSize.Parameters(file.size)(file);
            validatableInvalid = MinimumSize.Parameters()(file);

            const image = ctx.request.body.image as object;
            valid = FormidableFileBoolean(image);

            ctx.response.body = {data:1};
            return ctx;
        });

    });

    it('send request', function (done) {

        const path = __dirname + '/../../file-source/zero-byte.jpg';

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
        expect(validatable.message).toEqual('File size is valid.');

        expect(validatableInvalid.valid).toBeFalse();
        expect(validatableInvalid.message).toEqual('File size too small.');

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
