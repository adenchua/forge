# Forge

Forge is a fake data generation tool designed to revolutionize data generation for professionals across industries. Whether you're conducting testing, enhancing machine learning models, or safeguarding sensitive information, Forge offers the flexibility and precision needed to meet your specific requirements. The configuration files provided allow users to customize data generation processes effortlessly, while seamless integration ensures compatibility with existing workflows. Experience the power of simulated data with Forge and unlock new possibilities for innovation and decision-making

## Project Motivation

Forge was created with the motivation to address a critical need in the data science and development community: the demand for high-quality, realistic simulated data. In today's data-driven world, access to diverse and authentic datasets is essential for a wide range of applications, from training machine learning models to testing software systems. However, acquiring real-world data can be costly, time-consuming, and often constrained by privacy and regulatory considerations.

## How to setup repository

> :warning: This repository supports Node versions `18` and above

1. Ensure `node` and `npm` is installed
2. Run `npm install` command from your terminal to install the necessary dependencies
3. Create a recipe json file and place it under `/recipes`. This recipe is required to generate the documents. See the section on [**Recipe**](#recipe) below for more details on how to populate the fields
4. (optional) Create a reference json file and place it under `/references`. References are objects that schema uses to share certain key-values through the script. In the example [**Reference**](#reference), `sampleArray` and `sampleB` reference values may be used through `#ref.sampleArray` and `#ref.sampleB` respectively for some schema types.
5. Run `npm run start` command from your terminal to execute the script

## Reference

```json
// reference.json
{
  "sampleArray": ["test", "world", "hello"],
  "sampleB": "B"
}
```

## Recipe

A valid recipe json file needs to be provided for the application to generate documents, with three keys, `schema`, `derivatives` and `keysToDelete`. An example is shown below:

```json
// recipe.json
{
  "schema": {
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
    },
    "temporaryIdForReference": {
      "type": "id"
    }
  },
  "derivatives": {
    "sentimentWithText": {
      "type": "string-interpolation",
      "options": {
        "string": "{}-{}",
        "referenceKeys": ["sentiment", "temporaryIdForReference"]
      }
    }
  },
  "keysToDelete": ["temporaryIdForReference"]
}
```

The above example may generate the following document:

```json
{
  "sentiment": "Positive",
  "randomText": "how are you today",
  "sentimentWithText": "Positive-ab4p2jW1Qs35Pz"
}
```

For examples of each key, please check out: [Schema](#schema-object), [Derivatives](#derived-values-object), [Keys To Delete](#keys-to-delete)

### Schema Object

The `schema` object generates the result document with the type of data defined in each field.

| field                | explanation                                                                                                                                                                               | required                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `type`               | Must be one of the valid `type` described below                                                                                                                                           | Yes                     |
| `options`            | Additional options provided for the particular type. Required for some types                                                                                                              | No (Yes for some types) |
| `isNullable`         | Determines if this field may be `null`. If `nullablePercentage` is not provided, it follows the global `nullablePercentage` defined in the config file. Defaults to `false`               | No                      |
| `nullablePercentage` | Percentage of this field to be `null`. Overrides the global `nullablePercentage` if provided. Accepts a value from `0` to `1`. If this field is provided, it sets `isNullable` to `true`. | No                      |

---

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

### # Enum Array

Picks a random subset array from an array. Options must not be an empty array and must be provided.

```json
{
  "type": "enum-array",
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

Generates an `ISO8601` date string. When no options are provided, it generates a date from the past. You may provide `dateFrom` and `dateTo` options to return a date within the range. Note that both `dateFrom` and `dateTo` options must be provided for a date range to work:

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

You may also use a referenced date for the options. The following example uses `date` reference defined at the `config.json`:

```json
{
  "type": "iso-timestamp",
  "options": {
    "dateFrom": "#ref.date",
    "dateTo": "#ref.date"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Object

Generates a nested object with recursive type properties. Allows you to generate nested objects

```json
{
  "type": "object",
  "options": {
    "properties": {
      "isSingle": {
        "type": "boolean",
        "isNullable": true,
        "nullablePercentage": 0.6
      },
      "dateOfBirth": {
        "type": "iso-timestamp",
        "isNullable": false,
        "nullablePercentage": 0
      },
      "address": {
        "type": "object",
        "options": {
          "properties": {
            "zipCode": {
              "type": "numeric-string",
              "isNullable": true,
              "nullablePercentage": 0.2
            },
            "city": {
              "type": "country",
              "isNullable": true,
              "nullablePercentage": 0.4
            }
          }
        },
        "isNullable": false
      }
    }
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

You may also use a referenced `min` and `max` for the options. The following example uses `min` reference defined at the `config.json`:

```json
{
  "type": "text",
  "options": {
    "min": "#ref.min",
    "max": 120
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Numeric String

Generates a numeric string of certain length. When no options are provided, it generates numeric string of length 1. A `min` and `max` option may be provided to set the minimum and maximum length respectively. An `allowLeadingZeros` boolean option is provided to allow left-padded zeroes in the string.

```json
{
  "type": "numeric-string",
  "options": {
    "min": 1,
    "max": 10000,
    "allowLeadingZeros": false
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

You may also use a referenced `min` and `max` for the options. The following example uses `min` reference defined at the `config.json`:

```json
{
  "type": "numeric-string",
  "options": {
    "min": "#ref.min",
    "max": 120,
    "allowLeadingZeros": false
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
        "properties": {
          "zipCode": {
            "type": "numeric-string",
            "isNullable": true,
            "nullablePercentage": 0.2
          },
          "city": {
            "type": "country",
            "isNullable": true,
            "nullablePercentage": 0.4
          }
        }
      }
    }
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # URL

Generates a URL string. A `allowNumbers` option may be provided to determine if the URL allow numbers in the sub-path. Sets to `false` by default.

```json
{
  "type": "url",
  "options": {
    "allowNumbers": false
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # URL-Domain

Generates a URL domain string. e.g. "slow-timer.info"

```json
{
  "type": "url-domain",
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

You may also use a referenced `min` and `max` for the options. The following example uses `min` reference defined at the `config.json`:

```json
{
  "type": "number",
  "options": {
    "min": "#ref.min",
    "max": 120
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
    "max": 1.0
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

You may also use a referenced `min` and `max` for the options. The following example uses `min` reference defined at the `config.json`:

```json
{
  "type": "float",
  "options": {
    "min": "#ref.min",
    "max": 1.0
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

### # Social Media Post

Returns a random social media post. Takes in an optional `min` and `max` to determine the minimum and maximum number of words returned. If not provided, the default ranges from `1` to `120`.

Takes in an optional `hashtagPercentage` for chance of hashtags to be added to the post. Defaults to `0.3` (30%).

Takes in an optional `urlPercentage` for chance of url to be added to the end of the post. Defaults to `0.05` (5%).

Lastly, takes in an optional array of `languages` where it defaults to `EN` if `languages` is not provided.

One random language from the list will be chosen to generate the post. To specify a single language, provide an array with only the language. e.g (`['FR']` will generate posts in the French language)

| permitted `languages` keys | translation        |
| -------------------------- | ------------------ |
| `CN`                       | Simplified Chinese |
| `DE`                       | German             |
| `FR`                       | French             |
| `EN`                       | English            |
| `KO`                       | Korean             |

```json
{
  "type": "social-media-post",
  "options": {
    "languages": ["EN", "CN"],
    "min": 1,
    "max": 120,
    "hashtagPercentage": 0.3,
    "urlPercentage": 0.05
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # ID

Returns a random alphanumeric ID. e.g `b171cac326a79abdd0ad3afb`

```json
{
  "type": "id",
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Format-String

Replaces a string format with generated values.

Takes in two compulsory options, a `pattern` value and `properties` array, with an example below:

```json
{
  "type": "format-string",
  "options": {
    "pattern": "{}_{}",
    "properties": [
      {
        "type": "numeric-string",
        "options": {
          "min": 8,
          "max": 8
        }
      },
      {
        "type": "enum",
        "options": ["apple"]
      }
    ]
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

The example above generates a `{numeric-string}_{enum}` result, e.g. `12345678_apple`.

`pattern` takes in a formatted string where each `{}` represents the generated property (ordered item in `properties`) to be replaced with, while each item in the `properties` array takes in `type` and `options` key.

Supports the following `type`:

- `boolean`
- `country`
- `country-code`
- `email`
- `enum`
- `file`
- `first-name`
- `float`
- `full-name`
- `gender`
- `id`
- `iso-timestamp`
- `last-name`
- `number`
- `numeric-string`
- `url`
- `url-domain`
- `url-image`
- `username`

---

## Derived Values Object

After creating the result document with the `schema` object, each field in the `derivatives` object is derived based on the data generated previously from the schema.

Supports nested object reference and setting of fields

```javascript
// recipe.json
{
  "schema": {
   // ...
  },
  "derivatives": {
    "sentimentWithText": {
      "type": "string-interpolation",
      "options": {
        "string": "{}-{}",
        "referenceKeys": ["sentiment", "randomText"]
      }
    },
    // sets a fieldB in nestedObjectA in the output
    "nestedObjectA.fieldB": {
      "type": "string-interpolation",
      "options": {
        "string": "{}-{}",
        "referenceKeys": ["sentiment", "randomText"]
      }
    },
    "nestedObjectA.fieldC": {
      "type": "copy",
      "options": {
        // able to reference a nested object too
        "referenceKey": "nestedObjectG.fieldF"
      }
    }
  },
  "keysToDelete": []
}
```

### # String Interpolation

Replaces a string format with reference values.

Takes in two compulsory options, a `pattern` value and `referenceKeys` array, with an example below:

```json
{
  "type": "string-interpolation",
  "options": {
    "pattern": "{}_{}",
    "referenceKeys": ["keyA", "keyB"]
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

The example above generates a `{keyA}_{keyB}` result, e.g. `12345678_apple`.

`string` takes in a formatted string where each `{}` is replaced by the referenced key's value defined in the `referencedKeys` array. (ordered list)

---

### # Copy

Copies a value from a reference key `keyA` to this field:

```json
{
  "type": "copy",
  "options": {
    "referenceKey": "keyA"
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

---

### # Date Before

Creates a date before a date field from a reference key:

```json
{
  "type": "date-before",
  "options": {
    "referenceKey": "keyA",
    "options": {
      "days": 10
    }
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

The example above creates a date from a range of 0~10 days before the date of `keyA`.

---

### # Date After

Creates a date after a date field from a reference key:

```json
{
  "type": "date-after",
  "options": {
    "referenceKey": "keyA",
    "options": {
      "days": 10
    }
  },
  "isNullable": false,
  "nullablePercentage": 0
}
```

The example above creates a date from a range of 0~10 days after the date of `keyA`.

---

## Keys To Delete

Sometimes it may be required to add a temporary reference for derivatives. To delete these temporary references afterwards, add these keys in the `keysToDelete` array in the `recipe` object.

```javascript
// recipe.json
{
  "schema": {
    ...
    "temporaryIdForReference": {
      "type": "id"
    }
  },
  "derivatives": {
    ...
  },
  "keysToDelete": ["temporaryIdForReference"]
}
```

The example above uses a temporary ID for reference: `temporaryIdForReference`. To delete this property after the derivatives are applied, add the field to `keysToDelete` array.
