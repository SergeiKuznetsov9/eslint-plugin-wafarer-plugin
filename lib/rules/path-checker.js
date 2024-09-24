const path = require("path");

/**
 * @fileoverview feature sliced relative path checker
 * @author Serj
 */
("use strict");

// После того как в проект добавили алиасы, линтер перестал работать.
// Поправим
// Для этого сделаем так, чтобы линтер можно было настривать извне и передавать
// ему алиас, для того, чтобы можно было работать с любыми алиасами

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null,
    },
    fixable: null,
    // здесь описывается схема опций, которые можно пробросить в линтер
    schema: [
      {
        type: "object",
        properties: {
          aliases: {
            type: "string",
          },
        },
      },
    ],
    messages: {
      shouldBeRealativeImport:
        "В рамках одного слайса импорты должны быть относительными",
    },
  },

  create(context) {
    // этот алиас прилетит из проекта, в котором исрользуется линтер
    const alias = context.options[0]?.alias || "";
    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, "") : value;

        const fromFileName = context.filename;
        if (shouldBeRelative(fromFileName, importTo)) {
          context.report({
            node,
            messageId: "shouldBeRealativeImport",
          });
        }
      },
    };
  },
};

function isPathRelative(path) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const layers = {
    entities: "entities",
    features: "features",
    shared: "shared",
    pages: "pages",
    widgets: "widgets",
  };

  const toArray = to.split("/");
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split("src")[1];
  const fromArray = projectFrom.split("\\");

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
