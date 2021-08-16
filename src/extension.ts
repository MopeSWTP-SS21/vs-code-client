// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import net = require('net');

import {
	LanguageClient,
	LanguageClientOptions,
	StreamInfo,
	ExecuteCommandRequest,
	ExecuteCommandParams,
	RequestType,
	ParameterStructures,
	RequestType1
} from 'vscode-languageclient/node';

let client: LanguageClient;

class Parameter {
	constructor(readonly label: string, readonly placeholder: string) {}
}

async function executeCommand(command: string, parameters: Parameter[]) {
	let userArgs: string[] = [];
	for (let p of parameters) {
		let options: vscode.InputBoxOptions = {
			prompt: p.label,
			placeHolder: p.placeholder
		};
		let userArg = await vscode.window.showInputBox(options);
		if (userArg === undefined) return; // silently cancel operation if user cancels input
		userArgs.push(userArg);
	}
	let exec: ExecuteCommandParams = {
		command: command,
		arguments: userArgs
	}
	let execPromise = client.sendRequest(ExecuteCommandRequest.type, exec);
	execPromise.then((response) => {
		vscode.window.showInformationMessage(`${command}(${userArgs.join(", ")}) result:\n${response}`);
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Mo|E client activated');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mope-client.connect', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let options: vscode.InputBoxOptions = {
			prompt: "Server port:",
			value: "6667"
		};

		let userPort = vscode.window.showInputBox(options);
		userPort.then((x) => {
			startLanguageClient(parseInt(x ?? "6667"));
		}, (reason) => {
			vscode.window.showInformationMessage("User rejected input for reason "+reason);
		});
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('mope-client.disconnect', () => {
		deactivate();
	});
	context.subscriptions.push(disposable);

	// sendExpression
	disposable = vscode.commands.registerCommand(
		'mope-client.sendExpression',
		() => executeCommand("SendExpression", [
			new Parameter("OM scripting command", "simulate(Modelica.Electrical.Analog.Examples.Rectifier)")
		])
	);
	context.subscriptions.push(disposable);

	// loadFile
	disposable = vscode.commands.registerCommand(
		'mope-client.loadFile',
		() => executeCommand("LoadFile", [
			new Parameter("Filename", "/home/mote/Downloads/example.mo")
		])
	);
	context.subscriptions.push(disposable);

	// checkModel
	disposable = vscode.commands.registerCommand(
		'mope-client.checkModel',
		() => executeCommand("CheckModel", [
			new Parameter("Model name", "Modelica.Electrical.Analog.Examples.Rectifier")
		])
	);
	context.subscriptions.push(disposable);

	// AddPath
	disposable = vscode.commands.registerCommand(
		'mope-client.addPath',
		() => executeCommand("AddPath", [
			new Parameter("Path", "/home/mote/Documents/modelica-libraries")
		])
	);
	context.subscriptions.push(disposable);

	// GetPath
	disposable = vscode.commands.registerCommand(
		'mope-client.getModelicaPath',
		() => executeCommand("GetPath", [])
	);
	context.subscriptions.push(disposable);

	// loadModel
	disposable = vscode.commands.registerCommand(
		'mope-client.loadModel',
		() => executeCommand("LoadModel", [
			new Parameter("Model name", "Modelica.Electrical.Analog.Examples.Rectifier")
		])
	);
	context.subscriptions.push(disposable);

	// getVersion
	disposable = vscode.commands.registerCommand(
		'mope-client.getVersion',
		() => executeCommand("Version", [])
	);
	context.subscriptions.push(disposable);
}

function startLanguageClient(port: number) {
	let connectionInfo = {
		port: port,
		host: "127.0.0.1"
    };

	let serverOptions = () => {
        // Connect to language server via socket
        let socket = net.connect(connectionInfo);
        let result: StreamInfo = {
            writer: socket,
            reader: socket
        };
        return Promise.resolve(result);
    };

	let clientOptions: LanguageClientOptions = {
		// Register the server for Modelica code
		documentSelector: [{ scheme: 'file', language: 'modelica' }],
		synchronize: {
			// Notify the server about file changes to Modelica files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.mo')
		}
	};

	client = new LanguageClient(
		'mopeClient',
		'Mo|E client',
		serverOptions,
		clientOptions
	);

	client.start();

	client.onReady().then(addWorkspaceFoldersToModelicaPath);
}

function addWorkspaceFoldersToModelicaPath() {
	for (let wsf of vscode.workspace.workspaceFolders ?? []) {
		let added = ensurePathIsInModelicaPath(wsf.uri.fsPath);
		added.then((x) => {
			if (x) {
				vscode.window.showInformationMessage(`Added workspace path ${wsf.uri.fsPath} to MODELICAPATH.`);
			}
		})
	}
}

// this method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	// FIXME this information message is currently not shown (maybe because it is cleaned up too early?)
	console.log("Mo|E is being deactivated");
	let msg = vscode.window.showInformationMessage("Mo|E client was deactivated, please reconnect using the command 'Mo|E connect'");
	let res = msg.then(disconnect, disconnect);
	return res;
}

export function disconnect(): Thenable<void> | undefined {
	console.log("Mo|E connection was closed");
	return client.stop();
}
async function ensurePathIsInModelicaPath(fsPath: string) {
	let currentPath: string = await client.sendRequest(ExecuteCommandRequest.type, {
		command: "GetPath",
		arguments: []
	})
	if (currentPath.indexOf(fsPath) >= 0) { return false; }
	await client.sendRequest(ExecuteCommandRequest.type, {
		command: "AddToModelicaPath",
		arguments: [fsPath]
	});
	return true;
}

