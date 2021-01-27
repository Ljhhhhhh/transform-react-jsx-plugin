const { types: t } = require("@babel/core");
const pluginSyntaxJsx = require('@babel/plugin-syntax-jsx').default;

const visitor = {
  JSXElement (path) {

    let openingNode = path.get("openingElement").node;
    // 获取tag
    let tag = t.stringLiteral(openingNode.name.name);
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
      children.push(t.stringLiteral(child.value + '好帅'));
    }

    // 创建React.createElement
    let createElement = t.memberExpression(
      t.identifier("React"),
      t.identifier("createElement")
    );

    // 创建React.createElement(tag, attrs, ...chidren)表达式
    let callExpr = t.callExpression(
      createElement, [tag, attrNode, ...children]
    );
    path.replaceWith(callExpr);
  }
}

module.exports = {
  name: "transform-react-jsx",
  inherits: pluginSyntaxJsx, // 功能等予 plugins: ['jsx]
  visitor
}

// module.exports = {
//   name: "transform-react-jsx",
//   inherits: xxx, // 继承插件
//   visitor
// }