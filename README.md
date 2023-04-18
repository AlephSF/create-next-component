# Create Next Component

From anywhere in your project run `npx @aleph/create-next-component`

This is a tiny, opinionated command line script that, when run, will ask you
for a component name (CapitalizeAndCamelCaseItPlease) and then generate a simple
boilerplate component in the `app/components` folder of your NextJS (or really any)
project. The boilerplate includes, all in a folder like `app/components/ComponentName`:
- The TypeScript component in `ComponentName.tsx`
- A Sass-driven css module like `componentName.module.scss`
- A Storybook story at like `ComponentName.stories.tsx`
- A Document file in MDX like `ComponentNameDoc.mdx`

That's all it does, there ain't no more. 