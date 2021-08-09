# VS Code client for Mo|E (SWTP2021 edition)

This repository contains an extension for Visual Studio Code that uses LSP to communicate with the Mo|E server.
It is currently only used for testing purposes.

## Quick start

Since version 0.0.1, the extension is now available as VSIX file, which can be installed as follows:

* Download the VSIX file from the latest release.
* Open the command palette with CTRL+SHIFT+P.
* Select the command "Extensions: Install from VSIX...".
* Select the file you just downloaded.
* You should now see several commands starting with "Mo|E:" in the command palette.

Currently, the extension does not start the server itself, so you have to refer to the README of [MopeSWTP-SS21/MopeSWTP](https://github.com/MopeSWTP-SS21/MopeSWTP) to do this.
We chose this setup, because it allows connecting to a server that is attached to a debugger in an IDE.

Once you have installed the extension and started the server, you can connect to the server using the following commands:

* Use the command `Mo|E: connect` (via CTRL+SHIFT+P) to connect to the Mo|E server. You have to enter the server port that is shown on the console when you start the server. The host is currently locked to the local host.
* Use the command `Mo|E: loadModel` (or any of the other `Mo|E:` commands besides `connect` and `disconnect`) to send a `workspace/executeCommand` to the server with the command `loadModel` and the argument specified by the prompt.
* Use the command `Mo|E: disconnect` to properly shut the server down.

## Development setup

In order to set up the project for development, you have to do the following:

* Follow the setup instructions of either [MopeSWTP-SS21/MopeSWTP](https://github.com/MopeSWTP-SS21/MopeSWTP) or [MopeSWTP-SS21/LSP4J-test-CS](https://github.com/MopeSWTP-SS21/LSP4J-test-CS).
* Install [VS Code](https://code.visualstudio.com/) and [node.js](https://nodejs.org/en/) through your favorite package manager.
* Clone this repository.
* Run `npm install` in your working copy of this repository in order to install the node modules that this extension depends upon.
* Create a VS Code project that has the working copy of this repository as the only workspace folder (this is needed, because the repo contains a `.vscode` folder with settings that are required to test the extension). You can do this with the following steps:
    * Open a new window in VS code.
    * Select File -> Add folder to workspace ...
    * Add the folder containing this repository and save the workspace using File -> Save Workspace As ...

Once this is all done, you can press F5 in VS Code to open a new VS Code instance that has the extension installed and is connected to a debug session in the development window.

## Project structure

The most important files of this (and any) VS code extension are `package.json`, which contains the definition of available commands for VS code, and `src/extension.ts`, which defines how the client reacts to these commands.

For the most part, the messages that the client sends are predefined by the class `LanguageServer` in the node module `vscode-languageclient/node`. You can find the [source code of vscode-languageclient](https://github.com/microsoft/vscode-languageserver-node) on GitHub, and it will be downloaded to the folder `node_modules` when you follow the above instructions to install this extension.

## Known issues

While the `LanguageClient` class does honor the `ServerCapabilities` sent by the server, there seem to be some capabilities that are not allowed to be null/undefined, such as `textDocumentSync`.
This leads to errors in the client code of the type `cannot something something of undefined`.
There seem to be other instances, where such missing or wrong capabilities do not result in an error, but in the client simply asking the server to shut down.
This is the case when a new workspace folder is added while the Mo|E client is active.
I am not entirely sure if this is really connected to `ServerCapabilities` or to some other error.

## Resources

I used the following resources (among others) to build this client:

* [vscode-extension-samples/lsp-sample](https://github.com/Microsoft/vscode-extension-samples/tree/main/lsp-sample)
* [microsoft/vscode-languageserver-node](https://github.com/microsoft/vscode-languageserver-node)
* [VS Code extension guide](https://code.visualstudio.com/api/get-started/your-first-extension)
* [VS Code Language server extension guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
* [LSP specification](https://microsoft.github.io/language-server-protocol/specifications/specification-current/)
