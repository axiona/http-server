import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import BodyJson from '../../../dist/middleware/body-json';
import ReplaceToNumber, {ReplaceToNumberArgument, ReplaceToNumberReturn} from './replace-to-number';
import {ReplaceParameters} from '../../../dist/middleware/replace';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let called : boolean = false;
    let response : AxiosResponse<ReplaceToNumberReturn>;
    let data : ReplaceToNumberArgument = {
        height : '1',
        length : '5'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router
            .add(BodyJson.Parameter())
            .add(ReplaceParameters(ReplaceToNumber, ['request', 'body']))
            .add(function (ctx) {

            let data : ReplaceToNumberReturn = ctx.request.body;
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

    let called : boolean = false;
    let response : AxiosResponse<ReplaceToNumberReturn>;
    let data : ReplaceToNumberArgument = {
        height : '1',
        length : '5'
    };

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());


    it('add request', ()=>{

        router
            .add(BodyJson.Parameter())
            .add(function (ctx) {

                ctx.response.body = 'data';
                called = true;
                return ctx;
            })
            .add(ReplaceParameters(status => status + 2 , ['response', 'status']));
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



