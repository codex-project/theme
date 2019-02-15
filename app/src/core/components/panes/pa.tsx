
const pa = {
    id      : 'panes',
    split   : 'horizontal',
    children: [
        { id: 'pane1', component: <div>asdf</div> },
        { id: 'pane2', split: 'vertical', children: [
                { id: 'pane1', component: <div>asdf</div> },
                { id: 'pane2', component: <div>asdf</div> },
            ] },
        { id: 'pane3', component: <div>asdf</div> },
    ],
};
