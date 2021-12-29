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
- id: remoteSchemaTest
  name: Validate package.json against a missing remote schema
  continue-on-error: true
  uses: cardinalby/schema-validator-action@v1
  with:
    file: 'package.json'
    schema: 'https://not-existing-url-1245/'

# steps.remoteSchemaTest.outputs.errorType == "schema"
# steps.remoteSchemaTest.outcome == "failure"
```

## Inputs

### `file` **Required**
Path to the JSON or YAML file to be validated.

### `schema` **Required**
Path or URL (http or https) to the JSON or YAML file with a schema.

## Outputs

### `errorType`
Is empty if validation succeeds.
* `file`: file loading or parsing failed
* `schema`: schema loading or parsing failed
* `validation`: validation failed