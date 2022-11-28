# copadodev-cli

[![Version](https://img.shields.io/npm/v/copadodev-cli.svg)](https://www.npmjs.com/package/copadodev)
[![Greenkeeper](https://badges.greenkeeper.io/anmolgkv/copadodev-cli.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/anmolgkv/copadodev-cli/badge.svg)](https://snyk.io/test/github/anmolgkv/copadodev-cli)
[![Downloads/week](https://img.shields.io/npm/dw/copadodev.svg)](https://www.npmjs.com/package/copadodev)
[![License](https://img.shields.io/npm/l/copadodev.svg)](https://github.com/anmolgkv/copadodev/blob/master/package.json)

## How to install
```sh-session
$ sfdx plugins:install copadodev
```

## Commands
* [`sfdx function:create [-n <string>] [-t shell|python|nodejs] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functioncreate--n-string--t-shellpythonnodejs---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx function:delete -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functiondelete--n-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx function:pull [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functionpull--n-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx function:push [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functionpush--n-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx template:pull [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-templatepull--n-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx template:push [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-templatepush--n-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

### `sfdx function:create [-n <string>] [-t shell|python|nodejs] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Create a new function

```
USAGE
  $ sfdx function:create [-n <string>] [-t shell|python|nodejs] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Api Name of function
  -t, --type=(shell|python|nodejs)                                                  Type of function script
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Create a new function

EXAMPLES
  $ sfdx copadodev:function:create -n 'functionName' -t 'nodejs'
```

_See code: [src/commands/function/create.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/function/create.ts)_

### `sfdx function:delete -n <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Delete function from org and local

```
USAGE
  $ sfdx function:delete -n <string> [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                (required) Api Name of function
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Delete function from org and local

EXAMPLES
  $ sfdx copadodev:function:delete -n 'functionName'
```

_See code: [src/commands/function/delete.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/function/delete.ts)_

### `sfdx function:pull [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Fetch function from org

```
USAGE
  $ sfdx function:pull [-n <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Api Name of function
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Fetch function from org

EXAMPLES
  $ sfdx copadodev:function:pull -n 'functionName'
```

_See code: [src/commands/function/pull.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/function/pull.ts)_

### `sfdx function:push [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Push function to org

```
USAGE
  $ sfdx function:push [-n <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Api Name of function
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Push function to org

EXAMPLES
  $ sfdx copadodev:function:push -n 'functionName'
```

_See code: [src/commands/function/push.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/function/push.ts)_

### `sfdx template:pull [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Fetch Template and its related steps from org

```
USAGE
  $ sfdx template:pull [-n <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Template API Name
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Fetch Template and its related steps from org

EXAMPLES
  $ sfdx copadodev:template:pull -n {Template API Name}
```

_See code: [src/commands/template/pull.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/template/pull.ts)_

### `sfdx template:push [-n <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Push Template and its related steps to org

```
USAGE
  $ sfdx template:push [-n <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Template API Name
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Push Template and its related steps to org

EXAMPLES
  $ sfdx copadodev:template:push -n {Template API Name}
```

_See code: [src/commands/template/push.ts](https://github.com/anmolgkv/copadodev-cli/blob/v0.0.1/src/commands/template/push.ts)_
