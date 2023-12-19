const { Config } = require("./config");

const path = require("path");
const fs = require("fs");
const { readFile } = require("node:fs/promises");

const config = new Config();

function get_note_path(name) {
    return path.join(config.base_path, name);
}

function get_note_file(name) {
    return path.join(get_note_path(name), "README.md");
}

function get_note_tagsfile(name) {
    return path.join(get_note_path(name), "tags.txt");
}

function check_filename(name) {
    const invalid_chars = ['<','>',':','/','\\','|','?','*'];
    if (invalid_chars.some(c => name.includes(c))) {
        throw new Error(`invalid file name: the following characters are not allowed ${invalid_chars.join(',')}`);
    }
}

module.exports.list = async function() {
    const files = fs.readdirSync(config.base_path);
    const notes = [];

    for(let file of files) {
        const note = get_note_file(file);
        const stat = fs.statSync(note);
        if (stat.isFile()) {
            notes.push(file);
        }
    }

    return notes;
};

module.exports.read = async function(_, name) {
    const note = get_note_file(name);
    const contents = await readFile(note, { encoding: 'utf8' });

    return contents;
};

module.exports.create = async function() {
    let id = 0;
    let name = "Untitled";
    let note_path = get_note_path(name);
    while (fs.existsSync(note_path)) {
        id++;
        name = `Untitled ${id}`;
        note_path = get_note_path(name);
    }

    fs.mkdirSync(note_path);
    const readme = path.join(note_path, "README.md");
    fs.writeFileSync(readme, `# ${name}`, { encoding: 'utf-8'});
    return name;
};

module.exports.rename = async function(_, old_name, new_name) {
    check_filename(new_name);

    const old_path = get_note_path(old_name);
    const new_path = get_note_path(new_name);

    fs.renameSync(old_path, new_path);
}

module.exports.write = async function(_, name, contents) {
    const readme = get_note_file(name);
    fs.writeFileSync(readme, contents, { encoding: 'utf-8'});
}

module.exports.remove = async function(_, name) {
    note_path = get_note_path(name);
    fs.rmSync(note_path, {force: true, recursive: true});
}

module.exports.read_tags = async function(_, name) {
    try {
        const tags_file = get_note_tagsfile(name);
        const contents = await readFile(tags_file, { encoding: 'utf8' });
        const tags = contents.split("\n").filter(n => n);
        return tags;
    }
    catch (ex) {
        return [];
    }
}

module.exports.write_tags = async function(_, name, tags) {
    const tags_file = get_note_tagsfile(name);
    const contents = tags.join('\n');
    fs.writeFileSync(tags_file, contents, { encoding: 'utf-8'});
}
