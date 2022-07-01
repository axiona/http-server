import Router from '../../../dist/router/standard';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import {ValidatableResponseMessageParameters, ValidatableResponseMessageParameter} from '../../../dist/middleware/validatable-response-message';
import Context from '../../../dist/context/context';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('parameters', () => {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('default', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            return Object.assign(context, {validatable});

        }).add(ValidatableResponseMessageParameters()).add(function (ctx) {

            const validatable : {
                valid : boolean,
                message : string[],
                value : number
            } = ctx.validatable;

            // message
            {
                const string : string[] = ctx.validatable.message;
                // @ts-expect-error
                const boolean : boolean = ctx.validatable.message;
                // @ts-expect-error
                const number : number = ctx.validatable.message;
            }

            {
                const boolean : boolean = ctx.validatable.valid;
                // @ts-expect-error
                const string : string = ctx.validatable.valid;
                // @ts-expect-error
                const number : number = ctx.validatable.valid;
            }

            {
                const number : number = ctx.validatable.value;
                // @ts-expect-error
                const string : string = ctx.validatable.value;
                // @ts-expect-error
                const boolean : boolean = ctx.validatable.value;
            }

            return ctx;
        });

    });

    it('custom properties', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {c:validatable});
            return context as Context  & {c:{
                    valid : boolean,
                    message : ['message'],
                    value : number
                }};

        })
            .add(ValidatableResponseMessageParameters(undefined, ['c']))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.c;

                // message
                {
                    const string : string[] = ctx.c.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.c.message;
                    // @ts-expect-error
                    const number : number = ctx.c.message;
                }

                {
                    const boolean : boolean = ctx.c.valid;
                    // @ts-expect-error
                    const string : string = ctx.c.valid;
                    // @ts-expect-error
                    const number : number = ctx.c.valid;
                }

                {
                    const number : number = ctx.c.value;
                    // @ts-expect-error
                    const string : string = ctx.c.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.c.value;
                }

                return ctx;
            });

    });

    it('custom multi properties', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {a: {b : validatable}});
            return context as Context  & {a:{b:{
                        valid : boolean,
                        message : ['message'],
                        value : number
                    }}};

        })
            .add(ValidatableResponseMessageParameters(undefined, ['a','b']))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.a.b;

                // message
                {
                    const string : string[] = ctx.a.b.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.message;
                    // @ts-expect-error
                    const number : number = ctx.a.b.message;
                }

                {
                    const boolean : boolean = ctx.a.b.valid;
                    // @ts-expect-error
                    const string : string = ctx.a.b.valid;
                    // @ts-expect-error
                    const number : number = ctx.a.b.valid;
                }

                {
                    const number : number = ctx.a.b.value;
                    // @ts-expect-error
                    const string : string = ctx.a.b.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.value;
                }

                return ctx;
            });

    });

    it('custom multi properties, next', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {a: {b : validatable}});
            return context as Context  & {a:{b:{
                        valid : boolean,
                        message : ['message'],
                        value : number
                    }}};

        })
            .add(ValidatableResponseMessageParameters(undefined, ['a','b'], true))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.a.b;

                // message
                {
                    const string : string[] = ctx.a.b.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.message;
                    // @ts-expect-error
                    const number : number = ctx.a.b.message;
                }

                {
                    const boolean : boolean = ctx.a.b.valid;
                    // @ts-expect-error
                    const string : string = ctx.a.b.valid;
                    // @ts-expect-error
                    const number : number = ctx.a.b.valid;
                }

                {
                    const number : number = ctx.a.b.value;
                    // @ts-expect-error
                    const string : string = ctx.a.b.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.value;
                }

                return ctx;
            });

    });

});

describe('parameter', () => {

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, new Router());

    it('default', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            return Object.assign(context, {validatable});

        }).add(ValidatableResponseMessageParameter()).add(function (ctx) {

            const validatable : {
                valid : boolean,
                message : string[],
                value : number
            } = ctx.validatable;

            // message
            {
                const string : string[] = ctx.validatable.message;
                // @ts-expect-error
                const boolean : boolean = ctx.validatable.message;
                // @ts-expect-error
                const number : number = ctx.validatable.message;
            }

            {
                const boolean : boolean = ctx.validatable.valid;
                // @ts-expect-error
                const string : string = ctx.validatable.valid;
                // @ts-expect-error
                const number : number = ctx.validatable.valid;
            }

            {
                const number : number = ctx.validatable.value;
                // @ts-expect-error
                const string : string = ctx.validatable.value;
                // @ts-expect-error
                const boolean : boolean = ctx.validatable.value;
            }

            return ctx;
        });

    });

    it('custom properties', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {c:validatable});
            return context as Context  & {c:{
                    valid : boolean,
                    message : ['message'],
                    value : number
                }};

        })
            .add(ValidatableResponseMessageParameter({properties:['c']}))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.c;

                // message
                {
                    const string : string[] = ctx.c.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.c.message;
                    // @ts-expect-error
                    const number : number = ctx.c.message;
                }

                {
                    const boolean : boolean = ctx.c.valid;
                    // @ts-expect-error
                    const string : string = ctx.c.valid;
                    // @ts-expect-error
                    const number : number = ctx.c.valid;
                }

                {
                    const number : number = ctx.c.value;
                    // @ts-expect-error
                    const string : string = ctx.c.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.c.value;
                }

                return ctx;
            });

    });

    it('custom multi properties', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {a: {b : validatable}});
            return context as Context  & {a:{b:{
                        valid : boolean,
                        message : ['message'],
                        value : number
                    }}};

        })
            .add(ValidatableResponseMessageParameter({properties: ['a','b']}))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.a.b;

                // message
                {
                    const string : string[] = ctx.a.b.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.message;
                    // @ts-expect-error
                    const number : number = ctx.a.b.message;
                }

                {
                    const boolean : boolean = ctx.a.b.valid;
                    // @ts-expect-error
                    const string : string = ctx.a.b.valid;
                    // @ts-expect-error
                    const number : number = ctx.a.b.valid;
                }

                {
                    const number : number = ctx.a.b.value;
                    // @ts-expect-error
                    const string : string = ctx.a.b.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.value;
                }

                return ctx;
            });

    });

    it('custom multi properties, next', ()=>{

        router.add(function (context) {

            const validatable = {
                valid : true,
                message : ['message'],
                value : 1
            };

            Object.assign(context.request, {a: {b : validatable}});
            return context as Context  & {a:{b:{
                        valid : boolean,
                        message : ['message'],
                        value : number
                    }}};

        })
            .add(ValidatableResponseMessageParameter( {properties:['a','b'], next: true}))
            .add(function (ctx) {

                const validatable : {
                    valid : boolean,
                    message : string[],
                    value : number
                } = ctx.a.b;

                // message
                {
                    const string : string[] = ctx.a.b.message;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.message;
                    // @ts-expect-error
                    const number : number = ctx.a.b.message;
                }

                {
                    const boolean : boolean = ctx.a.b.valid;
                    // @ts-expect-error
                    const string : string = ctx.a.b.valid;
                    // @ts-expect-error
                    const number : number = ctx.a.b.valid;
                }

                {
                    const number : number = ctx.a.b.value;
                    // @ts-expect-error
                    const string : string = ctx.a.b.value;
                    // @ts-expect-error
                    const boolean : boolean = ctx.a.b.value;
                }

                return ctx;
            });

    });

});
