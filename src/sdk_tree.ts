
import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, ProviderResult, window } from "vscode";
import * as  fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';

export class sdkTreeData implements TreeDataProvider<sdkTreeItem>{
    constructor(private rootPath: string){
    }

    getTreeItem(element: sdkTreeItem) : sdkTreeItem | Thenable<sdkTreeItem> {
        return element;
    }

    getChildren(element?: sdkTreeItem | undefined): ProviderResult<sdkTreeItem[]>{
        if(!this.rootPath){
            window.showInformationMessage('No file in empty directory');
            return Promise.resolve([]);
        }
        if(element === undefined){
            let pathArray = this.rootPath.split("*");
            var treeDir: sdkTreeItem[] = [];

            for(let entry of pathArray)
            {
                var folderName = entry.split("/").reverse()[0];
                if(entry != "")
                {
                    if(fs.statSync(entry).isDirectory())
                    {
                        treeDir.push(new sdkTreeItem(folderName, entry.split(folderName)[0], TreeItemCollapsibleState.Collapsed));
                    }
                    else
                    {
                        treeDir.push(new sdkTreeItem(folderName, entry.split(folderName)[0], TreeItemCollapsibleState.None));
                    }
                }
            }
            return Promise.resolve(treeDir);
        }
        else{
            return Promise.resolve(this.searchFiles(path.join(element.parentPath, element.label)));
        }
    }

    private searchFiles(parentPath: string): sdkTreeItem[] {
        var treeDir: sdkTreeItem[] = [];
        if(this.pathExists(parentPath)){
            var fsReadDir = fs.readdirSync(parentPath, 'utf-8');
            fsReadDir.forEach(fileName => {
                var filePath = path.join(parentPath, fileName);
                if(fs.statSync(filePath).isDirectory()){
                    treeDir.push(new sdkTreeItem(fileName, parentPath, TreeItemCollapsibleState.Collapsed));
                }
                else{
                    treeDir.push(new sdkTreeItem(fileName, parentPath, TreeItemCollapsibleState.None));
                }
            });
        }

        console.log(treeDir);        
        return treeDir;
    }   

    private pathExists(filePath: string): boolean{
        try{
            fs.accessSync(filePath);
        }
        catch(err){
            return false;
        }
        return true;
    }
}

export class sdkTreeItem extends vscode.TreeItem{
    constructor(
        public readonly label: string,      
        public readonly parentPath: string,  
        public readonly collapsibleState: TreeItemCollapsibleState
    ){
        super(label, collapsibleState);
    }

    //get tooltip():string{
   //   return path.join(this.parentPath, this.label);
   // }

    command = {
        title: "this.label",
        command: 'sdkTreeItem.itemClick',
        tooltip: path.join(this.parentPath, this.label),
        arguments: [    
            this.label,
            path.join(this.parentPath, this.label)
        ]
    };

    contextValue = 'sdkTreeItem';
}