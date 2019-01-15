import React, { CSSProperties } from 'react';
import { findDOMNode } from 'react-dom';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { hot } from 'decorators';
import { Prism as PrismInstance } from 'interfaces';
import { defer, Deferred, resolve } from 'utils/promise';
import { getPrism } from 'utils/get-prism';
import scrollTo from 'utils/scrollTo';
import { classes } from 'typestyle';

declare const Prism:PrismInstance
const log = require('debug')('components:CodeHighlight');

export interface CodeHighlightProps {
    /** Optional CSSProperties with nesting support (using typestyle) */
    style?: React.CSSProperties
    /** Optional className */
    className?: string;

    language?: string
    minLines?: number
    code?: string
    preClassName?: string
    codeClassName?: string
    preStyle?: CSSProperties
    codeStyle?: CSSProperties
    withLoader?: boolean
    withCommandLine?: boolean
    withLineNumbers?: boolean

    getInstance?: () => any
}

/**
 * CodeHighlight component
 */
@hot(module)
@observer
export class CodeHighlight extends React.Component<CodeHighlightProps> {
    $pre: HTMLPreElement = null;
    $code: HTMLElement   = null;

    static displayName: string                       = 'CodeHighlight';
    static defaultProps: Partial<CodeHighlightProps> = {
        code       : '',
        language   : 'php',
        minLines   : 3,
        getInstance: () => null,
    };

    @observable code: string;
    @observable showCode: boolean            = false;
    @observable showLoader: boolean          = false;
    @observable prism: Promise<PrismInstance>        = null;
    @observable highlighted: Deferred<PrismInstance> = null;
    @observable isHighlighted                = false;

    /**
     * If with-loader property is true, this will toggle the loader on / off
     * @api
     */
    @action toggleLoader() { this.showLoader = ! this.showLoader; }

    @action setCode(code: string) { this.code = code; }

    componentDidMount() {
        this.highlighted = defer();
        this.setCode(this.props.code);
        this.highlighted.then(async(prism) => {
            this.isHighlighted = true;
            return prism;
        });
        this.prism = getPrism();
        this.highlight();
    }

    componentDidUpdate(prevProps: Readonly<CodeHighlightProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if ( this.props.code !== prevProps.code ) {
            this.setCode(this.props.code);
            this.highlight();
        }
    }

    /**
     * Syntax Highlight the code
     * @api
     * @returns {Promise<Prism>}
     */
    highlight() {
        return this.prism.then(async prism => {
            // this.$code.textContent = prism.plugins.NormalizeWhitespace.normalize(this.props.code);
            this.setCode(Prism.plugins.NormalizeWhitespace.normalize(this.code));
            if ( this.$code ) {
                Prism.highlightElement(this.$code, false);
            }
            return this.highlighted.resolve(Prism)
        })
    }

    get lineElements(): HTMLSpanElement[] { return $('.line-numbers-rows > span', findDOMNode(this)) as any;}

    get lineCount(): number { return this.lineElements.length; }

    /**
     * Highlights the given line
     * @api
     * @param {number} line
     * @returns {Promise<Prism>}
     */
    highlightLine(line: number) {
        return this.getLine(line).then($span => {
            let classes = $($span);
            classes.addClass('highlight');
            $span.style.width = this.$pre.offsetWidth + 'px';
            log('highlightSourceLine', { line, $span });
        });
    }

    /**
     * Highlight the given lines
     * @param {number[]} lines
     * @api
     */
    highlightLines(lines: number[]) {
        lines.forEach(line => {
            this.highlightLine(line);
        });
    }

    /**
     * Removes all highlights
     * @api
     */
    removeLineHighlights() {
        $('.highlight').forEach(el => {
            $(el).removeClass('highlight');
            el.removeAttribute('style');
        });
    }

    /**
     * Scrolls to the given line
     * @api
     * @param {number} line
     * @returns {Promise<Prism>}
     */
    scrollToLine(line: number) {
        return this.getLine(line - 2).then($span => {
            scrollTo($span);
        });
    }

    getLine(line: number): Promise<HTMLSpanElement> {
        if ( this.isHighlighted ) {
            return resolve(this.lineElements[ line - 1 ]);
        }
        return this.highlighted.then(() => {
            return resolve(this.lineElements[ line - 1 ]);
        });
    }

    render() {
        const { language, withCommandLine, withLineNumbers, minLines, code } = this.props;

        return (
            <div className={classes('c-code-highlight', this.props.className)} style={this.props.style}>
                {this.showLoader ? this.renderLoader() : this.renderCode(this.code)}
            </div>
        );
    }

    renderLoader() {
        return (
            <div></div>
        );
    }

    renderCode(code: string) {
        const { language, withCommandLine, withLineNumbers, minLines, preStyle, codeStyle } = this.props;
        let lang                                                                            = language.replace(/^sh$/, 'bash');
        let useCommandLine                                                                  = lang === 'bash' && withCommandLine;
        let useLineNumbers                                                                  = withLineNumbers && ! useCommandLine && code && code.length >= minLines;

        // <pre> class
        let preClass: string | string[] = [ 'language-' + lang ];
        if ( useCommandLine ) {
            preClass.push('command-line');
        }
        if ( useLineNumbers ) {
            preClass.push('line-numbers');
        }
        if ( this.props.preClassName ) {
            preClass.push(this.props.preClassName);
        }
        preClass = preClass.join(' ');

        // <code> class
        let codeClass: string | string[] = [ 'language-' + lang ];
        if ( this.props.codeClassName ) {
            codeClass.push(this.props.codeClassName);
        }
        codeClass = codeClass.join(' ');


        return (
            <pre
                ref={ref => this.$pre = ref}
                className={preClass}
                style={preStyle || {}}
            >
                <code
                    ref={ref => this.$code = ref}
                    className={codeClass}
                    style={codeStyle || {}}
                >
                    {code}
                </code>
            </pre>
        );
    }


}
