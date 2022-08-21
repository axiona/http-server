import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart';
import FormData from 'form-data';
import {createReadStream} from "fs";
import FormidableFileBoolean from "../../../dist/file/boolean/file";
import FormidableFile from "../../../dist/file/validator/file";
import MimeType from "../../../dist/file/validator/mime-types";
import Validatable from "@alirya/validator/validatable/validatable";
import File from "../../../dist/file/file";
import MaxSizeExceeded from "../../../dist/file/error-handler/max-size-exceeded";


it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{data : string}>;
    let nextCalled : boolean = false;
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router.catch(MaxSizeExceeded(function (ctx) {

            ctx.response.body = {data:'exception called'};

        })).add(BodyMultipart({
            maxFileSize:100 * 1024,
        })).add(function (ctx) {

            nextCalled = true;
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

        expect(nextCalled).toBeFalse();

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
        expect(response.data).toEqual({data:'exception called'});
    });

});
