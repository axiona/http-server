import Router from '../../../dist/router/middleware.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json.js';
import ReplaceToNumber, {ReplaceToNumberArgument, ReplaceToNumberReturn} from './replace-to-number.js';
import {ReplaceParameters} from '../../../dist/middleware/replace.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called  = false;
    let response : AxiosResponse<ReplaceToNumberReturn>;
    const data : ReplaceToNumberArgument = {
        height : '1',
        length : '5'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .next(BodyJson.Parameter())
            .next(ReplaceParameters(ReplaceToNumber, ['request', 'body']))
            .next(function (ctx) {

            const data : ReplaceToNumberReturn = ctx.request.body;
            ctx.response.body = data;
            called = true;
            return ctx;
        });


    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual({
            height : 1,
            length : 5
        } as ReplaceToNumberReturn);
        expect(called).toBe(true);
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
    });

});


describe('exists', () => {

    let called  = false;
    let response : AxiosResponse<ReplaceToNumberReturn>;
    const data : ReplaceToNumberArgument = {
        height : '1',
        length : '5'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .next(BodyJson.Parameter())
            .next(function (ctx) {

                ctx.response.body = 'data';
                called = true;
                return ctx;
            })
            .next(ReplaceParameters(status => status + 2 , ['response', 'status']));
    });

    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        expect(response.data).toEqual('data');
        expect(called).toBe(true);
        expect(response.status).toEqual(202);
        expect(response.statusText).toEqual('Accepted');
    });

});



