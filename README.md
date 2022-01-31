[![test](https://github.com/cardinalby/schema-validator-action/actions/workflows/test.yml/badge.svg)](https://github.com/cardinalby/schema-validator-action/actions/workflows/test.yml)
[![build](https://github.com/cardinalby/schema-validator-action/actions/workflows/build.yml/badge.svg)](https://github.com/cardinalby/jschema-validator-action/actions/workflows/build.yml)

## Validate JSON or YAML against a schema

GitHub Action for validating JSON or YAML file against a schema. 
Fails if validation doesn't succeed. Based on 
[jsonschema](https://github.com/tdegrunt/jsonschema#readme) package.

## Examples

```yaml
- name: Validate action.yml against a remote schema
  uses: cardinalby/schema-validator-action@v1
  with:
    file: 'action.yml'
    schema: 'https://json.schemastore.org/github-action.json'
```

```yaml
- name: Validate package.json against a local schema
  uses: cardinalby/schema-validator-action@v1
  with:
    file: 'package.json'
    schema: 'schemas/package.schema.json'
```

```yaml
- name: Validate all json files using their own $schema properties
  uses: cardinalby/schema-validator-action@v1
  with:
    file: 'dir/*.json'
```

```yaml
- name: Validate 3 files using the same schema
  uses: cardinalby/schema-validator-action@v1
  with:
    file: 'first.json|second.json|third.json'
    schema: 'https://json.schemastore.org/swagger-2.0.json'
```

## Inputs

### 🔸 `file` **Required**
Path to the JSON or YAML file to be validated.

* Can accept a _glob_ pattern (will validate all matched files)
* Can accept multiple files (or glob patterns) separated by `|` symbol.

### 🔸 `schema`
Path or URL (http or https) to the JSON or YAML file with a schema.

**Can be empty** if all validated files contain valid `$schema` property.
Input value has a priority over `$schema` property in file (if both are set). 

## Outputs

### 🔹 `errorType`
Is empty if validation succeeds.
* `file`: file loading or parsing failed
* `schema`: schema loading or parsing failed
* `validation`: validation failed