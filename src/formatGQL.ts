let key: string

export function formatGQL(target: HTMLTextAreaElement, set: React.Dispatch<React.SetStateAction<string>>) {
    const indent = 2
    const position = target.selectionStart
    const value = target.value
    const tab = (reps: number) => (' ').repeat(Math.round(reps / indent) * indent)
    const select = (n: number) => setTimeout(() => target.setSelectionRange(position + n, position + n), 0)
    const insert = (v: string, start?: number, end?: number) => value.slice(0, start ?? position) + v + value.slice(end ?? position)
    target.onkeydown = e => key = e.key
    if (key !== 'Backspace' && value) {
        let ts = value.lastIndexOf('\n', position - 2)
        let ln = value.slice(ts + 1).match(/\S|\n/)?.index ?? indent
        if ((/\(|\{|\[|\"/).test(value[position - 1])) {
            let char: string
            switch (value[position - 1]) {
                case '{': char = '}'; break
                case '(': char = ')'; break
                case '[': char = ']'; break
                case '"': char = '"'; break
                default: char = ''
            }
            set(insert(char))
            return select(0)
        } 
        if ((/\(\n\)|\{\n\}|\[\n\]/).test(value.slice(position - 2, position + 1))) {
            const base = ln >= indent ? tab(ln) : tab(indent)
            const nest = ln >= indent ? base + tab(indent) : base
            const clos = ln >= indent ? base : '' 
            set(insert(`${nest}\n${clos}`))
            return select(nest.length)
        }
        if ((/\n/).test(value[position - 1]) && key === 'Enter') {
            set(insert(tab(ln)))
            return select(ln)
        }
    }
    set(value)
}