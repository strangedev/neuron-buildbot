# neuron-buildbot

CI for [srid/neuron](https://github.com/srid/neuron).

With this, you can store your zettelkasten in git and regenerate the
static site every time you push.

It reacts to [webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/creating-webhooks).

## Configuration

There are two config files: `config.json` and `secrets.json`.

Although the bot is intended for use in a docker container, you may run it on bare metal.

In any case, the main config file `config.json` is expected to be at `/etc/neuron_buildbot/config.json`. The credentials file may be provided through the `neuron_buildbot` docker secret, or as a file in `$HOME/.neuron_buildbot/secrets.json`.

### `config.json`

|parameter|type|description|example|
|---------|----|-----------|-------|
|port|number|What port the buildbot will listen on for webhooks from your git provider.|`3000`|
|repositoryUrl|string|URL to your repository. Only HTTPS is supported.|`"https://github.com/strangedev/test-zettels.git"`|
|localRepositoryPath|string|Where the zettels are stored locally.|`/zettels`|
|provider|string|The git provider. At the moment, only `"GitHub"` and `"gitea"` are supported.|`"GitHub"`|
|authFlow|string|Which authentication flow to use. For public repositories, choose `"None"`. For private repositories without 2FA, choose `"PasswordFlow"`. For private repositories with 2FA, choose `"TokenFlow"`.|`"PasswordFlow"`|
|useDockerSecrets|boolean|Whether `secrets.json` is provided through docker secrets.|`false`|

#### Full example
```json
{
    "port": 8080,
    "repositoryUrl": "https://github.com/strangedev/test-zettels.git",
    "localRepositoryPath": "/zettels",
    "provider": "GitHub",
    "authFlow": "None",
    "useDockerSecrets": true
}
```

### `secrets.json`

In general, when you are trying to build from a public repository,
no secrets are needed. When using a private repository, you'll need
to provide credentials.

Depending on the chosen auth flow, you need either
`passwordFlowOptions` or `tokenFlowOptions`.

#### Using `PasswordFlow`

|parameter|type|description|
|---------|----|-----------|
|username|string|Your username at the chosen git provider|
|password|string|Your password for the chosen git provider|

#### Using `TokenFlow`

|parameter|type|description|
|---------|----|-----------|
|username|string|Your username at the chosen git provider|
|token|string|Your personal access token|

You'll need to set the appropriate permissions for the token.
For GitHub, set `repo` permissions.

#### Full example
```json
{
    "tokenFlowOptions": {
        "username": "strangedev",
        "token": "0123456789DEADBEEF"
    }
}
```

## How to use with other software

You may mount the `localRepositoryPath` of your `neuron-buildbot` container
to the docker host, or use a named volume to expose it to other containers.

Take a look at [strangedev/neuron-viewer](https://github.com/strangedev/neuron-viewer)
for an example of a simple deployment with nginx and basic auth.

## Contributing

Contributions need to pass the eslint rules.

## Thanks

Thanks to @yeldiRium for TypeScript support.