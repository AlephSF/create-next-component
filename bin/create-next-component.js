#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function findProjectRoot() {
  let currentDir = process.cwd()
  while (currentDir !== '/') {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }
  throw new Error('Unable to find project root')
}

const projectRoot = findProjectRoot()
const defaultComponentDir = path.join(projectRoot, 'app', 'components')

function createComponent(componentName, componentDir) {
  const componentBaseDir = path.join(componentDir, componentName)
  if (!fs.existsSync(componentBaseDir)) {
    fs.mkdirSync(componentBaseDir, { recursive: true })
  }

  const tsxContent = `'use client'

import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './${componentName}.module.scss'

interface ${componentName}Props {
  text: string
}

const ${componentName}: React.FC<${componentName}Props> = ({ text }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = \`\${text} - \${count} times\`
  }, [count, text])

  const containerClasses = classNames(styles.container, styles.someOtherClass)

  return (
    <div className={containerClasses}>
      <h1>{text}</h1>
      <button
        type='button'
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
      <p>
        You clicked
        {count}
        times
      </p>
    </div>
  )
}

export default ${componentName}
`

  const scssContent = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.someOtherClass {
  /* Add your styles here */
}
`

  const storyContent = `import type { Meta, StoryObj } from '@storybook/react'
import ${componentName} from '.'

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  //   tags: ['autodocs'], // Uncomment if you aren't using an MDX file for docs here
}

export default meta

type Story = StoryObj<typeof ${componentName}>;

export const Foo: Story = {
  args: {
    text: 'Hello World!',
  },
}

export const Bar: Story = {
  args: {
    text: 'Hello World, different variation!',
  },
}
`

  const docsContent = `{/* ${componentName}.mdx */}

import { Canvas, Meta, Story } from '@storybook/blocks'
import * as ${componentName}Stories from './${componentName}.stories'

<Meta of={${componentName}Stories} />

# ${componentName} Component
  
This is the text describing the \`${componentName}\` component. It is written in MDX so you can use
Markdown for stuff like code snippets:
\`\`\`html
<div>Yo!</div>
\`\`\`

Then include your component story/stories by importing them as props inside the React \`Canvas\`
component. For instance, if you have a Story called \`Foo\` inside your story, and another
one called \`Bar\` inside it, you could write some stuff in markdown and then go get the 
whole story like this:
\`\`\`jsx
<Canvas of={${componentName}Stories.Foo} />

<Canvas of={${componentName}Stories.Bar} />
\`\`\`

Which will then look like this:

<Canvas of={${componentName}Stories.Foo} />

<Canvas of={${componentName}Stories.Bar} />
  
`

  fs.writeFileSync(path.join(componentBaseDir, `${componentName}.tsx`), tsxContent)
  fs.writeFileSync(path.join(componentBaseDir, `${componentName}.module.scss`), scssContent)
  fs.writeFileSync(path.join(componentBaseDir, `${componentName}.stories.tsx`), storyContent)
  fs.writeFileSync(path.join(componentBaseDir, `${componentName}.mdx`), docsContent)

  const indexContent = `export { default } from './${componentName}'\n`

  fs.writeFileSync(path.join(componentBaseDir, 'index.ts'), indexContent)
}
function validateComponentName(componentName) {
  return componentName.charAt(0) === componentName.charAt(0).toUpperCase()
}

function askComponentName(callback) {
  rl.question('Please enter the component name: ', (componentName) => {
    if (validateComponentName(componentName)) {
      callback(componentName)
    } else {
      const capitalizedComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)
      rl.question(
        `Component names should be capitalized. Did you mean "${capitalizedComponentName}"? (y/n) `,
        (answer) => {
          if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            callback(capitalizedComponentName)
          } else {
            console.log('Please enter a capitalized component name.')
            askComponentName(callback)
          }
        },
      )
    }
  })
}

askComponentName((componentName) => {
  createComponent(componentName, defaultComponentDir)
  console.log(`Component '${componentName}' has been generated.`)
  rl.close()
})
