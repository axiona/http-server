import Middleware from "./middleware";
import Router from "../router/router";
import Root from "../router/root";



export default function Extends(router: Router) : Middleware {

    return Root(router);
}