# Farm trip agent with Openai Function calling

## Introduction

This project utilizes OpenAI's `function calling` feature to build a farm trip agent. The agent can help users to find the farms near a location, get the detailed information of the available activities in the farm, and book the activity.

## Documentation

There is an detailed Medium article about this project. You can find it [here](https://medium.com/@bianbianzhu123/create-an-agent-with-openai-function-calling-capabilities-ad52122c3d12).

If you want to know more about the function calling feature, you can refer to the following links:

[openai doc](https://platform.openai.com/docs/guides/function-calling?lang=node.js)

[step by step guide](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models)

## Quick Start

1. Clone the repository
1. Run `yarn` to install the dependencies
1. Create a .env file in the root directory and add the following environment variable(s): OPENAI_API_KEY
1. Run `yarn dev` to start the application
1. Run `yarn test` to run the tests

Please use node version 18 or above.

There is also a script to generate function files from the function description. You can run `yarn function:generate` to generate the function files. Make sure you run `yarn dev` before running this script.

## Add a new function

To introduce a new function, proceed as follows:

1. Extend `DescribedFunctionName` with a new enum, such as `DoNewThings`.

```typescript
export enum DescribedFunctionName {
  GetFarm = 'get_farm',
  ...
  DoNewThings = 'do_new_things'
}
```

2. Define a Props type for the parameters, e.g., `DoNewThingsProps`.

```typescript
export type DoNewThingsProps = {
  param_1: PropBase<"number">;
  param_2: PropBase<"boolean">;
};
```

3. Insert a new entry in the `functionDescriptionsMap` object, and use the `FunctionParametersNarrowed` type to narrow down the type of the parameters.

```typescript
export const functionDescriptionsMap: Record<DescribedFunctionName, FunctionDefinition> = {
  ...
  [DescribedFunctionName.DoNewThings]: {
    name: DescribedFunctionName.DoNewThings,
    description: 'Do new things with the parameters.',
    parameters: {
      type: 'object',
      properties: {
        param_1: {
          type: 'number',
          description: 'The first parameter.',
        },
        param_2: {
          type: 'boolean',
          description: 'The third parameter.',
        },
      },
      required: ['param_1', 'param_2'],
    },
  } satisfies FunctionParametersNarrowed<DoNewThingsProps>,
};
```

4. Implement the new function in the function directory, naming it after the enum value.

```typescript
export async function do_new_things(
  args: ConvertedFunctionParamProps<DoNewThingsProps>
): Promise<string> {
  const { param_1, param_2 } = args;
  return JSON.stringify({
    param_1,
    param_2,
  });
}
```

#### The required keys for `FunctionDefinition`:

- `name`: The name of the function.
- `description`: A description of the function.
- `parameters`: An object which represents the parameters of the function. It contains `type`, `description`, and `required` keys.
  - `type`: The type of the parameter(s). It is normally `object`.
  - `properties`: An object that shows all the parameters as its keys. Each key is paired with an object that contains `type` and `description` keys, to describe the parameter.
  - `required`: An array of required parameters.

## License

This project is licensed under the MIT License
