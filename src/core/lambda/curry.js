//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Transforms functions on tuples into curried functions.
 *
 * ## Why?
 *
 * Sometimes you want to specify part of the arguments of a function, and
 * leave the other arguments to be specified later. For this you could use
 * an arrow function:
 *
 *     const property = (key, object) => object[key]
 *     people.map(person => property('name', person));
 *
 * Currying allows you to construct functions that support partial application
 * naturally:
 *
 *     const property = curry(2, (key, object) => object[key]);
 *     people.map(property('name'))
 *
 * In essence, currying transforms a function that takes N arguments into
 * N functions that each take 1 argument. In the example above we'd have:
 *
 *     const property = (key, object) => object[key]
 *     curry(2, property)
 *     // => (key) => (object) => object[key]
 *
 *
 * ## Particularities of Folktale's `curry`
 *
 * Because JavaScript is a language where everything is variadic,
 * currying doesn't always fit. To try reducing the problems and
 * work with common JS idioms, currying functions *auto-unroll*
 * application. That is, something like:
 *
 *     const sum = curry(2, (x, y) => x + y)
 *     sum(1, 2, 3)
 *
 * Is handled as:
 *
 *     sum(1, 2)(3)
 *
 * This ensures that curried functions can be properly composed,
 * regardless of how you invoke them. But it also means that
 * passing more arguments to a function than the number of arguments
 * the whole composition takes will probably break your program.
 *
 * --------------------------------------------------------------------
 * name        : curry
 * module      : folktale/core/lambda/curry
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Currying
 * stability   : stable
 * portability : portable
 * platforms:
 *   - ECMAScript 3
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 *
 * authors:
 *   - Quildreen Motta
 *
 * seeAlso:
 *   - type: link
 *     title: Why Curry Helps
 *     url: https://hughfdjackson.com/javascript/why-curry-helps/
 *
 *   - type: link
 *     title: Does Curry Help?
 *     url: https://hughfdjackson.com/javascript/does-curry-help/
 *
 * signature: curry(arity, fn)
 * type: |
 *   (Number, (Any...) => 'a) => Any... => 'a or ((Any...) => 'a)
 */
const curry = (arity, fn) => {
  // A curried function; accepts arguments until the number of given
  // arguments is greater or equal to the function's arity.
  const curried = (oldArgs) => (...newArgs) => {
    const allArgs  = oldArgs.concat(newArgs);
    const argCount = allArgs.length;

    return argCount < arity   ?  curried(allArgs)
    :      argCount === arity ?  fn(...allArgs)
    :      /* otherwise */       unrollInvoke(fn, arity, allArgs);
  };

  // When a curried function receives more arguments than the number
  // of arguments it expects, we need to deal with the overflow.
  // The unrolled invocation takes care of this by passing the
  // remaining arguments to the resulting function.
  // This is required for proper composition of curried functions,
  // but fails with the composition of curried and non-curried
  // functions — this library always considers JS functions
  // not generated by *this* function as functions taking an
  // infinite number of arguments.
  const unrollInvoke = (fn_, arity_, args) => {
    const firstFnArgs = args.slice(0, arity_);
    const secondFnArgs = args.slice(arity_);

    return fn_(...firstFnArgs)(...secondFnArgs);
  };


  return curried([]);
};


module.exports = curry;
