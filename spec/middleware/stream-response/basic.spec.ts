import Router from '../../../dist/router/middleware';
import Server from '../../server';
import BindToServer from '../../../dist/router/append-server';
import Axios, {AxiosResponse} from 'axios';
import {MethodPathParameter} from "../../../dist/middleware/method-path";
import FileBuffer from "../../../dist/middleware/stream-response";
import * as Fs from "fs";

it('force console log', () => { spyOn(console, 'log').and.callThrough();});

describe('single', () => {

    let response : AxiosResponse<string>;

    const server = Server();

    beforeAll(()=>server.open());
    afterAll(()=>server.close());

    let router =  BindToServer(server, Router());


    it('add request', ()=>{

        router
            .add(MethodPathParameter({method:'POST', path:'/path/child'}))
            .add(FileBuffer((ctx)=>Fs.createReadStream(__dirname + '/../../file-source/jpg.jpg')));

    });


    it('send request', function (done) {

        Axios.post(`http://localhost:${server.config.port}/path/child`).then((res)=>{

            response = res;

        }).catch(fail).finally(done);
    });

    it('assert value', function () {

        // Fs.writeFileSync(__dirname + '/../../file-source/jpg2.jpg', response.data);
        expect(response.headers['content-type']).toBe('image/jpeg');
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
        expect(response.data).toEqual(Fs.readFileSync(__dirname + '/../../file-source/jpg.jpg').toString());
    });

});
