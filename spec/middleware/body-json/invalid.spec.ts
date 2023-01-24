import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json';
import ContentTypeJson from '@alirya/http/headers/header/content-type-json';
import {HttpError} from "http-errors";
import FromError from "../../../dist/context/from-error";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('multi parse', () => {

    let called : boolean = false;
    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());

    let errors : HttpError;


    it('add request', ()=>{

        router
            .catch((context, error : HttpError)=>{
                FromError(context, error);
            })
            .add(BodyJson.Parameter())
            .add(BodyJson.Parameter())
            .add(function (ctx) {

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



