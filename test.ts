import * as less from 'less';
import * as fs from 'fs';
import * as path from 'path';

class VariablesOutputVisitor {
    isPreEvalVisitor
    _less
    _visitor
    constructor(less) {
        this.isPreEvalVisitor = true;
        this._less = less;
        this._visitor = new less.visitors.Visitor(this);
    }

    run(root, imp) {
        const variables = root.variables();

        // // Generate a dummy selector we can output the variables as rule names
        // const rules = generateRulesFromVariables(Object.keys(variables));
        // const rule = generateSelector(SELECTOR, rules.join('\n'));
        //
        // // Parse the new selector into an AST...
        // this._less.parse(rule, { filename: SELECTOR }, (err, mixinRoot, imports) => {
        //     const rule = mixinRoot.rules[0];
        //
        //     root.rules.push(rule);
        // });

        return this._visitor.visit(root);
    }
}
less.render(fs.readFileSync(path.resolve(__dirname, 'variables.less'), 'utf8'), {
    plugins: [
        {
            install: (less1, pluginManager:any) => {
                let visitors = pluginManager.addVisitor(new VariablesOutputVisitor(less1));

                let a = visitors;
            }
        }
    ]
}).then(output => {
    console.log(output.css.toString())
});
