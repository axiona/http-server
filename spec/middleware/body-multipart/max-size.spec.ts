import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyMultipart from '../../../dist/middleware/body-multipart.js';
import FormData from "form-data";
import {createReadStream} from "fs";
import MaxSizeExceeded from '../../../dist/file/catch/max-size-exceeded.js';
import Timeout from '@axiona/promise/timeout.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<{data : string}>;
    let nextCalled  = false;
    const server = Server();

    it('open', ()=>server.open().then(() => Timeout(0.5)));


    it('add request', ()=>{

        const router =  BindToServer(server, Router());

        router.catch(MaxSizeExceeded(function (ctx) {

            ctx.response.body = {data:'exception called'};

        })).next(BodyMultipart({
            maxFileSize:100 * 1024,
        })).next(function (ctx) {

            nextCalled = true;
            ctx.response.body = {data:1};
            return ctx;
        });

    });

    it('send request', async function () {

        const path = __dirname + '/../../file-source/jpg.jpg';
        const image = createReadStream(path);
        await Timeout(0.5);

        const form = new FormData();
        form.append('image', image);
        return Axios.request( {
            method: 'post',
            url:`http://localhost:${server.config.port}`,
            data: form,
            headers: {
                'Content-Type' : 'multipart/form-data',
                ...form.getHeaders()
            },
            timeout: 3000
        }).then((res)=>{

            response = res;

        }).catch(fail);
    });

    it('assert value', function () {

        expect(nextCalled).toBeFalse();

        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
        expect(response.data).toEqual({data:'exception called'});
    });

    it('close', ()=>Timeout(0.5).then(()=>server.close()));
});
