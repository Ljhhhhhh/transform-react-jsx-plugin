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
    // 获取attributes
    let properties = [];
    let attributes = openingNode.attributes;
    attributes.forEach(attr => {
      let name = attr.name.name;
      let value = attr.value;
      properties.push(t.objectProperty(t.stringLiteral(name), value))
    })
    let attrNode = t.ObjectExpression(properties);
    // 获取children
    const children = [];
    const node = path.node;

    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      children.push(t.stringLiteral(child.value));
    }

    // 创建React.createElement
    let createElement = t.memberExpression(
      t.identifier("React"),
      t.identifier("createElement")
    );

    // 创建React.createElement(tagNode, attrs, ...chidren)表达式
    let callExpr = t.callExpression(
      createElement, [tagNode, attrNode, ...children]
    );
    path.replaceWith(callExpr);
  }
})

const result = generate(ast, {}, sourceCode);
console.log(result.code);