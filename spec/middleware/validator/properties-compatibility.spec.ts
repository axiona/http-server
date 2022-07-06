import Router from '../../../dist/router/standard.js';
import Server from '../../server.js';
import BindToServer from '../../../dist/router/append-server.js';
import Validator, {ValidatorParameter, ValidatorParameters} from '../../../dist/middleware/validator.js';
import Stop from '../../../dist/middleware/stop.js';
import OneGuard from './one-validator.js';
import RecordValidator, {ValidatorType} from './record-validator.js';
import Validatable from '@alirya/validator/validatable/validatable.js';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


const server = Server();

let router =  BindToServer(server, new Router());

describe('guard', () => {

    describe('no context', ()=>{

        describe('parameters', ()=>{

            router
                .add(ValidatorParameters(OneGuard(), ['response', 'status'], undefined))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validator.Parameters(OneGuard(), ['response', 'status'], undefined))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router.add(Validator.Parameters(RecordValidator(), ['request', 'body'])).add(function (ctx) {

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
                .add(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router.add(ValidatorParameter({
                validator: RecordValidator(),
                invalid: Stop,
                replace: true,
                properties: ['request', 'body']
            })).add(function (ctx) {

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
                .add(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

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
                .add(ValidatorParameters(OneGuard(), ['response', 'status'], undefined))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validator.Parameters(OneGuard(), ['response', 'status'], undefined))
                .add(function (ctx) {

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
                .add(ValidatorParameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

                    let number : number = ctx.response.status;
                    let one : 1 = ctx.response.status;
                    // @ts-expect-error
                    let two : 2 = ctx.response.status;
                    // @ts-expect-error
                    let string : string = ctx.response.status;

                    return ctx;
                });

            router
                .add(Validator.Parameter({
                    validator: OneGuard(),
                    properties: ['response', 'status'],
                    invalid: undefined
                }))
                .add(function (ctx) {

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



