import Server from '../../server.js';
import {PathParameters} from "../../../dist/middleware/path.js";
import BindToServer from "../../../dist/router/append-server.js";
import Router from "../../../dist/router/middleware.js";
import Axios, {AxiosError, AxiosResponse} from "axios";
import {RateLimiterMemory} from "rate-limiter-flexible";
import RateLimiter from "../../../dist/middleware/rate-limiter.js";


it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {


    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    const router =  BindToServer(server, Router());

    const limiter = new RateLimiterMemory({
        points: 5,
        duration: 1,
    });

    it('add request', ()=>{

        router
            .next(PathParameters('/path/child'))
            .next(RateLimiter(limiter, (context)=>({key:context.ip})))
            .next(function (ctx) {
            ctx.response.body = 'data';
            return ctx;
        });

    });

    it('send 5 request', function (done) {

        const list = [1, 2, 3, 4, 5];

        const promises = list.map(function (i) {

            return Axios.post(`http://localhost:${server.config.port}/path/child`).then((res)=>{

                return i;
            });
        });


        Promise.all(promises).then(data => {

            expect(data).toEqual(list);
            done();
        });

    });

    it('wait 1 sec', function (done) {
        setTimeout(done, 1000);
    });

    it('send 6 request', function () {

        const fulfilled = [1, 2, 3, 4, 5];
        const rejected = [6];
        const list = [...fulfilled, ...rejected];

        const promises = list.map(function (i) {

            return Axios.post(`http://localhost:${server.config.port}/path/child`).then((res)=>{

                return i;
            });
        });

        return Promise.allSettled(promises).then(results => {

            for (const [index, result] of results.entries()) {

                if(fulfilled.includes(list[index])) {

                    expect(result.status).toEqual('fulfilled');
                    expect((result as PromiseFulfilledResult<number>).value).toEqual(list[index]);

                } else {

                    const error = (result as PromiseRejectedResult).reason as AxiosError;

                    expect((error.response as AxiosResponse).status).toBe(429);
                    expect((error.response as AxiosResponse).data).toEqual('Too Many Requests');
                    expect((error.response as AxiosResponse).statusText).toBe('Too Many Requests');
                }
            }
        });

    });
});