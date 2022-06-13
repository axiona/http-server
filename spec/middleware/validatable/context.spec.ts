// import Router from '../../../dist/router/standard';
// import Server from '../../server';
// import BindToServer from '../../../dist/router/append-server';
// import Axios, {AxiosResponse} from 'axios';
// import BodyText from '../../../dist/middleware/body-text';
// import String from '../../../../string/dist/boolean/string';
// import Validation from '../../../dist/middleware/validation';
// import {FromResponseParameters} from '../../../dist/context/from-response';
// import PaymentRequiredParameters from '../../../../http/dist/response/payment-required-parameters';
// import ContextValidatable from './context-validatable';
// import {ResponseParameters} from '../../../dist/middleware/response';
//
// it("force console log", () => { spyOn(console, 'log').and.callThrough();});
//
// describe('valid', () => {
//
//     let called : boolean = false;
//
//     let data : string = 'string test';
//
//     let response : AxiosResponse<string>;
//
//     const server = Server();
//
//     beforeAll(()=>server.open());
//     afterAll(()=>server.close());
//
//     let router =  BindToServer(server, new Router());
//
//     it('add request', ()=>{
//
//         router
//             .add(BodyText.Parameters())
//             .add(function (context) {
//
//                 return Object.assign(context, {data:context.request.body as string|number|boolean});
//
//             }).add(function (ctx) {
//                 const string : string|number|boolean = ctx.data;
//                 return ctx;
//             })
//             .add(Validation.Parameters(ContextValidatable))
//             .add(function (ctx) {
//                 const string : string = ctx.data;
//                 ctx.response.body = string;
//                 called = true;
//                 return ctx;
//             });
//
//     });
//
//
//     it('send request', function (done) {
//
//         Axios.post(`http://localhost:${server.config.port}`, data, {headers:{'content-type':'text/plain'}}).then((res)=>{
//
//             response = res;
//
//         }).catch(fail).finally(done);
//     });
//
//     it('assert value', function () {
//
//         expect<string>(response.data).toEqual(data);
//         expect(called).toBe(true);
//         expect(response.status).toEqual(200);
//         expect(response.statusText).toEqual('OK');
//     });
//
// });
//
// describe('invalid', () => {
//
//     let called : boolean = false;
//
//     let data : string = 'string test';
//
//     let response : AxiosResponse<string>;
//
//     const server = Server();
//
//     beforeAll(()=>server.open());
//     afterAll(()=>server.close());
//
//     let router =  BindToServer(server, new Router());
//
//     it('add request', ()=>{
//
//         router
//             .add(Validation.Parameters(ContextValidatable))
//             .add(function (ctx) {
//
//             const string : string = ctx.data;
//             ctx.response.body = string;
//             called = true;
//             return ctx;
//         });
//
//     });
//
//
//     it('send request', function (done) {
//
//         Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{
//
//             fail('request should failed');
//
//         }).catch(e=>{
//
//             response = e.response;
//
//         }).finally(done);
//     });
//
//     it('assert value', function () {
//
//         expect<string>(response.data).toEqual('Not Found');
//         expect(called).toBe(false);
//         expect(response.status).toEqual(404);
//         expect(response.statusText).toEqual('Not Found');
//     });
//
// });
//
//
// describe('invalid default', () => {
//
//     let called : boolean = false;
//
//     let data : string = 'string test';
//
//     let response : AxiosResponse<string>;
//
//     const server = Server();
//
//     beforeAll(()=>server.open());
//     afterAll(()=>server.close());
//
//     let router =  BindToServer(server, new Router());
//
//     it('add request', ()=>{
//
//         router
//             .add(Validation.Parameters(ContextValidatable))
//             .add(function (ctx) {
//
//             const string : string = ctx.data;
//             ctx.response.body = string;
//             called = true;
//             return ctx;
//         });
//
//     });
//
//
//     it('send request', function (done) {
//
//         Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{
//
//             fail('request should failed');
//
//         }).catch(e=>{
//
//             response = e.response;
//
//         }).finally(done);
//     });
//
//     it('assert value', function () {
//
//         expect<string>(response.data).toEqual('Not Found');
//         expect(called).toBe(false);
//         expect(response.status).toEqual(404);
//         expect(response.statusText).toEqual('Not Found');
//     });
//
// });
//
//
// describe('invalid middleware', () => {
//
//     let called : boolean = false;
//
//     let data : string = 'string test';
//
//     let response : AxiosResponse<string>;
//
//     const server = Server();
//
//     beforeAll(()=>server.open());
//     afterAll(()=>server.close());
//
//     let router =  BindToServer(server, new Router());
//
//     it('add request', ()=>{
//
//         router
//             .add(Validation.Parameters(ContextValidatable, undefined, ResponseParameters(PaymentRequiredParameters())))
//             .add(function (ctx) {
//
//             const string : string = ctx.data;
//             ctx.response.body = string;
//             called = true;
//             return ctx;
//         });
//
//     });
//
//
//     it('send request', function (done) {
//
//         Axios.post(`http://localhost:${server.config.port}`, data).then((res)=>{
//
//             fail('request should failed');
//
//         }).catch(e=>{
//
//             response = e.response;
//
//         }).finally(done);
//     });
//
//     it('assert value', function () {
//
//         expect<string>(response.data).toEqual('Payment Required');
//         expect(called).toBe(false);
//         expect(response.status).toEqual(402);
//         expect(response.statusText).toEqual('Payment Required');
//     });
//
// });
