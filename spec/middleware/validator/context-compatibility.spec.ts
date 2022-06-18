import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Stop from '../../../dist/middleware/stop';
import Number from '@alirya/number/boolean/number';
import String from '../../../../string/dist/boolean/string';
import ContextValidator from './context-validator';
import {O} from 'ts-toolbelt';
import Context from '../../../dist/context/context';
import RecordValidator from './record-validator';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';

describe("force console log", () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

beforeAll(()=>server.open());
afterAll(()=>server.close());

let router =  BindToServer(server, new Router());

describe('guard', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidatorParameters(ContextValidator))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .add(Validator.Parameters(ContextValidator))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

        });


        describe('parameter', ()=>{

            router
                .add(ValidatorParameter({validator:ContextValidator}))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .add(Validator.Parameter({validator:ContextValidator}))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });
        });
    });

    describe('with context', ()=>{

        describe('parameters', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidatorParameters(ContextValidator))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validator.Parameters(ContextValidator))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });
        });


        describe('parameter', ()=>{

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(ValidatorParameter({validator:ContextValidator}))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router
                .add(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .add(Validator.Parameter({validator:ContextValidator}))
                .add(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

        });
    });

});


