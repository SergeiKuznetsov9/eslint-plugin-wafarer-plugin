/**
 * @fileoverview feature sliced relative path checker
 * @author Serj
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {}, // Add messageId and message
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
        const importTo = node.source.value // app/entities/Article - будет
                                           // выглядеть примерно так

        const formFileName = context.filename // конкретный файл где мы
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
        
        context.report(node, "ЛИНТЕР РУГАЕТСЯ!!!!")


      }
    };
  },
};
