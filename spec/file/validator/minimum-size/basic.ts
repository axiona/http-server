import Axios, {AxiosError, AxiosResponse} from "axios";
import Server from "../../../server";
import BindToServer from "../../../../dist/router/append-server";
import Router from "../../../../dist/router/middleware";
import BodyMultipart from "../../../../dist/middleware/body-multipart";
import File from "../../../../dist/file/file";
import MinimumSize, {MinimumSizeParameters} from "../../../../dist/file/validator/minimum-size";
import FormidableFileBoolean from "../../../../dist/file/boolean/file";
import FormData from "form-data";
import {createReadStream} from "fs";
import Validatable from "@alirya/validator/validatable/validatable";
import Validator from "../../../../dist/middleware/validator";
import RecordValidator from "../../../middleware/validator/record-validator";
import {MapAllParameters} from '@alirya/object/validator/map-all';
import {StringParameters} from '@alirya/string/validator/string';
import And from '@alirya/object/validatable/and';
import Map from '@alirya/object/message/message/record/map';

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

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .catch(function (ctx) {

                ctx.response.body = {data:'exception called'};

            })
            .add(BodyMultipart())
            .add(Validator.Parameters(MapAllParameters({
                image: MinimumSizeParameters(250)
            }, And, Map), ['request', 'body']))
            .add(function (ctx) {

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
