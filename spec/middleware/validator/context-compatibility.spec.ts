import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import ContextValidator from './context-validator';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';
import Validatable from '@alirya/validator/validatable/validatable';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, Router());

describe('context compatibility', ()=>{

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(ContextValidator))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });


            router.next(ValidatorParameters(ContextValidator))
                .next(function (ctx) {

                    // @ts-expect-error
                    const boolean : boolean = ctx.data;
                    // @ts-expect-error
                    const object : object = ctx.data;
                    // @ts-expect-error
                    const number : number = ctx.data;
                    // @ts-expect-error
                    const record : Record<PropertyKey, any> = ctx.request.body;

                    const validatable : Validatable = ctx.validatable;

                    const string : string = ctx.data;
                    ctx.response.body = record;
                    return ctx;
                });

            router
                .next(Validator.Parameters(ContextValidator))
                .next(function (ctx) {

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
                .next(ValidatorParameter({validator:ContextValidator}))
                .next(function (ctx) {

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
                .next(Validator.Parameter({validator:ContextValidator}))
                .next(function (ctx) {

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
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidatorParameters(ContextValidator))
                .next(function (ctx) {

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
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validator.Parameters(ContextValidator))
                .next(function (ctx) {

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
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(ValidatorParameter({validator:ContextValidator}))
                .next(function (ctx) {

                    let data : string = ctx.data;
                    // @ts-expect-error
                    let number : number = ctx.data;
                    // @ts-expect-error
                    let boolean : boolean = ctx.data;
                    // @ts-expect-error
                    let object : object = ctx.data;

                    return ctx;
                });

            router.next(ValidatorParameter({
                validator: ContextValidator
            })).next(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.data;
                // @ts-expect-error
                const object : object = ctx.data;
                // @ts-expect-error
                const number : number = ctx.data;
                // @ts-expect-error
                const record : Record<PropertyKey, any> = ctx.request.body;

                const validatable : Validatable = ctx.validatable;

                const string : string = ctx.data;
                ctx.response.body = record;
                return ctx;
            });

            router
                .next(function (context) {

                    return Object.assign(context, {data: 'a' as string|number|boolean});

                })
                .next(Validator.Parameter({validator:ContextValidator}))
                .next(function (ctx) {

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


