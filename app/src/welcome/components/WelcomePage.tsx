import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
//@ts-ignore TS2307
import { app, colors, LayoutStore, ScrollSpyHelper, strEnsureLeft, styled } from '@codex/core';
import { observer } from 'mobx-react';
import { Button, Carousel as BaseCarousel, Col, Collapse as BaseCollapse, Icon, Layout, Menu, Row } from 'antd';
import { Section } from './Section';
import Feature from './Feature';
import { WelcomeMenuItem } from './WelcomeMenuItem';
import { kebabCase } from 'lodash';
import { Slider } from './Slider';
import { Slide } from './Slide';
import { observable } from 'mobx';
import { SectionTheme } from './theme';
import { ButtonProps } from 'antd/lib/button/button';
import classNames from 'classnames';
import { important } from 'csx';


const log = require('debug')('views:home');

//region:Typestyled Components
const CarouselContent = styled(Layout.Content)({
    overflow: 'hidden',
    height  : 'calc(100vh - 61px)',
});

const ShowcaseCarousel: typeof BaseCarousel                                              = styled(BaseCarousel)({
    padding   : '10px 10px 20px 10px',
    background: 'black',
    $nest     : {
        '.slick-slide'         : {
            textAlign : 'center',
            height    : '100%',
            maxHeight : '500px',
            lineHeight: '500px',
            width     : '100%',
            overflow  : 'hidden',
        },
        '.slick-dots'          : {
            height   : important('10px'),
            bottom   : important('5px'),
            textAlign: important('left'),
        },
        '.slick-dots li button': {
            height: '10px !important',
        },
    },
});
const ShowcaseSlideContent                                                               = styled.div`
position: absolute;
left: 0;bottom:0;right:0;
height: 50px; 
background: rgba(0,0,0,0.5); 
color: white; 
line-height: 20px; 
padding: 15px; 
text-align: left;
`;
const ShowcaseSlide                                                                      = styled((props: { img: string }) => {
    let { img, ...rest } = props;
    return <div {...rest} style={{ backgroundImage: `url(${img})` }}/>;
})`
position: relative;
background        : rgba(255,255,255,0.2) no-repeat top center;
background-size   : 100%;
height            : 500px;
width             : 100%;
`;
const showcaseArrowSize                                                                  = 20;
const ShowcaseArrow                                                                      = styled.button`
    font-size: ${showcaseArrowSize}px !important;
    line-height: ${showcaseArrowSize}px !important;
    border-radius: ${showcaseArrowSize}px !important;
    height: ${showcaseArrowSize * 2}px !important;
    width: ${showcaseArrowSize * 2}px !important;
    background-color: rgba(0, 0, 0, 0.45) !important;
    color: #ffffff !important;
     z-index: 10;
    &:before { content: none !important;}
    &:hover {
        background-color: rgba(0, 0, 0, 0.25) !important;
        color: #ffffff !important;        
    }
`;
const ShowcaseNextArrow                                                                  = styled(ShowcaseArrow)`
    right: 15px !important;
`;
const ShowcasePrevArrow                                                                  = styled(ShowcaseArrow)`
    left: 15px !important;
`;
const Awesome                                                                            = styled.div`
text-align: center;
h2 { font-size: 3rem; color: ${colors.blueGrey2}; margin: 0 0 5px 0; }`;
const AwesomeDivider                                                                     = styled.div`            
height: 1px; 
width: 200px; 
margin: 10px auto; 
background-color:${colors.blueGrey2}; 
font-family: ${p => p.theme.fontFamilyHeader} }`;
const FeatureRow: typeof Row                                                             = styled(Row as any).attrs({ gutter: 32 })`
@media only screen and (min-width: 600px) {
    margin-top: 50px;
}` as any;
const Collapse                                                                           = styled(BaseCollapse).attrs({})``;
const CollapsePanel                                                                      = styled(BaseCollapse.Panel)`
p {
    margin: 0;
}
` as any;
const CollapseHeader                                                                     = styled.h5`
    color: ${p => p.theme.fg};
    margin: 0;
`;
const Btn: React.ComponentType<{ color: MaterialColorName, path: string } & ButtonProps> = styled<{ color: MaterialColorName, path: string } & ButtonProps>(props => {
    const { color, children, className, style, type, path, ...rest } = props;

    return <Button
        block
        size="large"
        type="default"
        className={classNames('mb-md', 'color', `bg-${color}-5`, `text-${color}-1`)}
        style={{ border: 'none' }}
        onClick={e => app.history.push(path)}
        {...rest}
    >
        {children}
    </Button>;
})`` as any;

//endregion

export interface WelcomePageProps {}

@Hot(module)
@observer
export class WelcomePage extends React.Component<WelcomePageProps, {}> {
    @inject(Symbols.LayoutStore) protected layout: LayoutStore;

    static displayName  = 'WelcomeView';
    static contextTypes = { app: PropTypes.object.isRequired };

    context: { app: App };
    menu: Menu     = null;
    scrollHelper: ScrollSpyHelper;
    slider: Slider = null;
    menuItems      = [ 'Introduction', 'Features', 'Overview', 'Getting Started', 'Documentation' ];

    @observable activeCollapseKey = '1';

    makeCustomMenu(selectedKeys = []) {
        return (
            <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '63px', float: 'right', height: '100%' }}
                selectedKeys={selectedKeys}
                ref={ref => this.menu = ref}
                selectable
            >
                {this.menuItems.map(label => {
                    let id  = kebabCase(label.toLowerCase());
                    let key = 'menuitem-' + id;

                    return <WelcomeMenuItem key={key} id={id} label={label} scrollTarget={strEnsureLeft(id, '#')}/>;
                })}
            </Menu>
        );
    }

    componentDidMount() {
        this.layout.setGutterSize(0);
        this.layout.left.hide();
        this.layout.right.hide();
        this.layout.header.set('style', {
            paddingLeft: '20px',
        });
        this.layout.header.set('showLeftToggle', false);
        this.layout.header.set('showRightToggle', false);
        this.layout.header.set('customMenu', this.makeCustomMenu());
        setTimeout(() => {
            let itemTargets = {};
            this.menuItems
                .map(i => kebabCase(i.toLowerCase()))
                .forEach(id => itemTargets[ `menuitem-${id}` ] = id);

            this.scrollHelper = new ScrollSpyHelper(itemTargets, 63, window);
            this.scrollHelper.onChange((targetID, itemID) => {
                if ( itemID ) {
                    this.layout.header.set('customMenu', this.makeCustomMenu([ itemID ]));
                }
            });
            this.scrollHelper.start();
        }, 1500);
    }

    componentWillUnmount() {
        if ( this.scrollHelper ) {
            this.scrollHelper.stop();
        }
    }

    render() {
        window[ 'page' ] = this;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <CarouselContent id="introduction">
                    <Slider widths={[ 576, 768, 922, 1200, 2000 ]} ref={ref => this.slider = ref}>
                        {size => {
                            //,
                            //                                 <Slide img={`assets/img/slides/slide-doctors-${size}.jpg`}>
                            //                                     <Slide.Content position="bottom-left" height='auto'>
                            //                                         <p>Seamless integration of PHPDoc, Github/Bitbucket and more!</p>
                            //                                     </Slide.Content>
                            //                                 </Slide>,
                            //                                 <Slide img={`assets/img/slides/slide-feet-${size}.jpg`}>
                            //                                     <Slide.Content position="bottom-left" height='auto'>
                            //                                         <p>Seamless integration of PHPDoc, Github/Bitbucket and more!</p>
                            //                                     </Slide.Content>
                            //                                 </Slide>,
                            //                                 <Slide img={`assets/img/slides/slide-first-aid-${size}.jpg`}>
                            //                                     <Slide.Content position="bottom-left" height='auto'>
                            //                                         <p>Seamless integration of PHPDoc, Github/Bitbucket and more!</p>
                            //                                     </Slide.Content>
                            //                                 </Slide>,
                            //                                 <Slide img={`assets/img/slides/slide-technology-${size}.jpg`}>
                            //                                     <Slide.Content position="bottom-left" height='auto'>
                            //                                         <p>Seamless integration of PHPDoc, Github/Bitbucket and more!</p>
                            //                                     </Slide.Content>
                            //                                 </Slide>
                            return [
                                <Slide img={`assets/img/slides/slide-typewriter-${size}.jpg`}>
                                    <Slide.Content position="bottom-center" height="auto">
                                        <p>Completely customizable and dead simple to use to create beautiful documentation.</p>
                                    </Slide.Content>
                                </Slide>,
                                <Slide img={`assets/img/slides/slide-html-${size}.png`}>
                                    <Slide.Content position="bottom-left" height='auto'>
                                        <p>Seamless integration of PHPDoc, Github/Bitbucket and more!</p>
                                    </Slide.Content>
                                </Slide>,
                                <Slide img={`assets/img/slides/slide-contract-${size}.jpg`}>
                                    <Slide.Content position="bottom-left" height='auto'>
                                        <p>Authentication</p>
                                    </Slide.Content>
                                </Slide>,
                            ];
                        }}
                    </Slider>
                </CarouselContent>
                <Section theme="dark">
                    <Fade delay={500}>
                        <Awesome>
                            <h2>Open Source</h2>
                            <p>Codex is available on <a href='#'>GitHub</a> under the <a href='#'>MIT license</a></p>
                            <AwesomeDivider/>
                        </Awesome>
                    </Fade>
                </Section>
                <Section title="Features" theme="light">
                    <FeatureRow>
                        <Feature img="assets/img/features/plugins.png" title="Plugins">
                            Using a plugin based approach, Codex can easily be extended. Check out <a>existing plugins</a> or <a>create something custom</a>
                        </Feature>
                        <Feature img="assets/img/features/laravel.svg" title="Laravel" delay={150}>
                            Codex is a file-based documentation platform built on top of Laravel 5.5. Use it as stand-alone or integrate it into your own application!
                        </Feature>
                        <Feature img="assets/img/features/responsive.png" title="Responsive" delay={300}>
                            Documentation should be readable on all devices. Reading documents in Codex on a mobile phone or tablet device is actually enjoyable.
                        </Feature>
                    </FeatureRow>
                    <FeatureRow>
                        <Feature img="assets/img/features/flexible.png" title="Flexible" delay={750}>
                            Use Markdown, AsciiDoc, Creole or any other lightweight markup language. Use custom parsers to add support for other LML's.
                        </Feature>
                        <Feature img="assets/img/features/react.svg" title="React" delay={600}>
                            The front-end uses the React framework to deliver a Single Page Application with a smooth experience
                        </Feature>
                        <Feature img="assets/img/features/antd.svg" title="Ant Design" delay={450}>
                            The Antd UI frameworks provides a handfull of amazing components that ...
                        </Feature>
                    </FeatureRow>
                </Section>
                <Section title="Overview" theme="dark">
                    <FeatureRow type="flex" justify="space-around" gutter={12}>
                        <Feature
                            col={{ xs: 20, lg: 8 }}
                            content={
                                <Fragment>
                                    <Feature.Heading>Create Beautiful <span className="text-muted">Documentation</span></Feature.Heading>
                                    <p>Documentation is incredibly important that can make or break even the best development projects. Codex is completely customizable and dead simple to use to create beautiful documentation.</p>
                                    <p>&nbsp;</p>
                                    <SectionTheme theme="light">
                                        <Collapse
                                            bordered={true}
                                            accordion={true}
                                            defaultActiveKey={[ '1' ]}
                                        >
                                            <CollapsePanel key='1' header={<CollapseHeader>Multi Project / Multi Version</CollapseHeader>}>
                                                <p>
                                                    Codex offers you a multi-project documentation system. Each project can contain multiple versions
                                                    making it possible to host your documentation for older versions of your application as well.
                                                </p>
                                            </CollapsePanel>
                                            <CollapsePanel key='2' header={<CollapseHeader>Flexible inherited configuration</CollapseHeader>}>
                                                <p>
                                                    The flexible inherited configuration system allows you to, for example, define system-wide layout configuration,
                                                    override some of it for a project, append some for a revision and override it again for a specific document.
                                                </p>
                                            </CollapsePanel>
                                            <CollapsePanel key='3' header={<CollapseHeader>HTTP API</CollapseHeader>}>
                                                <p>
                                                    You can enable the Codex HTTP API that uses GraphQL.
                                                    GraphQL puts a lot of control onto the client, allowing it to make queries that specify the fields it wants to see and as well as the relations it wants.
                                                    This reduces requests to the server dramatically.
                                                </p>
                                            </CollapsePanel>
                                        </Collapse>
                                    </SectionTheme>
                                </Fragment>
                            }/>
                        <Feature
                            col={{ xs: 20, lg: 14 }}
                            content={
                                <Fragment>
                                    <Feature.Heading>Showcase</Feature.Heading>
                                    <ShowcaseCarousel
                                        autoplay={true}
                                        infinite={true}
                                        dots={true}
                                        arrows={true}
                                        swipe={true}
                                        autoplaySpeed={7000}
                                        speed={500}
                                        fade={true}
                                        lazyLoad={true}
                                        centerMode={true}
                                        centerPadding={0}
                                        draggable={true}
                                        pauseOnHover={true}
                                        nextArrow={<ShowcaseNextArrow><Icon type="step-forward"/></ShowcaseNextArrow>}
                                        prevArrow={<ShowcasePrevArrow><Icon type="step-backward"/></ShowcasePrevArrow>}
                                    >
                                        <ShowcaseSlide img="assets/img/ss-codex-document.png"><ShowcaseSlideContent>A markdown document</ShowcaseSlideContent></ShowcaseSlide>
                                        <ShowcaseSlide img="assets/img/ss-code-highlight.png"><ShowcaseSlideContent>Code highlighting code blocks</ShowcaseSlideContent></ShowcaseSlide>
                                        <ShowcaseSlide img="assets/img/ss-codex-index.png"><ShowcaseSlideContent>Good stucc</ShowcaseSlideContent></ShowcaseSlide>
                                        <ShowcaseSlide img="assets/img/ss-codex-phpdoc.png"><ShowcaseSlideContent>PHPDoc integration</ShowcaseSlideContent></ShowcaseSlide>
                                    </ShowcaseCarousel>
                                </Fragment>
                            }/>
                    </FeatureRow>
                </Section>
                <Section title="Getting Started" theme="light">
                    <Row type="flex" justify="center" gutter={32} style={{ padding: '0 32px' }}>
                        <Col xs={24} lg={18}>
                            <h3>Composer</h3>
                            <p>Installation using composer</p>

                            <h4>Stable Release</h4>
                            <p> This is the preferred release if you're looking to use Codex for your documentation needs.</p>
                            <pre className="language-bash"><code>
                            composer create-project codex/codex [directory] --stability=stable
                            </code></pre>
                            <h4>Dev Release</h4>
                            <p>
                                As this is an open source project, you are free to download the development branch as well.
                                Just note that while this is the bleeding edge in terms of features and functionality, it comes at the price that things may be broken.
                            </p>
                            <pre className="language-bash"><code>
                            composer create-project codex/codex [directory] --stability=dev
                            </code></pre>
                            <h4>Integrate Codex</h4>
                            <p>Codex is divided in multiple packages that can be integrated into any Laravel (5.5+) application!</p>
                            <pre className="language-bash"><code>
                            composer require codex/core
                            </code></pre>
                        </Col>
                        <Col xs={24} lg={6}>
                            <h3>Download</h3>
                            <Btn color="green" path='/documentation/codex/master'>Latest Stable Release</Btn>
                            <Btn color="orange" path='/documentation/codex/develop'>Latest Dev Release</Btn>
                            <Btn color="light-blue" path='/documentation/codex/v1'>Legacy (v1.*)</Btn>
                        </Col>
                    </Row>
                </Section>
                <Section title="Documentation" theme="dark">
                    <Row type="flex" justify="center" gutter={32} style={{ padding: '0 32px' }}>
                        <Col xs={24} lg={8}><Btn color="green" path='/documentation/codex/master'>Latest Stable Release</Btn></Col>
                        <Col xs={24} lg={8}><Btn color="orange" path='/documentation/codex/develop'>Latest Dev Release</Btn></Col>
                        <Col xs={24} lg={8}><Btn color="light-blue" path='/documentation/codex/v1'>Legacy (v1.*)</Btn></Col>
                    </Row>
                </Section>
            </Layout>
        );
    }
}
