import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator';
import Stop from '../../../dist/middleware/stop';
import OneGuard from './one-validator';
import RecordValidator, {ValidatorType} from './record-validator';
import Validatable from '@alirya/validator/validatable/validatable';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(OneGuard(), ['response', 'status'], undefined))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validator.Parameters(OneGuard(), ['response', 'status'], undefined))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router.next(Validator.Parameters(RecordValidator(), ['request', 'body'])).next(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;

                const validatable : Validatable = ctx.validatable;

                const object : object = ctx.request.body;
                const type : ValidatorType = ctx.request.body;
                const record : Record<PropertyKey, any> = ctx.request.body;
                ctx.response.body = record;
                return ctx;
            });
        });

        describe('parameter', ()=>{

            router
                .next(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router.next(ValidatorParameter({
                validator: RecordValidator(),
                invalid: Stop(),
                replace: true,
                properties: ['request', 'body']
            })).next(function (ctx) {

                // @ts-expect-error
                const boolean : boolean = ctx.request.body;
                // @ts-expect-error
                const string : string = ctx.request.body;
                // @ts-expect-error
                const number : number = ctx.request.body;

                const validatable : Validatable = ctx.validatable;

                const object : object = ctx.request.body;
                const type : ValidatorType = ctx.request.body;
                const record : Record<PropertyKey, any> = ctx.request.body;
                ctx.response.body = record;
                return ctx;
            });

            router
                .next(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });
        });
    });

    describe('with context', ()=>{
        describe('parameters', ()=>{

            router
                .next(ValidatorParameters(OneGuard(), ['response', 'status'], undefined))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validator.Parameters(OneGuard(), ['response', 'status'], undefined))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

        });
        describe('parameter', ()=>{

            router
                .next(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .next(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .next(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

        });
    });

});



