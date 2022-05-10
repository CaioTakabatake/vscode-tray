const { resolve, basename } = require('path');
const { app, Menu, Tray, dialog, Notification } = require('electron');
const data = require('./data');
const { spawn } = require('child_process');

async function render(tray) {
    let projects = []
    const projectsArquive = await data.getAllData();

    projectsArquive.forEach(e => {
        projects.push({
            label: e.name,
            type: 'submenu',
            submenu: [
                {
                    label: 'Abrir com o VSCode',
                    type: 'normal',
                    click: () => {
                        spawn('code', [e.path], { shell: true });
                        new Notification({ title: 'PROJETO ABERTO', body: `O PROJETO ${e.name} ESTÁ SENDO ABERTO!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()
                    }
                },
                {
                    label: 'Remover projeto',
                    type: 'normal',
                    click: () => {
                        data.removeData(e.path);
                        new Notification({ title: 'PROJETO REMOVIDO', body: `O PROJETO ${e.name} FOI DELETADO!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()
                        setTimeout(() => { render(tray); }, 100);
                    }
                }
            ],
        });
    });

    const contextMenu = new Menu.buildFromTemplate([
        {
            label: 'Adicionar Projeto',
            type: 'normal',
            click: async () => {
                const result = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
                if (!result) return;
                const [path] = result;
                data.saveData(path, basename(path));
                new Notification({ title: 'PROJETO ADICIONADO', body: `O PROJETO ${basename(path)} FOI ADICIONADO!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show()
                setTimeout(() => { render(tray); }, 100);
            }
        },
        {
            type: 'separator'
        },
        ...projects
    ]);

    tray.setContextMenu(contextMenu)
}

app.on('ready', async () => {
    const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));

    render(tray);
});