# Forge

Forge is a fake data generation tool designed to revolutionize data generation for professionals across industries. Whether you're conducting testing, enhancing machine learning models, or safeguarding sensitive information, Forge offers the flexibility and precision needed to meet your specific requirements. The configuration files provided allow users to customize data generation processes effortlessly, while seamless integration ensures compatibility with existing workflows. Experience the power of simulated data with Forge and unlock new possibilities for innovation and decision-making

## Project Motivation

Forge was created with the motivation to address a critical need in the data science and development community: the demand for high-quality, realistic simulated data. In today's data-driven world, access to diverse and authentic datasets is essential for a wide range of applications, from training machine learning models to testing software systems. However, acquiring real-world data can be costly, time-consuming, and often constrained by privacy and regulatory considerations.

## How to setup repository

1. Ensure `node` and `npm` is installed
2. Run `npm install` command from your terminal to install the necessary dependencies
3. Populate `/config/config.json` file. See the section on **Config File** below for more details on how to populate the fields
4. Create a schema json file and point it from the `config.json`. This schema is required to generate the documents. See the section on **Schema** below for
   more details on how to populate the fields
5. Run `npm run start` command from your terminal

## Config File

A valid config json file needs to be provided for the application. An example if shown below:

```json
// /config/config.json
{
  "schemaPath": "schema.json",
  "outputDir": "data",
  "nullablePercentage": 0.2,
  "documentCount": 10,
  "references": {
    "sampleArray": ["test", "world", "hello"],
    "sampleB": "B"
  }
}
```

| field                | explanation                                                                                                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `schemaPath`         | Where the schema json file is located. Relative from the root of this project                                                                                                                                                                                                                                                                                            |
| `outputDir`          | Directory where the folders and output documents will be generated to. Do note that this is not the final output directory. To ease repeated usage of this application, documents will be saved in the path: `<OUTPUT_DIR>/<DATE_TODAY>/<UNIQUE_ID>/...`. `outputDir` field simply points to the main parent `OUTPUT_DIR` folder. Relative from the root of this project |
| `nullablePercentage` | Global percentage for a field to be `null` if the schema item sets `isNullable` field to `true`. Accepts a value between `0` and `1`                                                                                                                                                                                                                                     |
| `documentCount`      | The number of document json files to generate                                                                                                                                                                                                                                                                                                                            |
| `references`         | Global reference object shared among the schema. Certain schema types allow the usage of references. This allow re-use of certain keys through the application (described below). In the example above, `sampleArray` and `sampleB` reference values may be used through `#ref.sampleArray` and `#ref.sampleB` respectively for some schema types                        |

## Schema

A valid schema json file needs to be provided for the application to generate documents. An example is shown below:

```json
// schema.json
{
  "sentiment": {
    "type": "enum",
    "options": ["Negative", "Neutral", "Positive"],
    "isNullable": false,
    "nullablePercentage": 0
  },
  "randomText": {
    "type": "text",
    "options": {
      "min": 1,
      "max": 5
    }
  }
}
```

| field                | explanation                                                                                                                                                                                 | required                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `type`               | Must be one of the valid `type` described below                                                                                                                                             | Yes                     |
| `options`            | Additional options provided for the particular type. Required for some types                                                                                                                | No (Yes for some types) |
| `isNullable`         | Determines if this field may be `null`. If `nullablePercentage` is not provided, it follows the global `nullablePercentage` defined in the config file. Defaults to `false` if not provided | No                      |
| `nullablePercentage` | Percentage of this field to be `null`. Overrides the global `nullablePercentage` if provided. Accepts a value from `0` to `1`. If this field is provided, it sets `isNullable` to `true`.   | No                      |

The above example may generate the following document:

```json
{
  "sentiment": "Positive",
  "randomText": "how are you today"
}
```

### # Boolean

Returns a boolean at random

```json
{
  "type": "boolean",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Enum

Picks a random item from an array. Options must not be an empty array and must be provided

```json
{
  "type": "enum",
  "options": ["apple", "banana", "pear"],
  "isNullable": false,
  "nullablePercentage": 0
}
```

You may also use a referenced array for the options. The following example uses `sampleArray` array defined at the `config.json`:

```json
{
  "type": "enum",
  "options": "#ref.sampleArray",
  "isNullable": false,
  "nullablePercentage": 0
}
```

The reference array must not be an empty array

---

### # ISO8601 Date String

Generates an `ISO8601` date string. When no options are provided, it generates a date from the past. You may provide `dateFrom` and `dateTo` options to return a date within the range.

If only `dateFrom` option is provided, it will return a date from then until today.

If only `dateTo` option is provided, it will return a random date up to that date and 10 years ago.

```json
{
  "type": "iso-timestamp",
  "options": {
    "dateFrom": "2018-06-13T12:11:13+05:00",
    "dateTo": "2019-06-13T12:11:13+05:00"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Object

Generates a nested object with recursive type properties. Allows you to generate infinitely-nested objects until this it crashes the call stack (TODO: will limit the nesting next time)

```json
{
  "type": "object",
  "options": {
    "properties": [
      {
        "fieldName": "isSingle",
        "type": "boolean",
        "isNullable": true,
        "nullablePercentage": 0.6
      },
      {
        "fieldName": "dateOfBirth",
        "type": "iso-timestamp",
        "isNullable": false,
        "nullablePercentage": 0
      },
      {
        "fieldName": "address",
        "type": "object",
        "options": {
          "properties": [
            {
              "fieldName": "zipCode",
              "type": "numeric-string",
              "isNullable": true,
              "nullablePercentage": 0.2
            },
            {
              "fieldName": "city",
              "type": "city",
              "isNullable": true,
              "nullablePercentage": 0.4
            }
          ]
        },
        "isNullable": false
      }
    ]
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

This creates the following:

```json
{
  "isSingle": false,
  "dateOfBirth": "2019-06-13T12:11:13+05:00",
  "address": {
    "zipCode": "571242",
    "city": "Singapore"
  }
}
```

---

### # Delimited String

Generates a delimited string. Useful for creating random IDs. The following example creates a three part delimited string.

For provided arrays, it will choose a random item (similar to how `enum` type works).

For a single specified value, it will always add the value to the position provided (in this case, "Honda" will be in the middle).

Lastly, you could reference an array using `#ref.` parameter.

```json
{
  "type": "delimited-string",
  "options": {
    "delimiter": "-",
    "arrayOfOptions": [["apple", "banana", "pear"], "Honda", "#ref.sampleArray"]
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

The above generates one of such string: `pear-Honda-test`

---

### # Text

Generates random words. When no options are provided, it generates between `5` to `120` words. A `min` and `max` option may be provided to set the minimum and maximum word count respectively.

```json
{
  "type": "text",
  "options": {
    "min": 0,
    "max": 120
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Numeric String

Generates a numeric string of certain length. When no options are provided, it generates numeric string of length 1. A `min` and `max` option may be provided to set the minimum and maximum length respectively. An `allowLeadingZeroes` boolean option is provided to allow left-padded zeroes in the string.

```json
{
  "type": "numeric-string",
  "options": {
    "min": 1,
    "max": 10000,
    "allowLeadingZeroes": false
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Array

Generates an array with a given `schema` type. A `min` and `max` should be provided to generate the minimum and maximum items in the list. Do note that `isNullable` and `nullablePercentage` property will not be in the `schema` option to prevent pushing `null` into the array.

The following example generates an array of object of random length 0~5:

```json
{
  "type": "array",
  "options": {
    "min": 0,
    "max": 5,
    "schema": {
      "type": "object",
      "options": {
        "properties": [
          {
            "fieldName": "zipCode",
            "type": "numeric-string",
            "isNullable": true,
            "nullablePercentage": 0.2
          },
          {
            "fieldName": "city",
            "type": "city",
            "isNullable": true,
            "nullablePercentage": 0.4
          }
        ]
      }
    }
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # URL

Generates a URL string. A `allowNumbers` option may be provided to determine if the URL allow numbers in the sub-path. Sets to `true` by default.

```json
{
  "type": "url",
  "options": {
    "allowNumbers": true
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Number

Generates a number. A `min` and `max` option may be provided to generate a number between the minimum and maximum range (inclusive). If no options are provided, a number between `0` and `Number.MAX_SAFE_INTEGER` is returned

```json
{
  "type": "number",
  "options": {
    "min": 0,
    "max": 1
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Float

Generates a float. A `min` and `max` option may be provided to generate a number between the minimum and maximum range (inclusive). If no options are provided, a number between `0` and `1` is returned

```json
{
  "type": "float",
  "options": {
    "min": 0,
    "max": 1
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Username

Returns a random username.

```json
{
  "type": "username",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Gender

Returns a random gender: `male` or `female`

```json
{
  "type": "gender",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # User Bio

Returns a random internet user bio. e.g. "oatmeal advocate, veteran 🐠"

```json
{
  "type": "user-bio",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # First Name

Returns a random first name. A `gender` option may be specified to return a first name of that sex. Gender must be `male` or `female`

```json
{
  "type": "first-name",
  "options": {
    "gender": "male"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Last Name

Returns a random last name. A `gender` option may be specified to return a last name of that sex. Gender must be `male` or `female`

```json
{
  "type": "last-name",
  "options": {
    "gender": "male"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Full Name

Returns a random full name. A `gender` option may be specified to return a name of that sex. Gender must be `male` or `female`

```json
{
  "type": "full-name",
  "options": {
    "gender": "male"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Email

Returns a random email.

```json
{
  "type": "email",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Country

Returns a random country.

```json
{
  "type": "country",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Country Code

Returns a random country code.

```json
{
  "type": "country-code",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Image URL

Returns a random image URL. e.g. `https://loremflickr.com/640/480?lock=1234`

```json
{
  "type": "url-image",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # File

Returns a random file with a file extension. An optional `extension` parameter may be provided
for a fixed file extension. The following example generates a random `.jpg` file, e.g. `dollar.jpg`

```json
{
  "type": "file",
  "options": {
    "extension": "jpg"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---
