# Openai Function calling

## How it works

1. In an API call, `Describe` a function or multiple functions in the JSON format and have the model intelligently choose to output a JSON
2. The output JSON contains arguments that can be used to call one or more functions (the `described` ones)
3. ‼️Important: The Chat Completions API does not call the function; instead, the model generates JSON that `you can` use to call the function in your code.

## Potential Risks

The latest versions, `gpt-3.5-turbo-0125` and `gpt-4-turbo-preview`, can better recognize when to call a function and reply with more accurate JSON responses (to call the function) than before. However, this improvement comes with risks. We recommend adding steps to confirm with users before doing anything impactful, like sending emails or buying something.

## Documentation

[openai doc](https://platform.openai.com/docs/guides/function-calling?lang=node.js)

[step by step guide](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models)

## Simple Explanation

Basically, function calling `allows you to more reliably get structured data (JSON) back from the model`, so you can use it to call a function in your code.

## Sequence diagram

### The basic sequence of steps for function calling is as follows:

referred from the doc:

1. Call the model with the user query and a set of functions defined in the functions parameter.
1. The model can choose to call one or more functions; if so, the content will be a stringified JSON object adhering to your custom schema (note: the model may hallucinate parameters).
1. Parse the string into JSON in your code, and call your function with the provided arguments if they exist.
1. Call the model again by appending the function response as a new message, and let the model summarize the results back to the user.

<img src="./images/openai-function-calling.jpg">

## Why we need it?

- A fast and reliable way to extract structured data from text. In the traditional way, for each scenario (question), we need to have a specific function that extracts the data from user input. The can be time-consuming when you scale up. So normally, we require the user to fill in a form. This limits the user experience.

- If we don't use the traditional way but use prompt engineering to get the structured data from the model (ask the model to extract data from plain text). Models are non-deterministic and people may phase the same question in very different ways, and even setting the temperature to 0, you may still get a output not only consists of JSON but also some text as well. To clean, extract and parse the arguments through another function is necessary and prone to errors. Using Regex or other ways to do the string manipulation is messy.

- Even we can set the response format to JSON mode, we sometimes still need to pre-process the data to get what we want.

## Code Example

### Function Description

It automatically fills the arguments with correct info based on the prompt

Note: The function does not exist yet

Remember even the description is a javascript object, it will be converted to a JSON when you call the model.

#### The required keys for `function`:

- `name`: The name of the function.
- `description`: A description of the function.
- `parameters`: An object which represents the parameters of the function. It contains `type`, `description`, and `required` keys.
  - `type`: The type of the parameter(s). It is normally `object`.
  - `properties`: An object that shows all the parameters as its keys. Each key is paired with an object that contains `type` and `description` keys, to describe the parameter.
  - `required`: An array of required parameters.

```json
{
  "name": "get_current_weather",
  "description": "Get the current weather in a location.",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city to get the weather for, e.g. Melbourne"
      },
      "format": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The temperature unit to use. Infer this from the users location."
      }
    },
    "required": ["location", "format"]
  }
}
```

#### Return value

To access to the arguments of the function which extracted from the user prompt by the LLM.

The arguments are in JSON format.

```typescript
response.choices[0]?.message.tool_calls?.[0]?.function.arguments;
```

#### Features

from this example:
Function description

```typescript
  {
    name: DescribedFunctionName.GetFlightInfo,
    description: "Get information about a flight between two locations.",
    parameters: {
      type: "object",
      properties: {
        location_origin: {
          type: "string",
          description: "The location of the departure airport. e.g. DUS",
        },
        location_destination: {
          type: "string",
          description: "The location of the destination airport. e.g. HAM",
        },
      },
      required: ["location_origin", "location_destination"],
    },
  },
```

User prompt

```text
I want to fly from Amsterdam to New York.
```

The returned value will convert the location names to the airport codes as we provided in the property description in the function description.

```json
{
  "location_origin": "AMS",
  "location_destination": "JFK"
}
```

#### Create the corresponding actual function

## Parallel function calling

- model's ability to perform multiple function calls together, allowing the effects and results of these function calls to be resolved in parallel.

- useful if functions take a long time, and reduces round trips with the API.

For example, the model may call functions to get the weather in `3` different locations at the same time, which will result in a message with 3 function calls in the `tool_calls` array, each with an `id`.

To respond to these function calls, add 3 new messages to the conversation, each containing the result of one function call, with a `tool_call_id` referencing the id from `tool_calls`.

## Code Example

=======WIP========

### Description

In this example, we define a single function `get_current_weather`. The model calls the function multiple times, and after sending the `function response` back to the model, we let it decide the next step. It responded with a user-facing message which was telling the user the temperature in San Francisco, Tokyo, and Paris. Depending on the query, it may choose to call a function again.

If you want to force the model to call a specific function you can do so by setting `tool_choice` with a specific function name. You can also force the model to generate a user-facing message by setting `tool_choice: "none"`. Note that the default behavior `(tool_choice: "auto")` is for the model to decide on its own whether to call a function and if so which function to call.

`functions` property of `ChatCompletionCreateParamsBase` is deprecated and use `tools` instead.

`function_call` is deprecated and use `tool_choice` instead.

`tool_choice`: Controls which (if any) function is called by the model. none means the model will not call a function and instead generates a message. auto means the model can pick between generating a message or calling a function. If the model can access to multiple functions, it will pick the one that it thinks is most relevant, based on the description of the function, the parameters and the user prompt.

Specifying a particular function via {"type": "function", "function": {"name": "my_function"}} forces the model to call that function.

none is the default when no functions are present. auto is the default if functions are present.

## Test

https://dev.to/mangadev/set-up-a-backend-nodejs-typescript-jest-using-es-modules-1530

jest ts-jest @types/jest ts-node

yarn ts-jest config:init - jest.config.ts

ReferenceError: module is not defined in ES module scope
This file is being treated as an ES module because it has a '.js' file extension and '/Users/tianyili/Learn/ml/openai/openai-function-calling/package.json' contains "type": "module". To treat it as a CommonJS script, rename it to use the '.cjs' file extension.
