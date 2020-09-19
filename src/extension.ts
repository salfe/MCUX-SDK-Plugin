// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {sdkTreeData} from './sdk_tree';
import * as  fs from "fs";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "test" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('mcux_sdk.opendir', () => {
		let options = {
			canSelectFiles: false,		
			canSelectFolders: true,		
			canSelectMany: true,		
			defaultUri: vscode.Uri.file("c:"),	
			openLabel: '选择文件夹'
		};
		
		vscode.window.showOpenDialog(options).then(result => {
			if(result === undefined){
				vscode.window.showInformationMessage("can't open dir.");
			}
			else{
				var loadDir = "";
				var loadUri = "";
				var i:number;
				for (i = 0; i < result.length; i++)
				{
					loadUri = result[i].path.toString();
					loadDir = loadDir.concat(loadUri.substr(1, loadUri.length).concat("*"));
				}
				//vscode.window.showInformationMessage("open dir: " + result.toString());
				vscode.window.registerTreeDataProvider('mcux_sdk', new sdkTreeData(loadDir));
			}
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('sdkTreeItem.itemClick', (label, filePath) => {
		//console.log("label : " + label);
		//console.log("filePath : " + filePath);

		if(fs.statSync(filePath).isDirectory())
		{
			//TODO
		}
		else
		{
			let editor = vscode.window.activeTextEditor;

			if(editor != undefined)
			{
				//console.log(editor.document.uri.fsPath);
				if(editor.document.uri.fsPath.toLowerCase() == filePath.toString().toLowerCase())
				{
					var openPath = vscode.Uri.file(filePath);
					vscode.workspace.openTextDocument(openPath).then(doc => {
						vscode.window.showTextDocument(doc, { preview: false });
					});
				}
				else
				{
					var openPath = vscode.Uri.file(filePath);
					vscode.workspace.openTextDocument(openPath).then(doc => {
						vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
					});
				}
			}
			else{
					var openPath = vscode.Uri.file(filePath);
					vscode.workspace.openTextDocument(openPath).then(doc => {
						vscode.window.showTextDocument(doc);
					});
			}
		}
		

	}));

	context.subscriptions.push(vscode.commands.registerCommand('mcux_sdk.item.generate_project', (label, filePath) => {
		console.log("generate project");

	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
