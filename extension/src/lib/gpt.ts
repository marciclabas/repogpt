export type GptFields = {
  name: string
  description: string
  instructions: string
}

export function enterGptFields({ name, description, instructions }: GptFields) {
  function setBySelector(selector: string, value: string) {
    const element = document.querySelector(selector) as HTMLInputElement
    element.value = value
    element.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  setBySelector('[data-testid="gizmo-name-input"]', name)
  setBySelector('[data-testid="gizmo-description-input"]', description)
  setBySelector('[data-testid="gizmo-instructions-input"]', instructions)
}

export type GptFile = {
  name: string
  content: string
}

export async function uploadGptFiles(files: GptFile[]) {
  
  function uploadFiles(input: HTMLInputElement, files: GptFile[]) {
    const dataTransfer = new DataTransfer();
    for (const { name, content } of files) {
      const file = new File([content], name);
      dataTransfer.items.add(file);
    }
    input.files = dataTransfer.files;
    console.log('Set files:', input.files);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  while (true) { // eslint-disable-line no-constant-condition
    const filesInput = document.querySelectorAll('input[type="file"]')[1];
    if (filesInput)
      return uploadFiles(filesInput as any, files);
    else
      await new Promise(resolve => setTimeout(resolve, 100))
  }
}

const quote = '```'

function titleCase(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

function instructions(repo: string) {
  return `You have access to the ${repo} repo. The user will ask you questions related to it. Consult your knowledge to provide accurate answers.

Your knowledge consists of files "0.txt", "1.txt", ..., each containing a certain number of files of the original repo.
Files are contatenated with a header indicating their original path. For example:

${quote}
================================================================================
README.md
================================================================================

<content of README.md>

================================================================================
src/index.js
================================================================================

<content of src/index.js>
${quote}
`
}


export function gptFields(repo: string): GptFields {
  return {
    name: `${titleCase(repo)} GPT`,
    description: `An expert programmer of the ${repo} repo`,
    instructions: instructions(repo)
  }
}