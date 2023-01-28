import Router from "../../../dist/router/middleware";
import Context from "../../../dist/context/context";
import Middleware from "../../../dist/middleware/middleware";


it('force console log', () => { spyOn(console, 'log').and.callThrough();});


function Type <Ctx extends Context>() : Middleware<Ctx, Ctx & {request:{body:{data:string}}}>  {

    return function (ctx: Ctx) {

        Object.assign(ctx.request, {body : {data: 'a'}});
        return ctx as Ctx & {request:{body:{data:string}}};

    } ;
}

describe('basic', function () {

    Router()
        .next(Type())
        .catch(function (context, error) {

            let string: string = context.request.body.data;

        })
        .next(function (context) {

            return context;

        })
        .next(function (context) {

            let string: string = context.request.body.data;
            return context;
        });


});