export type Maybe<T> = T | null;

export interface QueryConstraints {
    where?: Maybe<WhereConstraint[]>;

    orderBy?: Maybe<OrderByConstraint[]>;
}

export interface WhereConstraint {
    column: string;

    operator?: Maybe<Operator>;

    value: Mixed;

    boolean?: Maybe<LogicalOperator>;
}

export interface OrderByConstraint {
    column: string;

    order: Order;
}

export enum Operator {
    Equals = "EQUALS",
    EqualsStrict = "EQUALS_STRICT",
    NotEquals = "NOT_EQUALS",
    NotEqualsStrict = "NOT_EQUALS_STRICT",
    GreaterThan = "GREATER_THAN",
    GreaterThanOrEqual = "GREATER_THAN_OR_EQUAL",
    LessThan = "LESS_THAN",
    LessThanOrEqual = "LESS_THAN_OR_EQUAL"
}

export enum LogicalOperator {
    And = "AND",
    Or = "OR"
}

export enum Order {
    Asc = "ASC",
    Desc = "DESC"
}

export type Mixed = any;

export type Assoc = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
    me?: Maybe<User>;

    codex: Codex;

    config: Config;

    projects: Project[];

    project: Project;

    revisions: Revision[];

    revision: Revision;

    documents: Document[];

    document: Document;

    diff: Diff;

    phpdoc?: Maybe<PhpdocQuery>;
}

export interface User {
    id: string;
}

export interface Codex {
    projects: Project[];

    project: Project;

    revisions: Revision[];

    revision: Revision;

    documents: Document[];

    document: Document;

    diff: Diff;

    display_name?: Maybe<string>;

    description?: Maybe<string>;

    default_project?: Maybe<string>;

    urls?: Maybe<CodexUrls>;

    http?: Maybe<HttpConfig>;

    layout?: Maybe<Layout>;
}

export interface Project {
    revisions: Revision[];

    revision: Revision;

    changed?: Maybe<(Maybe<string>)[]>;

    changes?: Maybe<Assoc>;

    key: string;

    display_name?: Maybe<string>;

    description?: Maybe<string>;

    disk?: Maybe<string>;

    view?: Maybe<string>;

    cache?: Maybe<Cache>;

    meta?: Maybe<Meta>;

    default_revision?: Maybe<string>;

    allow_revision_php_config?: Maybe<string>;

    allowed_revision_config_files?: Maybe<Assoc>;

    default_document?: Maybe<string>;

    document_extensions?: Maybe<Assoc>;

    branching?: Maybe<BranchingConfig>;

    git?: Maybe<GitConfig>;

    phpdoc?: Maybe<PhpdocConfig>;

    layout?: Maybe<Layout>;
}

export interface Revision {
    documents: Document[];

    document: Document;

    project: Project;

    changed?: Maybe<(Maybe<string>)[]>;

    changes?: Maybe<Assoc>;

    key: string;

    meta?: Maybe<Meta>;

    layout?: Maybe<Layout>;

    view?: Maybe<string>;

    cache?: Maybe<Cache>;

    default_document?: Maybe<string>;

    document_extensions?: Maybe<Assoc>;

    phpdoc?: Maybe<PhpdocConfig>;
}

export interface Document {
    revision: Revision;

    changed?: Maybe<(Maybe<string>)[]>;

    changes?: Maybe<Assoc>;

    key: string;

    path?: Maybe<string>;

    extension?: Maybe<string>;

    content?: Maybe<string>;

    last_modified?: Maybe<number>;

    title?: Maybe<string>;

    subtitle?: Maybe<string>;

    description?: Maybe<string>;

    meta?: Maybe<Meta>;

    layout?: Maybe<Layout>;

    view?: Maybe<string>;

    cache?: Maybe<Cache>;
}

export interface Meta {
    icon?: Maybe<string>;

    color?: Maybe<string>;

    license?: Maybe<string>;

    stylesheets?: Maybe<Assoc>;

    javascripts?: Maybe<Assoc>;

    styles?: Maybe<Assoc>;

    scripts?: Maybe<Assoc>;
}

export interface Layout {
    container?: Maybe<LayoutContainer>;

    header?: Maybe<LayoutHeader>;

    footer?: Maybe<LayoutFooter>;

    left?: Maybe<LayoutLeft>;

    right?: Maybe<LayoutRight>;

    middle?: Maybe<LayoutMiddle>;

    content?: Maybe<LayoutContent>;
}

export interface LayoutContainer {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    stretch?: Maybe<boolean>;
}

export interface LayoutHeader {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    show?: Maybe<boolean>;

    fixed?: Maybe<boolean>;

    height?: Maybe<number>;

    menu?: Maybe<(Maybe<MenuItem>)[]>;

    show_left_toggle?: Maybe<boolean>;

    show_right_toggle?: Maybe<boolean>;
}

export interface MenuItem {
    id?: Maybe<string>;

    type?: Maybe<string>;

    side?: Maybe<string>;

    target?: Maybe<string>;

    href?: Maybe<string>;

    path?: Maybe<string>;

    renderer?: Maybe<string>;

    expand?: Maybe<boolean>;

    selected?: Maybe<boolean>;

    label?: Maybe<string>;

    sublabel?: Maybe<string>;

    icon?: Maybe<string>;

    color?: Maybe<string>;

    project?: Maybe<string>;

    revision?: Maybe<string>;

    document?: Maybe<string>;

    projects?: Maybe<boolean>;

    revisions?: Maybe<boolean>;

    children?: Maybe<(Maybe<MenuItem>)[]>;
}

export interface LayoutFooter {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    show?: Maybe<boolean>;

    fixed?: Maybe<boolean>;

    height?: Maybe<number>;

    menu?: Maybe<(Maybe<MenuItem>)[]>;
}

export interface LayoutLeft {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    show?: Maybe<boolean>;

    collapsed?: Maybe<boolean>;

    outside?: Maybe<boolean>;

    width?: Maybe<number>;

    collapsedWidth?: Maybe<number>;

    menu?: Maybe<(Maybe<MenuItem>)[]>;
}

export interface LayoutRight {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    show?: Maybe<boolean>;

    collapsed?: Maybe<boolean>;

    outside?: Maybe<boolean>;

    width?: Maybe<number>;

    collapsedWidth?: Maybe<number>;

    menu?: Maybe<(Maybe<MenuItem>)[]>;
}

export interface LayoutMiddle {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    padding?: Maybe<Mixed>;

    margin?: Maybe<Mixed>;
}

export interface LayoutContent {
    class?: Maybe<Assoc>;

    style?: Maybe<Assoc>;

    color?: Maybe<string>;

    padding?: Maybe<Mixed>;

    margin?: Maybe<Mixed>;
}

export interface Cache {
    mode?: Maybe<string>;

    minutes?: Maybe<number>;
}

export interface PhpdocConfig {
    enabled?: Maybe<boolean>;

    document_slug?: Maybe<string>;

    title?: Maybe<string>;

    xml_path?: Maybe<string>;

    doc_path?: Maybe<string>;

    doc_disabled_processors?: Maybe<Assoc>;

    view?: Maybe<string>;

    layout?: Maybe<Layout>;

    default_class?: Maybe<string>;
}

export interface BranchingConfig {
    production?: Maybe<string>;

    development?: Maybe<string>;
}

export interface GitConfig {
    enabled?: Maybe<boolean>;

    owner?: Maybe<string>;

    repository?: Maybe<string>;

    connection?: Maybe<string>;

    branches?: Maybe<Assoc>;

    versions?: Maybe<string>;

    skip?: Maybe<Assoc>;

    paths?: Maybe<Assoc>;

    webhook?: Maybe<Assoc>;
}

export interface Diff {
    attributes?: Maybe<Assoc>;
}

export interface CodexUrls {
    api?: Maybe<string>;

    root?: Maybe<string>;

    documentation?: Maybe<string>;
}

export interface HttpConfig {
    prefix?: Maybe<string>;

    api_prefix?: Maybe<string>;

    documentation_prefix?: Maybe<string>;

    documentation_view?: Maybe<string>;
}

export interface Config {
    name: string;

    env: string;

    debug: boolean;

    timezone: string;

    locale: string;

    fallback_locale: string;

    url: string;
}

export interface PhpdocQuery {
    title?: Maybe<string>;

    version?: Maybe<string>;

    file?: Maybe<PhpdocFile>;
}

export interface PhpdocFile {
    path?: Maybe<string>;

    generatedPath?: Maybe<string>;

    hash?: Maybe<string>;

    package?: Maybe<string>;

    namespaceAlias?: Maybe<(Maybe<PhpdocNamespaceAlias>)[]>;

    class?: Maybe<PhpdocClassFile>;

    interface?: Maybe<PhpdocInterfaceFile>;

    trait?: Maybe<PhpdocTraitFile>;

    source?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;
}

export interface PhpdocNamespaceAlias {
    name?: Maybe<string>;

    value?: Maybe<string>;
}

export interface PhpdocClassFile {
    implements?: Maybe<(Maybe<Assoc>)[]>;

    namespace?: Maybe<string>;

    package?: Maybe<string>;

    name?: Maybe<string>;

    fullName?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;

    line?: Maybe<number>;

    extends?: Maybe<string>;

    properties?: Maybe<(Maybe<PhpdocProperty>)[]>;

    methods?: Maybe<(Maybe<PhpdocMethod>)[]>;
}

export interface PhpdocDocblock {
    line?: Maybe<number>;

    description?: Maybe<string>;

    longDescription?: Maybe<string>;

    tags?: Maybe<(Maybe<PhpdocTag>)[]>;
}

export interface PhpdocTag {
    name?: Maybe<string>;

    line?: Maybe<number>;

    description?: Maybe<string>;

    link?: Maybe<string>;

    refers?: Maybe<string>;

    type?: Maybe<string>;

    variable?: Maybe<string>;
}

export interface PhpdocProperty {
    namespace?: Maybe<string>;

    package?: Maybe<string>;

    name?: Maybe<string>;

    fullName?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;

    line?: Maybe<number>;

    visibility?: Maybe<string>;

    static?: Maybe<boolean>;
}

export interface PhpdocMethod {
    arguments?: Maybe<(Maybe<PhpdocArgument>)[]>;

    namespace?: Maybe<string>;

    package?: Maybe<string>;

    name?: Maybe<string>;

    fullName?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;

    line?: Maybe<number>;

    final?: Maybe<boolean>;

    abstract?: Maybe<boolean>;

    visibility?: Maybe<string>;

    inheritedFrom?: Maybe<string>;

    static?: Maybe<boolean>;
}

export interface PhpdocArgument {
    name?: Maybe<string>;

    default?: Maybe<string>;

    type?: Maybe<string>;
}

export interface PhpdocInterfaceFile {
    namespace?: Maybe<string>;

    package?: Maybe<string>;

    name?: Maybe<string>;

    fullName?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;

    line?: Maybe<number>;

    extends?: Maybe<string>;

    properties?: Maybe<(Maybe<PhpdocProperty>)[]>;

    methods?: Maybe<(Maybe<PhpdocMethod>)[]>;
}

export interface PhpdocTraitFile {
    namespace?: Maybe<string>;

    package?: Maybe<string>;

    name?: Maybe<string>;

    fullName?: Maybe<string>;

    docblock?: Maybe<PhpdocDocblock>;

    line?: Maybe<number>;

    extends?: Maybe<string>;

    properties?: Maybe<(Maybe<PhpdocProperty>)[]>;

    methods?: Maybe<(Maybe<PhpdocMethod>)[]>;
}

export interface PageInfo {
    /** When paginating forwards, are there more items? */
    hasNextPage: boolean;
    /** When paginating backwards, are there more items? */
    hasPreviousPage: boolean;
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<string>;
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<string>;
    /** Total number of node in connection. */
    total?: Maybe<number>;
    /** Count of nodes in current request. */
    count?: Maybe<number>;
    /** Current page of request. */
    currentPage?: Maybe<number>;
    /** Last page in connection. */
    lastPage?: Maybe<number>;
}

export interface PaginatorInfo {
    /** Total count of available items in the page. */
    count: number;
    /** Current pagination page. */
    currentPage: number;
    /** Index of first item in the current page. */
    firstItem?: Maybe<number>;
    /** If collection has more pages. */
    hasMorePages: boolean;
    /** Index of last item in the current page. */
    lastItem?: Maybe<number>;
    /** Last page number of the collection. */
    lastPage: number;
    /** Number of items per page in the collection. */
    perPage: number;
    /** Total items available in the collection. */
    total: number;
}

export interface PhpdocStructure {
    title?: Maybe<string>;

    version?: Maybe<string>;

    files?: Maybe<(Maybe<PhpdocFile>)[]>;
}

// ====================================================
// Arguments
// ====================================================

export interface ProjectsQueryArgs {
    query?: Maybe<QueryConstraints>;
}
export interface ProjectQueryArgs {
    key?: Maybe<string>;
}
export interface RevisionsQueryArgs {
    projectKey?: Maybe<string>;

    query?: Maybe<QueryConstraints>;
}
export interface RevisionQueryArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;
}
export interface DocumentsQueryArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;

    query?: Maybe<QueryConstraints>;
}
export interface DocumentQueryArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;

    documentKey?: Maybe<string>;
}
export interface DiffQueryArgs {
    left?: Maybe<string>;

    right?: Maybe<string>;
}
export interface PhpdocQueryArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;
}
export interface ProjectsCodexArgs {
    query?: Maybe<QueryConstraints>;
}
export interface ProjectCodexArgs {
    key?: Maybe<string>;
}
export interface RevisionsCodexArgs {
    projectKey?: Maybe<string>;

    query?: Maybe<QueryConstraints>;
}
export interface RevisionCodexArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;
}
export interface DocumentsCodexArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;

    query?: Maybe<QueryConstraints>;
}
export interface DocumentCodexArgs {
    projectKey?: Maybe<string>;

    revisionKey?: Maybe<string>;

    documentKey?: Maybe<string>;
}
export interface DiffCodexArgs {
    left?: Maybe<string>;

    right?: Maybe<string>;
}
export interface RevisionsProjectArgs {
    query?: Maybe<QueryConstraints>;
}
export interface RevisionProjectArgs {
    revisionKey: string;
}
export interface DocumentsRevisionArgs {
    query?: Maybe<QueryConstraints>;
}
export interface DocumentRevisionArgs {
    documentKey: string;
}
export interface FilePhpdocQueryArgs {
    hash?: Maybe<string>;

    fullName?: Maybe<string>;
}
