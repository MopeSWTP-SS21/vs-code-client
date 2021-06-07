// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import net = require('net');

import {
	LanguageClient,
	LanguageClientOptions,
	StreamInfo,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mope-client" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('mope-client.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Mo|E client!');
	});

	context.subscriptions.push(disposable);

	let connectionInfo = {
		port: 6667,
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
	return client.stop();
}
