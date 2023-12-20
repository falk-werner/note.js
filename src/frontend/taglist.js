class TagList
{
    #element;
    #tags;
    #on_filter_changed;

    constructor(element, on_filter_changed) {
        this.#element = element;
        this.#on_filter_changed = on_filter_changed;
        this.#tags = { }
        this.update();
    }

    get active_tags() {
        const result = [];
        for (const [tag, is_active] of Object.entries(this.#tags)) {
            if (is_active) {
                result.push(tag);
            }
        }
        return result;
    }

    async update() {
        let added = false;
        const all_tags = {};

        const notes = await note.list();
        for (const name of notes) {
            const tags = await note.read_tags(name);
            for (const tag of tags) {
                if (tag in this.#tags) {
                    all_tags[tag] = this.#tags[tag];
                }
                else {
                    added = true;
                    all_tags[tag] = false;
                    this.#tags[tag] = false;
                }
            }
        }

        const removed = (Object.keys(this.#tags).length != Object.keys(all_tags).length); 
        if (added || removed) {
            this.#tags = all_tags;
            this.#element.innerHTML = "";
            for(const [tag, is_active] of Object.entries(all_tags)) {
                const tag_element = document.createElement("a");
                this.#element.append(tag_element);
                tag_element.innerText = tag;
                tag_element.setAttribute("href", "#");
                if (is_active) {
                    tag_element.className = "active";
                }
                tag_element.addEventListener("click", () => {
                    tag_element.classList.toggle("active");
                    this.#tags[tag] = tag_element.classList.contains("active");
                    this.#on_filter_changed();
                });
            }
            this.#on_filter_changed();
        }
    }
}

export { TagList };