# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.1] - 2025-03-13

### FIXED

- bug where nullable percentage prompt does not take in a float value

## [1.2.0] - 2024-01-26

### ADDED

- references folder to store all references. A prompt selection is included during runtime to select the reference

### CHANGED

- schema `format-string` type will now take in `pattern` instead of `string` in options
- schema `object` type will now take in properties as an object instead of an array of options. The field of each property will be used as the `fieldName` from the previous format
- derivatives `string-interpolation` type will now take in `pattern` instead of `string` in options
- for range min-max options, both `min` and `max` values must be provided

### REMOVED

- ability to change output directory. It will now save under `./output` for simplicity
- config file. It will now read from the command line prompt for simplicity

## [1.1.0] - 2024-10-03

### ADDED

- Zip compression of output data folder to save storage space
- feature to delete temporary referenced keys from the `json` document after derivatives are applied

### CHANGED

- Renamed naming of "Schema" to "Recipe" to reduce confusion, since recipe contains both schema and derivatives
- Output of file from `/data` to `/output`
- Global nullable percentage from `0.2` to `0.1`

## [1.0.0] - 2024-09-26

### ADDED

- Derivatives will now take in nested keys for field names and referenced key
