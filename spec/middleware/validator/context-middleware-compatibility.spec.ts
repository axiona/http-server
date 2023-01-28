import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';
import Stop from '../../../dist/middleware/stop';
import Context from '../../../dist/context/context';
import ContextValidator from './context-validator';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(ContextValidator, undefined, Stop()))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validator.Parameters(ContextValidator, undefined, Stop()))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

        });


        describe('parameter', ()=>{

            router
                .next(ValidatorParameter({
                    validator: ContextValidator,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });

            router
                .next(Validator.Parameter({
                    validator: ContextValidator,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : Context = ctx;
                    // @ts-expect-error
                    let number : Context<{ data :number }> = ctx;
                    // @ts-expect-error
                    let boolean : Context<{ data :boolean }> = ctx;
                    // @ts-expect-error
                    let string : Context<{ data :string }> = ctx;

                    return ctx;
                });
        });
    });

    describe('with context', ()=>{

        describe('parameters', ()=>{

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidatorParameters(ContextValidator, undefined, Stop()))
                .next(function (ctx) {

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidatorParameters(ContextValidator, undefined, Stop()))
                .next(function (ctx) {

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });
        });

        describe('parameter', ()=>{
            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(ValidatorParameter({
                    validator: ContextValidator,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

            router
                .next(function (context) {

                    return Object.assign(context, {request: {body : 'a' as string|number|boolean}});

                })
                .next(Validator.Parameter({
                    validator: ContextValidator,
                    invalid : Stop()
                }))
                .next(function (ctx) {

                    let data : string|number|boolean = ctx.request.body;
                    // @ts-expect-error
                    let number : number = ctx.request.body;
                    // @ts-expect-error
                    let boolean : boolean = ctx.request.body;
                    // @ts-expect-error
                    let string : string = ctx.request.body;

                    return ctx;
                });

        });
    });

});



