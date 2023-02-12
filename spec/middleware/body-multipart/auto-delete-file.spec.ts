import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import FormData from 'form-data';
import Fs, {createReadStream} from "fs";
import FormidableFileBoolean from "../../../dist/file/boolean/file.js";
import FormidableFile from "../../../dist/file/validator/file.js";
import Validatable from "@alirya/validator/validatable/validatable.js";
import Path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const root = Path.resolve(__dirname + '/../../../temp');

Fs.mkdir(root, {recursive:true}, function (error){
    console.error(error);
});


describe('single', () => {

    let response : AxiosResponse<{name : string, address : string}>;
    let validatable : Validatable;
    let validatableInvalid : Validatable;
    let valid : boolean;
    let extension : string|null = null;
    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router.next(BodyMultipart({uploadDir:root, autoDeleteFile:true, autoDeleteFileErrorHandler:(error)=>console.error(error)})).next(function (ctx) {

            validatable = FormidableFile.Parameters()(ctx.request.body.image as object);
            validatableInvalid = FormidableFile.Parameters()(ctx.request.body as object);

            const image = ctx.request.body.image as object;
            valid = FormidableFileBoolean(image);
            if(FormidableFileBoolean(image)) {
                extension = image.extension;
            }

            // console.log(image);

            ctx.response.body = {data:1};
            return ctx;
        });

    });

    it('send request', function (done) {

        const path = Path.resolve(__dirname + '/../../file-source/normal.png');

        const form = new FormData();
        form.append('image', createReadStream(path));
        Axios.request( {
            method: 'post',
            url:`http://localhost:${server.config.port}`,
            data: form,
            headers: {
                // 'Content-Type' : 'multipart/form-data',
                ...form.getHeaders()
            }
        }).then((res)=>{

            response = res;

        }).catch(fail)
            .finally(function () {
            setTimeout(done, 250);
        });
    });

    it('assert value', function (done) {
        setTimeout(done, 250);
    });

    it('assert value', function () {

        expect(valid).toBeTrue();
        expect(extension).toBe('png');
        expect(validatable.valid).toBeTrue();
        expect(validatable.message).toEqual('value is compatible with formidable-file.');

        expect(validatableInvalid.valid).toBeFalse();
        expect(validatableInvalid.message).toEqual('value is not compatible with formidable-file.');

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});
