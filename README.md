
# Move your built index.html where you want from Angular CLI

### Prerequisites 
- Angular project created via [Angular CLI](https://github.com/angular/angular-cli) v8.3.0 or greater.
- [Angular CLI](https://github.com/angular/angular-cli) installed globally

### Steps: 
1. run `ng add @ds-builder/deploy --project={projectName} --source={sourcePath} --destination={destinationPath}` to add necessary dependencies.

2. run `ng deploy`

## Builder

You can find the Architect builder in the `src` directory.

## Sample application

The sample application which uses the Architect builder is available under the `builder-test` directory.

## License

MIT 

## Setup

1. Open `src` and run `npm install`
2. Run `npm run build`
3. Run this command to link the package `npm link`