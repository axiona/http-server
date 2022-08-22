import Router from '../router';

/**
 * get all router parents
 * ordered from root to the nearest parent
 *
 * @param router
 * @constructor
 */
export default function Parents(router : Router) : Router[] {

    const routers : Router[] = [];

    while (router.parent) {

        routers.unshift(router.parent);

        router = router.parent;
    }

    return routers;

}