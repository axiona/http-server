import Axios, {AxiosError, AxiosResponse} from 'axios';
import Server from '../../../server.js';
import BindToServer from '../../../../dist/router/append-server.js';
import Router from '../../../../dist/router/middleware.js';
import BodyMultipart from '../../../../dist/middleware/body-multipart.js';
import {MinimumSizeParameters} from '../../../../dist/file/validator/minimum-size.js';
import FormData from "form-data";
import {createReadStream} from "fs";
import Validatable from "@axiona/validator/validatable/validatable.js";
import Validator from '../../../../dist/middleware/validator.js';
import {MapAllParameters} from '@axiona/object/validator/map-all.js';
import And from '@axiona/object/validatable/and.js';
import Map from '@axiona/object/message/message/record/map.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{data : string|number}>;
    let error : AxiosError;
    let validatable : Validatable;
    let validatableInvalid : Validatable;
    let valid : boolean;
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .next(function (ctx) {

                ctx.response.body = {data:'exception called'};

            })
            .next(BodyMultipart())
            .next(Validator.Parameters(MapAllParameters({
                image: MinimumSizeParameters(250)
            }, And, Map), ['request', 'body']))
            .next(function (ctx) {

                ctx.response.body = {data:1};
                return ctx;
            });

    });

    it('send request', function (done) {

        const path = __dirname + '/../../../file-source/zero-byte.jpg';

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

            fail('response should fail');

        }).catch(e=>error = e).finally(done);
    });

    it('assert value', function () {

        expect((error.response as AxiosResponse).data).toEqual({ image: 'File size too small.' });
        expect((error.response as AxiosResponse).status).toEqual(400);
        expect((error.response as AxiosResponse).statusText).toEqual('Bad Request');
    });

});
