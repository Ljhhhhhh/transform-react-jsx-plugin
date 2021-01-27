var parser = require('@babel/parser');
const t = require("@babel/types");
const generate = require("@babel/generator").default
var traverse = require('@babel/traverse').default;

const sourceCode = `<h1 className="title" >hello jsx</h1>`;
// TODO: React.createElement("h1",{className: "title"},"hello jsx");

const ast = parser.parse(sourceCode, {
  plugins: ['jsx']
})

traverse(ast, {
  JSXElement (path) {

    let openingNode = path.get("openingElement").node;
    // 获取标签名称
    const tagName = openingNode.name.name;
    // 设置标签节点
    let tagNode = t.stringLiteral(tagName);
  }
})

const result = generate(ast, {}, sourceCode);
console.log(result.code);

React.createElement(
  "h1",
  { className: "title" },
  "hello jsx"
)