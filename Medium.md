# OpenAI Function calling 2024

## Introduction

It's 2024. More people are trying to build AI-powered applications.

The advantage of AI powered application is obvious.

image we build a app in the traditional way. For each feature, such as `user login` or `booking a ticket`, we need to write a function/service to handle the logic, and to make sure the data from the user, which will be the argument(s) for the corresponding function, is structured, we normally require the user to fill in a form, using input field or check box to collect the data and put a bunch of validation rules to make sure the data is acceptable. If it involves multiple steps, we even need to create a flow of forms for the user to follow. This really limits the user experience.

Basically, image you want to bring your family to a one day farm trip during Easter. You haven't decide which day to go. But you want the farm to be within 2 hours drive from your home, and you want to know what activities are available, at the same time, you also need to make sure the weather on that day is cloudy as your kid is allergic to the sun, and then you realize your partner would not be happy if you make the decision without him/her, so you instead need to create a list of candidate farms into a PDF for the family meeting... Just a typical day in marriage life.

How many steps do you need to take? How many forms do you need to fill in? How many times do you need to click the submit button?

This is why even the booking website is so popular, some people still prefer to find a travel agent to help them to plan the trip - there is just too many details to consider.

What AI enables:

1. A conversation like experience which is more natural and user friendly.
2. Moreover, all the features in the traditional app are `separated`. The reason why we need to go to different page and fill in different forms is simply due to the fact that the trigger of each function is different. But with AI, we can have a `single entry point`, the AI will understand the user input and decide which function to call based on the input. It can even decide to call multiple functions step by step to get the complex task done.

However, one of the pain point in this is how to deal with unstructured data in the form of text strings returned by the model.

To get the structured data (basically JSON) from the model, previously, you will need to use prompt engineering, for example, using instructions like 'return the output in a JSON format'; however, Models are non-deterministic and people may phase the same question in very different ways, so the return of the model can be volatile, even when setting the temperature to a very low value. You may also face situations like getting a output not only consists of JSON but also some text as well, and to clean, extract and parse the arguments through another function is necessary and prone to errors, and using Regex or other ways to do the string manipulation is messy.

Openai introduced two new features to solve this problem: `Json mode` and `Function calling`.

In this article, we will focus on the `Function calling` feature; we will discuss how it works and how it can help you to get structured data from the model, step by step with typescript code examples.

All the code can be found in this [Github repository](https://github.com/bianbianzhu/openai-function-calling). Give it a star if you find it helpful.

## Current challenges

- Structured Data Handling: Traditionally, developers have had to use regular expressions (RegEx) or prompt engineering to extract information from text strings, which can be cumbersome and error-prone. Function Calling simplifies this process by enabling models to take user-defined functions as input and generate structured output, such as JSON data, without the need for RegEx or prompt engineering.

- Consistency and Predictability: Function Calling helps in achieving consistent and predictable outputs from the AI models. It allows developers to define custom functions that can be used to extract specific information from text, ensuring that the output is structured and consistent across different inputs. This is particularly useful for applications that require stable and reliable data extraction, such as text summarization, data extraction from documents, and building AI applications that interact with external APIs or databases.

## How it works

According to [OpenAI's documentation](https://platform.openai.com/docs/guides/function-calling), the basic sequence of steps for function calling is as follows:

1. Call the model with the user query and a set of functions defined in the functions parameter.
1. The model can choose to call one or more functions; if so, the content will be a stringified JSON object adhering to your custom schema (note: the model may hallucinate parameters).
1. Parse the string into JSON in your code, and call your function with the provided arguments if they exist.
1. Call the model again by appending the function response as a new message, and let the model summarize the results back to the user.

<img src="./images/openai-fc-preview.jpg">

## Step by step guide

Here is a business case that we want to build an farm trip assistant agent that helps user to find good farm places to visit, check what activities are available, book the activities and file a complaint if needed.

### Step 1: Define the functions
