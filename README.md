# Decimal Playground

> 🚧 Under Construction 🚧

A playground for investigating design directions for the [Ecma TC39 JavaScript Decimal proposal](https://github.com/tc39/proposal-decimal).  
When it exists, it will be at: https://sarahghp.github.io/decimal-playground/.

Based heavily on the [Records & Tuples Playground](https://rickbutton.github.io/record-tuple-playground/) from [Rick Button at Bloomberg](https://github.com/bloomberg/record-tuple-polyfill/tree/master/packages/record-tuple-playground)

## Example suggestions

Suggestions for playground example code [is currently being sought](https://github.com/sarahghp/decimal-playground/issues/2).

## Developing

> NB: Currently this project is being developed internally by Igalia team members. Please do not open PRs without communicating with project members beforehand.

The playground is automatically deployed to the `website` branch when a PR is successfully merged to main. Therefore, please work off main going forward. (This is an update to the process, from 2022/04/13.)

There is a [list of features to be implemented](https://sarahghp.notion.site/0834ebc4c2d6487795721f57d375518e?v=6a98d0f574114a449dbdc25590b442bc).

### Local Server

To run the project locally, run `npm run dev` in a terminal window.


### Tests

All new capabilities added to the `/transforms` directory must have corresponding tests. These are written using [babel-plugin-tester](https://github.com/babel-utils/babel-plugin-tester).

Run tests with `npm test`
