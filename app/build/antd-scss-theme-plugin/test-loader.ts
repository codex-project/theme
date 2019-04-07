import { loader } from 'webpack';
import { RawSourceMap } from 'source-map';

const testLoader: loader.Loader = function (this: loader.LoaderContext, source: string | Buffer, sourceMap?: RawSourceMap): string | Buffer | void | undefined {

    let {resourcePath,rootContext,context} = this
    let a = {resourcePath,rootContext,context}
    return source;
} as loader.Loader;

export default testLoader
