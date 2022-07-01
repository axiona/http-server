import BracesParser from '../../../dist/object/affix-parser';

it('force console log', () => { spyOn(console, 'log').and.callThrough();});


describe('single', function () {

    it('single', function () {

        const result = BracesParser()('root', 'data');
        expect(result).toEqual({ root: 'data' });
    });

});

describe('multi', function () {

    it('object', function () {

        const result = BracesParser()('root[parent][child]', 'data');
        expect(result).toEqual({ root: { parent: { child: 'data' } } });

    });

    it('object with array', function () {

        const result = BracesParser()('root[parent][child][]', 'data');
        expect(result).toEqual({ root: { parent: { child: ['data'] } } });

    });

    it('object with array in middle', function () {

        const result = BracesParser()('root[parent][][child]', 'data');
        expect(result).toEqual({ root: { parent: [{ child: 'data' }] } });

    });

});


describe('invalid', function () {

    it('invalid 1', function () {

        const result = BracesParser()('root[par[ent][child]', 'data');
        expect(result).toEqual({ root : { par: { ent: { child: 'data' } } } });
    });

    it('invalid 2', function () {

        const result = BracesParser()('root[parent][chi]ld]', 'data');
        expect(result).toEqual({ root : { parent: { chi: { ld: 'data' } } } });
    });

});
