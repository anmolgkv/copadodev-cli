copadoDev
=========



[![Version](https://img.shields.io/npm/v/copadoDev.svg)](https://npmjs.org/package/copadoDev)
[![CircleCI](https://circleci.com/gh/anmolgkv/copadoDev/tree/master.svg?style=shield)](https://circleci.com/gh/anmolgkv/copadoDev/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/anmolgkv/copadoDev?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/copadoDev/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/anmolgkv/copadoDev.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/anmolgkv/copadoDev/badge.svg)](https://snyk.io/test/github/anmolgkv/copadoDev)
[![Downloads/week](https://img.shields.io/npm/dw/copadoDev.svg)](https://npmjs.org/package/copadoDev)
[![License](https://img.shields.io/npm/l/copadoDev.svg)](https://github.com/anmolgkv/copadoDev/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g copadoDev
$ sfdx COMMAND
running command...
$ sfdx (--version)
copadoDev/0.0.1 darwin-arm64 node-v16.0.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx function:create [-n <string>] [-t shell|python|nodejs] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functioncreate--n-string--t-shellpythonnodejs--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx function:pull [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-functionpull--n-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx function:create [-n <string>] [-t shell|python|nodejs] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Create a new function

```
USAGE
  $ sfdx function:create [-n <string>] [-t shell|python|nodejs] [-u <string>] [--apiversion <string>] [--json]
    [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Api Name of function
  -t, --type=(shell|python|nodejs)                                                  Type of function script
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Create a new function

EXAMPLES
  $ sfdx copadodev:function:create -n 'functionName' -t 'nodejs'
```

_See code: [src/commands/function/create.ts](https://github.com/anmolgkv/copadoDev/blob/v0.0.1/src/commands/function/create.ts)_

## `sfdx function:pull [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Create a new function

```
USAGE
  $ sfdx function:pull [-n <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                Api Name of function
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  Create a new function

EXAMPLES
  $ sfdx copadodev:function:create -n 'functionName' -t 'nodejs'
```

_See code: [src/commands/function/pull.ts](https://github.com/anmolgkv/copadoDev/blob/v0.0.1/src/commands/function/pull.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
