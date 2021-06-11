// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import net = require('net');

import {
	LanguageClient,
	LanguageClientOptions,
	StreamInfo,
	ServerOptions,
	TransportKind,
	ExecuteCommandRequest,
	ExecuteCommandOptions,
	ExecuteCommandParams
} from 'vscode-languageclient/node';

let client: LanguageClient;

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

	disposable = vscode.commands.registerCommand('mope-client.loadModel', () => {
		let options: vscode.InputBoxOptions = {
			prompt: "Model name:",
			placeHolder: "Modelica.Electrical.Analog.Examples.Rectifier"
		};
		let userModel = vscode.window.showInputBox(options);
		userModel.then((x) => {
			let exec: ExecuteCommandParams = {
				command: "loadModel",
				arguments: [x ?? ""]
			}
			let execPromise = client.sendRequest(ExecuteCommandRequest.type, exec);
			execPromise.then((x) => {
				console.log("Server finished loading "+(x ?? ""));
			});
		}, (reason) => {
			vscode.window.showInformationMessage("User rejected input for reason "+reason);
		});
	});
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
}

// this method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	console.log("Mo|E was deactivated");
	return client.stop();
}
