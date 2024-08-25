const path = require("path");

/**
 * @fileoverview feature sliced relative path checker
 * @author Serj
 */
("use strict");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      shouldBeRealativeImport:
        "В рамках одного слайса импорты должны быть относительными",
    }, // Add messageId and message
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      // Названия функций соответствуют названиям нод

      // Мы будем проверять правильность импортов, поэтому используем такую
      // функцию:
      ImportDeclaration(node) {
        const importTo = node.source.value; // app/entities/Article - будет
        // выглядеть примерно так

        const fromFileName = context.filename; // конкретный файл где мы
        // находимся

        // Задача сделать так, что если мы находимся в рамках какой то
        // сущности, то все импорты, которые мы используем внутри были
        // относительны

        // Но перед тем как это написать, проверим, что линтер работает
        // Для этого нужно обратиться к контексту, вызвать report, передать
        // ей Node, чтобы она понимала где возникла ошибка, и написать
        // сообщени, которое будет возвращаться.

        // После этого нужно будет сделать публикацию в NPM
        // В начале логинимся: npm login

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

// тут проверим, является ли путь относительным
function isPathRelative(path) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

// тут проверим должен ли путь быть относительным
// Он должен быть относительным только в рамках одного модуля.
// В остальных случаях он должен быть абсолютным
// первый аргумент - это файл, в котором мы находимся, а второй - импорт, который
// мы проверяем
function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  // Нас интересуют только 5 сегментов, остальные нас не касаются:
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
