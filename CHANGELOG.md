# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2024-01-26

### CHANGED

- schema `format-string` type will now take in `pattern` instead of `string` in options
- `object` type will now take in properties as an object instead of an array of options. The field of each property will be used as the `fieldName`
- derivatives `string-interpolation` type will now take in `pattern` instead of `string` in options

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
