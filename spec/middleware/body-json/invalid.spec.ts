import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json.js';
import {HttpError} from "http-errors";
import FromError from '../../../dist/context/from-error.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('multi parse', () => {

    let called  = false;
    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    let errors : HttpError;


    it('add request', ()=>{

        router
            .catch((context, error : HttpError)=>{
                FromError(context, error);
            })
            .next(BodyJson.Parameter())
            .next(BodyJson.Parameter())
            .next(function (ctx) {

            ctx.response.body = 'data';
            called = true;
            return ctx;
        });

    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`,  {}).then((res)=>{

            fail('request should fail');

        }).catch(e=> {
            response = e.response;

        }).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual('stream is not readable');
        expect(called).toBe(false);
        expect(response.status).toEqual(500);
        expect(response.statusText).toEqual('Internal Server Error');
    });

});



