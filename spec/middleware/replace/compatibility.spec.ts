import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Router from '../../../dist/router/middleware';
import Context from '../../../dist/context/context';
import Replace, {ReplaceParameters} from '../../../dist/middleware/replace';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

const server = Server();

let router =  BindToServer(server, Router());

describe('empty', ()=>{

    router
        .next(ReplaceParameters((data: string) : string => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(Replace.Parameters((data: string) => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});

describe('set', ()=>{

    router
        .next(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .next(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(function (context) {

            return Object.assign(context, {data: 'a' as string|number|boolean});

        })
        .next(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});

describe('set diff', ()=>{

    router
        .next(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .next(ReplaceParameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

    router
        .next(function (context) {

            return Object.assign(context, {a: 'a' as string|number|boolean});

        })
        // @ts-expect-error
        .next(Replace.Parameters((data: string|number|boolean) => 'data', ['data']))
        .next(function (ctx) {

            {
                let string: string = ctx.data;
                let data: Context = ctx;
                // @ts-expect-error
                let number: number = ctx.data;
                // @ts-expect-error
                let boolean: boolean = ctx.data;
                // @ts-expect-error
                let object: object = ctx.data;
            }

            {
                let string: Context & { data: string } = ctx;
                let data: Context = ctx;
                // @ts-expect-error
                let number: Context & { data: number } = ctx;
                // @ts-expect-error
                let boolean: Context & { data: boolean } = ctx;
                // @ts-expect-error
                let object: Context & { data: object } = ctx;
            }

            return ctx;
        });

});
