# depsize · ![GitHub Repo Size](https://img.shields.io/github/languages/code-size/qtchaos/depsize) ![Dependencies Size](https://depsize.grubby.workers.dev/depsize/qtchaos/depsize)

depsize lets you show the size of the projects dependencies.

## Example

`https://depsize.grubby.workers.dev/depsize/{USER}/{REPO}`

![Dependencies Size](https://depsize.grubby.workers.dev/depsize/qtchaos/depsize)

`https://depsize.grubby.workers.dev/schema/{USER}/{REPO}`

```
{
  "schemaVersion": 1,
  "label": "dependency size",
  "message": "42.46 kB",
  "color": "blue"
}
```

## Limits

1. We currently only support projects that include a `package.json` file
2. If the given repository's package.json is larger than 10mB, then you will not be served.
