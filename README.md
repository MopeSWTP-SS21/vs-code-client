# VS Code client for Mo|E (SWTP2021 edition)

This repository contains an extension for Visual Studio Code that uses LSP to communicate with the Mo|E server.
It is currently only used for testing purposes.

## "Quick" start

Since this project is still in its early stages, the workflow to get everything running is a little complicated.
I plan to make this easier in the future.
For now, you have to do the following:

* Follow the setup instructions of either [MopeSWTP-SS21/MopeSWTP](https://github.com/MopeSWTP-SS21/MopeSWTP) or [MopeSWTP-SS21/LSP4J-test-CS](https://github.com/MopeSWTP-SS21/LSP4J-test-CS).
* Install [VS Code](https://code.visualstudio.com/) and [node.js](https://nodejs.org/en/) through your favorite package manager.
* Clone this repository.
* Run `npm install` in your working copy of this repository in order to install the node modules that this extension depends upon.
* Create a VS Code project that has the working copy of this repository as the only workspace folder (this is needed, because the repo contains a `.vscode` folder with settings that are required to test the extension). You can do this with the following steps:
    * Open a new window in VS code.
    * Select File -> Add folder to workspace ...
    * Add the folder containing this repository and save the workspace using File -> Save Workspace As ...

Once this is all done, you can use the following steps to start experimenting with the client:

* Start either [MopeSWTP-SS21/MopeSWTP](https://github.com/MopeSWTP-SS21/MopeSWTP) or the `DiagnosticServer` in [MopeSWTP-SS21/LSP4J-test-CS](https://github.com/MopeSWTP-SS21/LSP4J-test-CS). The latter can be done from IntelliJ by simply opening the class `de.thm.mni.swtp.cs.lsp4jtest.diagnostic.DiagnosticServer` and press CRTL+SHIFT+F10. This should result in the logging message `INFO: Server socket listening on port 6667`.
* Open this repo in your VS Code workspace and press F5. A new VS Code window should open that allows you to send the following commands via CTRL+SHIFT+P.
* Use the command `Mo|E: connect` (via CTRL+SHIFT+P) to connect to the Mo|E server.
* Open and save a file ending with `.mo` to issue a `workspace/didChangeWatchedFiles` event to the server.
* Use the command `Mo|E: loadModel` to send a `workspace/executeCommand` to the server with the command `loadModel` and the argument specified by the prompt.
* Use the command `Mo|E: disconnect` to properly shut the server down.

## Project structure

The most important files of this (and any) VS code extension are `package.json`, which contains the definition of available commands for VS code, and `src/extension.ts`, which defines how the client reacts to these commands.

For the most part, the messages that the client sends are predefined by the class `LanguageServer` in the node module `vscode-languageclient/node`. You can find the [source code of vscode-languageclient](https://github.com/microsoft/vscode-languageserver-node) on GitHub, and it will be downloaded to the folder `node_modules` when you follow the above instructions to install this extension.

## Known issues

While the `LanguageClient` class does honor the `ServerCapabilities` sent by the server, there seem to be some capabilities that are not allowed to be null/undefined, such as `textDocumentSync`.
This leads to errors in the client code of the type `cannot something something of undefined`.
There seem to be other instances, where such missing or wrong capabilities do not result in an error, but in the client simply asking the server to shut down.
This is the case when a new workspace folder is added while the Mo|E client is active.
I am not entirely sure if this is really connected to `ServerCapabilities` or to some other error.