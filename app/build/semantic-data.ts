import { join } from 'path';

export type ComponentLocations = { [component: string]: string }

export function prefixLocations(prefix: string, locs: ComponentLocations): ComponentLocations {
    Object.keys(locs).forEach(comp => locs[ comp ] = join(prefix, locs[ comp ]))
    return locs
}

export const nameLocations: ComponentLocations = {
    Confirm             : 'addons/Confirm',
    MountNode           : 'addons/MountNode',
    Pagination          : 'addons/Pagination',
    PaginationItem      : 'addons/Pagination/PaginationItem',
    Portal              : 'addons/Portal',
    Radio               : 'addons/Radio',
    Ref                 : 'addons/Ref',
    Responsive          : 'addons/Responsive',
    Select              : 'addons/Select',
    TextArea            : 'addons/TextArea',
    TransitionablePortal: 'addons/TransitionablePortal',
    Visibility          : 'behaviors/Visibility',
    Breadcrumb          : 'collections/Breadcrumb',
    BreadcrumbDivider   : 'collections/Breadcrumb/BreadcrumbDivider',
    BreadcrumbSection   : 'collections/Breadcrumb/BreadcrumbSection',
    Form                : 'collections/Form',
    FormButton          : 'collections/Form/FormButton',
    FormCheckbox        : 'collections/Form/FormCheckbox',
    FormDropdown        : 'collections/Form/FormDropdown',
    FormField           : 'collections/Form/FormField',
    FormGroup           : 'collections/Form/FormGroup',
    FormInput           : 'collections/Form/FormInput',
    FormRadio           : 'collections/Form/FormRadio',
    FormSelect          : 'collections/Form/FormSelect',
    FormTextArea        : 'collections/Form/FormTextArea',
    Grid                : 'collections/Grid',
    GridColumn          : 'collections/Grid/GridColumn',
    GridRow             : 'collections/Grid/GridRow',
    Menu                : 'collections/Menu',
    MenuHeader          : 'collections/Menu/MenuHeader',
    MenuItem            : 'collections/Menu/MenuItem',
    MenuMenu            : 'collections/Menu/MenuMenu',
    Message             : 'collections/Message',
    MessageContent      : 'collections/Message/MessageContent',
    MessageHeader       : 'collections/Message/MessageHeader',
    MessageItem         : 'collections/Message/MessageItem',
    MessageList         : 'collections/Message/MessageList',
    Table               : 'collections/Table',
    TableBody           : 'collections/Table/TableBody',
    TableCell           : 'collections/Table/TableCell',
    TableFooter         : 'collections/Table/TableFooter',
    TableHeader         : 'collections/Table/TableHeader',
    TableHeaderCell     : 'collections/Table/TableHeaderCell',
    TableRow            : 'collections/Table/TableRow',
    Button              : 'elements/Button/Button',
    ButtonContent       : 'elements/Button/ButtonContent',
    ButtonGroup         : 'elements/Button/ButtonGroup',
    ButtonOr            : 'elements/Button/ButtonOr',
    Container           : 'elements/Container',
    Divider             : 'elements/Divider',
    Flag                : 'elements/Flag',
    Header              : 'elements/Header',
    HeaderContent       : 'elements/Header/HeaderContent',
    HeaderSubheader     : 'elements/Header/HeaderSubheader',
    Icon                : 'elements/Icon',
    IconGroup           : 'elements/Icon/IconGroup',
    Image               : 'elements/Image',
    ImageGroup          : 'elements/Image/ImageGroup',
    Input               : 'elements/Input',
    Label               : 'elements/Label',
    LabelDetail         : 'elements/Label/LabelDetail',
    LabelGroup          : 'elements/Label/LabelGroup',
    List                : 'elements/List',
    ListContent         : 'elements/List/ListContent',
    ListDescription     : 'elements/List/ListDescription',
    ListHeader          : 'elements/List/ListHeader',
    ListIcon            : 'elements/List/ListIcon',
    ListItem            : 'elements/List/ListItem',
    ListList            : 'elements/List/ListList',
    Loader              : 'elements/Loader',
    Rail                : 'elements/Rail',
    Reveal              : 'elements/Reveal',
    RevealContent       : 'elements/Reveal/RevealContent',
    Segment             : 'elements/Segment',
    SegmentGroup        : 'elements/Segment/SegmentGroup',
    Step                : 'elements/Step',
    StepContent         : 'elements/Step/StepContent',
    StepDescription     : 'elements/Step/StepDescription',
    StepGroup           : 'elements/Step/StepGroup',
    StepTitle           : 'elements/Step/StepTitle',
    Accordion           : 'modules/Accordion/Accordion',
    AccordionAccordion  : 'modules/Accordion/AccordionAccordion',
    AccordionContent    : 'modules/Accordion/AccordionContent',
    AccordionTitle      : 'modules/Accordion/AccordionTitle',
    Checkbox            : 'modules/Checkbox',
    Dimmer              : 'modules/Dimmer',
    DimmerDimmable      : 'modules/Dimmer/DimmerDimmable',
    Dropdown            : 'modules/Dropdown',
    DropdownDivider     : 'modules/Dropdown/DropdownDivider',
    DropdownHeader      : 'modules/Dropdown/DropdownHeader',
    DropdownItem        : 'modules/Dropdown/DropdownItem',
    DropdownMenu        : 'modules/Dropdown/DropdownMenu',
    DropdownSearchInput : 'modules/Dropdown/DropdownSearchInput',
    Embed               : 'modules/Embed',
    Modal               : 'modules/Modal',
    ModalActions        : 'modules/Modal/ModalActions',
    ModalContent        : 'modules/Modal/ModalContent',
    ModalDescription    : 'modules/Modal/ModalDescription',
    ModalHeader         : 'modules/Modal/ModalHeader',
    Popup               : 'modules/Popup',
    PopupContent        : 'modules/Popup/PopupContent',
    PopupHeader         : 'modules/Popup/PopupHeader',
    Progress            : 'modules/Progress',
    Rating              : 'modules/Rating',
    RatingIcon          : 'modules/Rating/RatingIcon',
    Search              : 'modules/Search',
    SearchCategory      : 'modules/Search/SearchCategory',
    SearchResult        : 'modules/Search/SearchResult',
    SearchResults       : 'modules/Search/SearchResults',
    Sidebar             : 'modules/Sidebar',
    SidebarPushable     : 'modules/Sidebar/SidebarPushable',
    SidebarPusher       : 'modules/Sidebar/SidebarPusher',
    Sticky              : 'modules/Sticky',
    Tab                 : 'modules/Tab',
    TabPane             : 'modules/Tab/TabPane',
    Transition          : 'modules/Transition',
    TransitionGroup     : 'modules/Transition/TransitionGroup',
    Advertisement       : 'views/Advertisement',
    Card                : 'views/Card/Card',
    CardContent         : 'views/Card/CardContent',
    CardDescription     : 'views/Card/CardDescription',
    CardGroup           : 'views/Card/CardGroup',
    CardHeader          : 'views/Card/CardHeader',
    CardMeta            : 'views/Card/CardMeta',
    Comment             : 'views/Comment',
    CommentAction       : 'views/Comment/CommentAction',
    CommentActions      : 'views/Comment/CommentActions',
    CommentAuthor       : 'views/Comment/CommentAuthor',
    CommentAvatar       : 'views/Comment/CommentAvatar',
    CommentContent      : 'views/Comment/CommentContent',
    CommentGroup        : 'views/Comment/CommentGroup',
    CommentMetadata     : 'views/Comment/CommentMetadata',
    CommentText         : 'views/Comment/CommentText',
    Feed                : 'views/Feed',
    FeedContent         : 'views/Feed/FeedContent',
    FeedDate            : 'views/Feed/FeedDate',
    FeedEvent           : 'views/Feed/FeedEvent',
    FeedExtra           : 'views/Feed/FeedExtra',
    FeedLabel           : 'views/Feed/FeedLabel',
    FeedLike            : 'views/Feed/FeedLike',
    FeedMeta            : 'views/Feed/FeedMeta',
    FeedSummary         : 'views/Feed/FeedSummary',
    FeedUser            : 'views/Feed/FeedUser',
    Item                : 'views/Item',
    ItemContent         : 'views/Item/ItemContent',
    ItemDescription     : 'views/Item/ItemDescription',
    ItemExtra           : 'views/Item/ItemExtra',
    ItemGroup           : 'views/Item/ItemGroup',
    ItemHeader          : 'views/Item/ItemHeader',
    ItemImage           : 'views/Item/ItemImage',
    ItemMeta            : 'views/Item/ItemMeta',
    Statistic           : 'views/Statistic',
    StatisticGroup      : 'views/Statistic/StatisticGroup',
    StatisticLabel      : 'views/Statistic/StatisticLabel',
    StatisticValue      : 'views/Statistic/StatisticValue'
}
export const lessLocations: ComponentLocations = {
    Confirm             : 'addons/confirm.less',
    MountNode           : 'addons/mountnode.less',
    Pagination          : 'addons/pagination.less',
    PaginationItem      : 'addons/pagination.less',
    Portal              : 'addons/portal.less',
    Radio               : 'addons/radio.less',
    Ref                 : 'addons/ref.less',
    Responsive          : 'addons/responsive.less',
    Select              : 'addons/select.less',
    TextArea            : 'addons/textarea.less',
    TransitionablePortal: 'addons/transitionableportal.less',
    Visibility          : 'behaviors/visibility.less',
    Breadcrumb          : 'collections/breadcrumb.less',
    BreadcrumbDivider   : 'collections/breadcrumb.less',
    BreadcrumbSection   : 'collections/breadcrumb.less',
    Form                : 'collections/form.less',
    FormButton          : 'collections/form.less',
    FormCheckbox        : 'collections/form.less',
    FormDropdown        : 'collections/form.less',
    FormField           : 'collections/form.less',
    FormGroup           : 'collections/form.less',
    FormInput           : 'collections/form.less',
    FormRadio           : 'collections/form.less',
    FormSelect          : 'collections/form.less',
    FormTextArea        : 'collections/form.less',
    Grid                : 'collections/grid.less',
    GridColumn          : 'collections/grid.less',
    GridRow             : 'collections/grid.less',
    Menu                : 'collections/menu.less',
    MenuHeader          : 'collections/menu.less',
    MenuItem            : 'collections/menu.less',
    MenuMenu            : 'collections/menu.less',
    Message             : 'collections/message.less',
    MessageContent      : 'collections/message.less',
    MessageHeader       : 'collections/message.less',
    MessageItem         : 'collections/message.less',
    MessageList         : 'collections/message.less',
    Table               : 'collections/table.less',
    TableBody           : 'collections/table.less',
    TableCell           : 'collections/table.less',
    TableFooter         : 'collections/table.less',
    TableHeader         : 'collections/table.less',
    TableHeaderCell     : 'collections/table.less',
    TableRow            : 'collections/table.less',
    Button              : 'elements/button.less',
    ButtonContent       : 'elements/button.less',
    ButtonGroup         : 'elements/button.less',
    ButtonOr            : 'elements/button.less',
    Container           : 'elements/container.less',
    Divider             : 'elements/divider.less',
    Flag                : 'elements/flag.less',
    Header              : 'elements/header.less',
    HeaderContent       : 'elements/header.less',
    HeaderSubheader     : 'elements/header.less',
    Icon                : 'elements/icon.less',
    IconGroup           : 'elements/icon.less',
    Image               : 'elements/image.less',
    ImageGroup          : 'elements/image.less',
    Input               : 'elements/input.less',
    Label               : 'elements/label.less',
    LabelDetail         : 'elements/label.less',
    LabelGroup          : 'elements/label.less',
    List                : 'elements/list.less',
    ListContent         : 'elements/list.less',
    ListDescription     : 'elements/list.less',
    ListHeader          : 'elements/list.less',
    ListIcon            : 'elements/list.less',
    ListItem            : 'elements/list.less',
    ListList            : 'elements/list.less',
    Loader              : 'elements/loader.less',
    Rail                : 'elements/rail.less',
    Reveal              : 'elements/reveal.less',
    RevealContent       : 'elements/reveal.less',
    Segment             : 'elements/segment.less',
    SegmentGroup        : 'elements/segment.less',
    Step                : 'elements/step.less',
    StepContent         : 'elements/step.less',
    StepDescription     : 'elements/step.less',
    StepGroup           : 'elements/step.less',
    StepTitle           : 'elements/step.less',
    Accordion           : 'modules/accordion.less',
    AccordionAccordion  : 'modules/accordion.less',
    AccordionContent    : 'modules/accordion.less',
    AccordionTitle      : 'modules/accordion.less',
    Checkbox            : 'modules/checkbox.less',
    Dimmer              : 'modules/dimmer.less',
    DimmerDimmable      : 'modules/dimmer.less',
    Dropdown            : 'modules/dropdown.less',
    DropdownDivider     : 'modules/dropdown.less',
    DropdownHeader      : 'modules/dropdown.less',
    DropdownItem        : 'modules/dropdown.less',
    DropdownMenu        : 'modules/dropdown.less',
    DropdownSearchInput : 'modules/dropdown.less',
    Embed               : 'modules/embed.less',
    Modal               : 'modules/modal.less',
    ModalActions        : 'modules/modal.less',
    ModalContent        : 'modules/modal.less',
    ModalDescription    : 'modules/modal.less',
    ModalHeader         : 'modules/modal.less',
    Popup               : 'modules/popup.less',
    PopupContent        : 'modules/popup.less',
    PopupHeader         : 'modules/popup.less',
    Progress            : 'modules/progress.less',
    Rating              : 'modules/rating.less',
    RatingIcon          : 'modules/rating.less',
    Search              : 'modules/search.less',
    SearchCategory      : 'modules/search.less',
    SearchResult        : 'modules/search.less',
    SearchResults       : 'modules/search.less',
    Sidebar             : 'modules/sidebar.less',
    SidebarPushable     : 'modules/sidebar.less',
    SidebarPusher       : 'modules/sidebar.less',
    Sticky              : 'modules/sticky.less',
    Tab                 : 'modules/tab.less',
    TabPane             : 'modules/tab.less',
    Transition          : 'modules/transition.less',
    TransitionGroup     : 'modules/transition.less',
    Advertisement       : 'views/advertisement.less',
    Card                : 'views/card.less',
    CardContent         : 'views/card.less',
    CardDescription     : 'views/card.less',
    CardGroup           : 'views/card.less',
    CardHeader          : 'views/card.less',
    CardMeta            : 'views/card.less',
    Comment             : 'views/comment.less',
    CommentAction       : 'views/comment.less',
    CommentActions      : 'views/comment.less',
    CommentAuthor       : 'views/comment.less',
    CommentAvatar       : 'views/comment.less',
    CommentContent      : 'views/comment.less',
    CommentGroup        : 'views/comment.less',
    CommentMetadata     : 'views/comment.less',
    CommentText         : 'views/comment.less',
    Feed                : 'views/feed.less',
    FeedContent         : 'views/feed.less',
    FeedDate            : 'views/feed.less',
    FeedEvent           : 'views/feed.less',
    FeedExtra           : 'views/feed.less',
    FeedLabel           : 'views/feed.less',
    FeedLike            : 'views/feed.less',
    FeedMeta            : 'views/feed.less',
    FeedSummary         : 'views/feed.less',
    FeedUser            : 'views/feed.less',
    Item                : 'views/item.less',
    ItemContent         : 'views/item.less',
    ItemDescription     : 'views/item.less',
    ItemExtra           : 'views/item.less',
    ItemGroup           : 'views/item.less',
    ItemHeader          : 'views/item.less',
    ItemImage           : 'views/item.less',
    ItemMeta            : 'views/item.less',
    Statistic           : 'views/statistic.less',
    StatisticGroup      : 'views/statistic.less',
    StatisticLabel      : 'views/statistic.less',
    StatisticValue      : 'views/statistic.less'
}
