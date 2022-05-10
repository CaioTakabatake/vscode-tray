const jsonfile = require('jsonfile-promised');

module.exports = {
    saveData(path, basename) {
        const pathJson = `${__dirname}/projects.json`;
        jsonfile.readFile(pathJson).then(async file => {
            file.push({
                "name": basename,
                "path": path
            });

            jsonfile.writeFile(pathJson, file);
        })
    },
    getAllData() {
        const pathJson = `${__dirname}/projects.json`;
        return jsonfile.readFile(pathJson);
    },
    removeData(path) {
        const pathJson = `${__dirname}/projects.json`;
        jsonfile.readFile(pathJson).then(async file => {
            let data = file.filter(item => item.path !== path);
            
            jsonfile.writeFile(pathJson, data);
        });
    }
}