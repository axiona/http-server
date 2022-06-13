// import Axios, {AxiosResponse} from 'axios';
// import Server from '../../server';
// import BindToServer from '../../../dist/router/append-server';
// import Router from '../../../dist/router/standard';
// import BodyText from '../../../dist/middleware/body-text';
// import Validation from '../../../dist/middleware/validation';
// import ContextValidatable from './context-validatable';
// import {ResponseParameters} from '../../../dist/middleware/response';
// import PaymentRequiredParameters from '../../../../http/dist/response/payment-required-parameters';
// import NumberValidatable from './number-validatable';
// import {ValidationParameters} from '../../../dist/middleware/validation';
//
// it("force console log", () => { spyOn(console, 'log').and.callThrough();});
//
// describe('valid', () => {
//
//     let called : boolean = false;
//
//     let data : number = 1;
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
//                 return Object.assign(context, {data:parseInt(context.request.body) as string|number|boolean});
//
//             })
//             .add(ValidationParameters(NumberValidatable, ['data']))
//             .add(function (ctx) {
//                 const data : 1 = ctx.data;
//                 ctx.response.body = data;
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
//         expect(response.data).toEqual(data.toString());
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
//             .add(ValidationParameters(NumberValidatable, ['data']))
//             .add(function (ctx) {
//
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
//             .add(ValidationParameters(ContextValidatable))
//             .add(function (ctx) {
//
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
//             .add(ValidationParameters(ContextValidatable, undefined, ResponseParameters(PaymentRequiredParameters())))
//             .add(function (ctx) {
//
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
