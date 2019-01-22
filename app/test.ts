let routes = [
    {
        name: 'home',
    },
    {
        name    : 'documentation',
        children: [
            {
                name: 'project',
                path: '/:project',
            },
            {
                name         : 'revision',
                path         : '/:project/:revision',
                loadComponent: async () => null,
            },
            {
                name: 'document',
                path: '/:project/:revision/*document',
                children: [
                    {
                        name: 'project',
                        path: '/:project',
                    },
                    {
                        name         : 'revision',
                        path         : '/:project/:revision',
                        loadComponent: async () => null,
                    },
                    {
                        name: 'document',
                        path: '/:project/:revision/*document',

                    },
                ],

            },
        ],
    },
];


function findRoute(name, routes:any[]) {
    let segments = name.split('.');
    let segment  = segments.shift();
    let current;
    let left = routes;
    while ( left.length ) {
        current = left[0];
        left = left.slice(1);
        if(current.name === segment){
            if(segments.length && current.children){
                segment = segments.shift();
                left = current.children;
                continue;
            }
            if(segments.length === 0){
                return current;
            }
        }
    }
}

console.dir(findRoute('documentation.document.revision', routes));

