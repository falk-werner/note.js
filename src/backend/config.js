const os = require("os");
const path = require("path");
const fs = require("fs");
const yaml = require("yaml");

class Config {

    constructor() {
        const default_config = {
            base_path: "{home}/.notes"
        };

        this.config = {...default_config, ...this.#load_config()};

        if (!fs.existsSync(this.note_path)) {
            fs.mkdirSync(this.note_path, {recursive: true});
        }
    }

    #load_config() {
        try {
            const homedir = os.homedir();
            const filename = path.join(homedir, ".notejs.yml");
            const contents = fs.readFileSync(filename, 'utf-8');
            return yaml.parse(contents);
        }
        catch (ex) {
            console.log(ex);
            return {};
        }
    }

    get #base_path() {
        const template = this.config.base_path;
        const homedir = os.homedir();
        const base_path = template.replaceAll("{home}", homedir);

        return base_path;

    }

    get note_path() {
        return this.#base_path;
    }

}

module.exports.Config = Config;
